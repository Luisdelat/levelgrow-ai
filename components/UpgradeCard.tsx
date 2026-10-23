import Link from 'next/link';

/** Invitation to move from the Basic to the Full plan, shown only to Basic users. */
export default function UpgradeCard({ title, description, cta }: { title: string; description: string; cta: string }) {
  return (
    <aside className="panel rise-in flex flex-col gap-4 border-blue-500/30 bg-blue-500/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-semibold text-white">
          <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-300 ring-1 ring-blue-500/30">
            Full
          </span>
          {title}
        </p>
        <p className="mt-1.5 text-sm text-slate-300">{description}</p>
      </div>
      <Link href="/checkout?plan=full" className="btn-accent flex-shrink-0">
        {cta} <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
