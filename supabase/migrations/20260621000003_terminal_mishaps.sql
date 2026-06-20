alter type public.order_status add value if not exists 'lost';

alter table public.mishap_events
  add column if not exists mishap_code text not null default 'legacy_mishap',
  add column if not exists recoverable boolean not null default true,
  add column if not exists terminal_message text,
  add column if not exists map_mode text not null default 'normal';

alter table public.mishap_events
  drop constraint if exists mishap_events_map_mode_check;

alter table public.mishap_events
  add constraint mishap_events_map_mode_check check (map_mode in ('normal', 'blackout', 'bermuda'));

create index if not exists mishap_events_terminal_idx
  on public.mishap_events(order_id, recoverable, triggered_at desc);
