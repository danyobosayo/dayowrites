-- A stale item version is a logical conflict, not a retryable serialization failure.
-- PT409 makes PostgREST return HTTP 409 immediately.
create or replace function public.set_trip_packing_items(p_trip uuid, p_items jsonb, p_packed boolean)
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
    raise exception 'List changed' using errcode = 'PT409';
  end if;
  return query update public.trip_packing_items i set packed = p_packed
  from jsonb_to_recordset(p_items) as request(id uuid, version integer)
  where i.id = request.id and i.trip_id = p_trip returning i.*;
end;
$$;
revoke all on function public.set_trip_packing_items(uuid,jsonb,boolean) from public, anon, authenticated;
grant execute on function public.set_trip_packing_items(uuid,jsonb,boolean) to service_role;

