alter table public.mishap_events
  drop constraint if exists mishap_events_map_mode_check;

alter table public.mishap_events
  add constraint mishap_events_map_mode_check check (
    map_mode in ('normal', 'blackout', 'bermuda', 'hypercube', 'energy', 'noclip', 'drafted')
  );
