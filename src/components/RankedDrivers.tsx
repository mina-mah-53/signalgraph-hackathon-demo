import clsx from 'clsx'
import { useState } from 'react'
import type { RankedDriver } from '../types'

interface RankedDriversProps {
  drivers: RankedDriver[]
  selectedNodeId: string
  onSelect: (nodeId: string) => void
  onOpenGraph: () => void
}

export function RankedDrivers({
  drivers,
  selectedNodeId,
  onSelect,
  onOpenGraph,
}: RankedDriversProps) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? drivers : drivers.slice(0, 3)

  return (
    <section>
      <h2 className="text-sm font-semibold text-ink">Top drivers</h2>
      <p className="mt-0.5 text-xs text-muted mb-3">
        What pulled NRR down, ranked by impact.
      </p>

      <ol className="space-y-2">
        {visible.map((driver) => {
          const isSelected = driver.nodeId === selectedNodeId
          return (
            <li key={driver.nodeId}>
              <button
                type="button"
                onClick={() => onSelect(driver.nodeId)}
                className={clsx(
                  'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
                  isSelected
                    ? 'border-accent/40 bg-accent/5'
                    : 'border-border bg-surface hover:border-border-bright',
                )}
              >
                <span
                  className={clsx(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                    driver.rank === 1 ? 'bg-danger/15 text-danger' : 'bg-border text-muted',
                  )}
                >
                  {driver.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-ink">{driver.label}</div>
                  <div className="text-xs text-muted truncate">{driver.summary}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold tabular-nums text-danger">
                    {Math.abs(driver.impact)} pts
                  </div>
                  <div className="text-[10px] text-muted">{driver.ownerTeam}</div>
                </div>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="mt-3 flex items-center gap-4">
        {drivers.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-medium text-accent hover:text-ink transition-colors"
          >
            {showAll ? 'Show fewer' : `Show ${drivers.length - 3} more`}
          </button>
        )}
        <button
          type="button"
          onClick={onOpenGraph}
          className="text-xs font-medium text-muted hover:text-ink transition-colors"
        >
          See how they connect in the graph →
        </button>
      </div>
    </section>
  )
}
