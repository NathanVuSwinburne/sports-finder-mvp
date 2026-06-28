-- ============================================================================
-- Waitlist promotion + open/full sync.
-- When a confirmed spot frees up, the earliest waitlisted player is promoted.
-- Runs as SECURITY DEFINER so a leaving (non-host) player can trigger promotion
-- of someone else's row without violating RLS. pg_trigger_depth() guards against
-- re-entrancy from the promotion UPDATE.
-- ============================================================================

create or replace function public.sync_event_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event     uuid := coalesce(new.event_id, old.event_id);
  v_capacity  integer;
  v_status    event_status;
  v_confirmed integer;
  v_promote   uuid;
begin
  -- Avoid recursion when this trigger promotes a waitlisted row.
  if pg_trigger_depth() > 1 then
    return coalesce(new, old);
  end if;

  select capacity, status into v_capacity, v_status
    from events where id = v_event;

  -- Don't shuffle players for closed events.
  if v_status is null or v_status in ('cancelled', 'completed') then
    return coalesce(new, old);
  end if;

  select count(*) into v_confirmed
    from event_participants
   where event_id = v_event and status in ('joined', 'attended');

  -- Promote waitlisted players (oldest first) while there is room.
  while v_confirmed < v_capacity loop
    select id into v_promote
      from event_participants
     where event_id = v_event and status = 'waitlisted'
     order by joined_at asc
     limit 1;
    exit when v_promote is null;
    update event_participants set status = 'joined' where id = v_promote;
    v_confirmed := v_confirmed + 1;
  end loop;

  -- Keep the event's open/full status in sync with confirmed numbers.
  if v_confirmed >= v_capacity then
    update events set status = 'full' where id = v_event and status = 'open';
  else
    update events set status = 'open' where id = v_event and status = 'full';
  end if;

  return coalesce(new, old);
end;
$$;

create trigger on_participant_change
  after insert or update or delete on public.event_participants
  for each row execute function public.sync_event_capacity();
