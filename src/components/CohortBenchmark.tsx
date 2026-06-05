import clsx from 'clsx'
import type { CohortBenchmark, CohortFilter } from '../types'

interface CohortBenchmarkProps {
  benchmark: CohortBenchmark
  benchmarkNov: CohortBenchmark
  filter: CohortFilter
  onFilterChange: (filter: CohortFilter) => void
}

const KEY_METRICS = ['3-Month NRR', 'JPay activation @ 30d', 'Onboarding completion']

export function CohortBenchmarkPanel({
  benchmark,
  benchmarkNov,
  filter,
  onFilterChange,
}: CohortBenchmarkProps) {
  const active =
    filter === 'nov'
      ? benchmarkNov
      : filter === 'both'
        ? {
            problemCohort: 'Oct & Nov avg',
            healthyCohort: benchmark.healthyCohort,
            metrics: benchmark.metrics.map((m, i) => {
              const nov = benchmarkNov.metrics[i]
              const avgProblem =
                m.unit === 'days'
                  ? Math.round((m.problemValue + nov.problemValue) / 2)
                  : +((m.problemValue + nov.problemValue) / 2).toFixed(1)
              return { ...m, problemValue: avgProblem }
            }),
          }
        : benchmark

  const metrics = active.metrics.filter((m) => KEY_METRICS.includes(m.label))

  const filters: { id: CohortFilter; label: string }[] = [
    { id: 'oct', label: 'Oct' },
    { id: 'nov', label: 'Nov' },
    { id: 'both', label: 'Both' },
  ]

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">vs healthy cohort</h2>
          <p className="text-xs text-muted">
            {active.problemCohort} compared to {active.healthyCohort}
          </p>
        </div>
        <div className="flex rounded-md border border-border p-0.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              className={clsx(
                'rounded px-2 py-0.5 text-[10px] font-medium transition-colors',
                filter === f.id ? 'bg-surface-raised text-ink' : 'text-muted hover:text-ink',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {metrics.map((metric) => {
          const suffix = metric.unit === 'days' ? 'd' : '%'
          const gap = metric.problemValue - metric.healthyValue
          const isWorse = (metric.lowerIsWorse ?? true) ? gap < 0 : gap > 0

          return (
            <div
              key={metric.label}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2.5"
            >
              <span className="text-xs text-muted">{metric.label}</span>
              <div className="flex items-center gap-3 text-sm tabular-nums">
                <span className={clsx('font-semibold', isWorse ? 'text-danger' : 'text-ink')}>
                  {metric.problemValue}
                  {suffix}
                </span>
                <span className="text-muted text-xs">vs</span>
                <span className="text-muted">{metric.healthyValue}{suffix}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
