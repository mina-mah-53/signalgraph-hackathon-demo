import { Ticket } from 'lucide-react'
import type { MetricNodeData } from '../types'

interface DriverDetailProps {
  node: MetricNodeData
  onAction: (action: string) => void
}

export function DriverDetail({ node, onAction }: DriverDetailProps) {
  return (
    <section className="rounded-xl border border-border bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">{node.label}</h3>
          <p className="mt-1 text-sm text-muted leading-relaxed">{node.description}</p>
          <ul className="mt-2 space-y-1">
            {node.evidence.slice(0, 2).map((item) => (
              <li key={item} className="text-xs text-muted">• {item}</li>
            ))}
          </ul>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-bold tabular-nums text-danger">
            {node.impact} pts
          </div>
          <div className="text-[10px] text-muted">impact on NRR</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onAction('jira')}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-accent/40 hover:text-ink transition-colors"
      >
        <Ticket className="h-3.5 w-3.5" />
        Route to {node.ownerTeam}
      </button>
    </section>
  )
}
