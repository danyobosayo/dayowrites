-- Supabase's automatic-RLS option installs this privileged event trigger helper.
-- It still runs for DDL without exposing it as an executable public API function.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;
