import clsx from 'clsx'
import { FileText, ListChecks, Network } from 'lucide-react'
import type { InvestigationView } from '../types'

const views: { id: InvestigationView; label: string; icon: typeof ListChecks }[] = [
  { id: 'answer', label: 'Answer', icon: ListChecks },
  { id: 'graph', label: 'Causal graph', icon: Network },
  { id: 'evidence', label: 'Evidence', icon: FileText },
]

interface ViewToggleProps {
  active: InvestigationView
  onChange: (view: InvestigationView) => void
}

export function ViewToggle({ active, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-bg p-0.5">
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          onClick={() => onChange(view.id)}
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            active === view.id
              ? 'bg-surface-raised text-ink shadow-sm'
              : 'text-muted hover:text-ink',
          )}
        >
          <view.icon className="h-3.5 w-3.5" />
          {view.label}
        </button>
      ))}
    </div>
  )
}
