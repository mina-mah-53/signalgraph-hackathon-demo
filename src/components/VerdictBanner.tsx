import type { Verdict } from '../types'

interface VerdictBannerProps {
  verdict: Verdict
}

export function VerdictBanner({ verdict }: VerdictBannerProps) {
  return (
    <section className="rounded-xl border border-border bg-surface px-5 py-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
        Why did NRR drop?
      </p>
      <p className="mt-2 text-lg font-semibold text-ink leading-snug text-balance">
        {verdict.rootCause}
      </p>
      <p className="mt-3 text-sm text-muted leading-relaxed">
        {verdict.trigger}
      </p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span>
          Cohort: <span className="text-ink">{verdict.cohortLabel}</span>
        </span>
        <span>
          Confidence: <span className="text-ink font-medium">{verdict.confidence}%</span>
        </span>
        <span>
          At risk: <span className="text-danger font-medium">{verdict.mrrAtRisk} MRR</span>
        </span>
      </div>
    </section>
  )
}
