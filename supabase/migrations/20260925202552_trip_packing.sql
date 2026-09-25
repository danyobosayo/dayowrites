create table public.trip_packing_trips (
  id uuid primary key,
  slug text not null unique
);

create table public.trip_packing_items (
  id uuid primary key,
  trip_id uuid not null references public.trip_packing_trips(id),
  category text not null check (category in ('lake','food','games','ssam','cooking')),
  name text not null check (length(btrim(name)) between 1 and 160),
  quantity numeric check (quantity >= 0 and quantity <= 10000 and quantity <> 'NaN'::numeric),
  unit text not null default '' check (length(unit) <= 80),
  packed boolean not null default false,
  deleted boolean not null default false,
  version integer not null default 1 check (version > 0),
  position integer not null,
  updated_at timestamptz not null default now()
);
create index trip_packing_items_trip_position on public.trip_packing_items(trip_id, position, id);

alter table public.trip_packing_trips enable row level security;
alter table public.trip_packing_items enable row level security;
revoke all on public.trip_packing_trips, public.trip_packing_items from public, anon, authenticated;
grant select, insert, update, delete on public.trip_packing_trips, public.trip_packing_items to service_role;

create function public.bump_trip_item_version() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.version = old.version + 1;
  new.updated_at = clock_timestamp();
  return new;
end;
$$;
revoke all on function public.bump_trip_item_version() from public, anon, authenticated;
grant execute on function public.bump_trip_item_version() to service_role;
create trigger trip_item_version before update on public.trip_packing_items
for each row execute function public.bump_trip_item_version();

create function public.add_trip_packing_item(p_trip uuid, p_id uuid, p_category text, p_name text, p_quantity numeric, p_unit text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare result public.trip_packing_items;
begin
  -- Serialize additions to this trip, including retries, ordering, and the size limit.
  perform 1 from public.trip_packing_trips where id = p_trip for update;
  if not found then raise exception 'Trip not found'; end if;
  select * into result from public.trip_packing_items where id = p_id and trip_id = p_trip;
  if found then return to_jsonb(result); end if;
  if (select count(*) from public.trip_packing_items where trip_id = p_trip) >= 500 then
    raise exception 'Item limit reached' using errcode = '54000';
  end if;
  insert into public.trip_packing_items(id,trip_id,category,name,quantity,unit,position)
  values(p_id,p_trip,p_category,p_name,p_quantity,p_unit,
    (select coalesce(max(position),-1)+1 from public.trip_packing_items where trip_id = p_trip)) returning * into result;
  return to_jsonb(result);
end;
$$;
revoke all on function public.add_trip_packing_item(uuid,uuid,text,text,numeric,text) from public, anon, authenticated;
grant execute on function public.add_trip_packing_item(uuid,uuid,text,text,numeric,text) to service_role;

create function public.set_trip_packing_items(p_trip uuid, p_items jsonb, p_packed boolean)
returns setof public.trip_packing_items language plpgsql security invoker set search_path = '' as $$
declare expected integer;
begin
  if jsonb_typeof(p_items) <> 'array' then raise exception 'Invalid items'; end if;
  expected = jsonb_array_length(p_items);
  if expected < 1 or expected > 200 or p_packed is null then raise exception 'Invalid items'; end if;
  -- Stable lock ordering avoids deadlocks when two phones change a category.
  perform 1 from public.trip_packing_items i
  join jsonb_to_recordset(p_items) as request(id uuid, version integer) on request.id = i.id
  where i.trip_id = p_trip order by i.id for update of i;
  if (select count(*) from public.trip_packing_items i
      join jsonb_to_recordset(p_items) as request(id uuid, version integer) on request.id = i.id and request.version = i.version
      where i.trip_id = p_trip and not i.deleted) <> expected
      or (select count(distinct request.id) from jsonb_to_recordset(p_items) as request(id uuid)) <> expected then
    raise exception 'List changed' using errcode = '40001';
  end if;
  return query update public.trip_packing_items i set packed = p_packed
  from jsonb_to_recordset(p_items) as request(id uuid, version integer)
  where i.id = request.id and i.trip_id = p_trip returning i.*;
end;
$$;
revoke all on function public.set_trip_packing_items(uuid,jsonb,boolean) from public, anon, authenticated;
grant execute on function public.set_trip_packing_items(uuid,jsonb,boolean) to service_role;

-- Add only these tables to the existing publication. Do not replace it.
alter publication supabase_realtime add table public.trip_packing_items;
