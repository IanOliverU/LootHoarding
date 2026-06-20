const configuredUpdate = process.env.STORE_UPDATED_AT
  ? new Date(process.env.STORE_UPDATED_AT)
  : new Date();

const storeUpdatedAt = Number.isNaN(configuredUpdate.getTime())
  ? new Date()
  : configuredUpdate;

const formattedUpdate = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Manila",
}).format(storeUpdatedAt);

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-page px-6 py-9 font-mono text-[0.68rem] text-ink-dim">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p>LOOTHOARDING · NO MONEY WAS HARMED IN THE MAKING OF THIS ORDER</p>
        <p className="inline-flex shrink-0 items-center gap-2 uppercase tracking-[0.04em]">
          <span className="size-1.5 animate-pulse rounded-full bg-green" aria-hidden="true" />
          Store last updated · <time dateTime={storeUpdatedAt.toISOString()}>{formattedUpdate} PHT</time>
        </p>
      </div>
    </footer>
  );
}
