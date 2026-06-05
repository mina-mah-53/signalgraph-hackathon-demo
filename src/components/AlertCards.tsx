import clsx from 'clsx'
import type { AlertCard } from '../types'
import { Sparkline } from './Sparkline'

interface AlertCardsProps {
  cards: AlertCard[]
  activeId: string | null
  onSelect: (card: AlertCard) => void
}

const severityStyles = {
  high: 'border-danger/40 bg-danger/5',
  medium: 'border-warning/30 bg-warning/5',
  low: 'border-border bg-surface',
}

export function AlertCards({ cards, activeId, onSelect }: AlertCardsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto scroll-thin pb-1">
      {cards.map((card) => {
        const isActive = card.id === activeId
        const isNegative = card.change < 0
        const changeIsBad =
          card.metric.toLowerCase().includes('churn') ||
          card.metric.toLowerCase().includes('failure')
            ? card.change > 0
            : card.change < 0

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelect(card)}
            className={clsx(
              'flex min-w-[200px] flex-1 flex-col rounded-xl border p-3 text-left transition-all duration-200',
              severityStyles[card.severity],
              isActive && 'ring-2 ring-accent/60 scale-[1.02]',
              !isActive && 'hover:border-border-bright hover:bg-surface-raised/50',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-medium text-muted leading-tight">{card.title}</span>
              <span
                className={clsx(
                  'shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide',
                  card.severity === 'high' && 'bg-danger/20 text-danger',
                  card.severity === 'medium' && 'bg-warning/20 text-warning',
                  card.severity === 'low' && 'bg-border text-muted',
                )}
              >
                {card.severity}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted">{card.metric}</div>
            <div
              className={clsx(
                'mt-0.5 text-lg font-semibold tabular-nums',
                changeIsBad ? 'text-danger' : 'text-success',
              )}
            >
              {isNegative ? '' : '+'}
              {card.change}%
              <span className="ml-1 text-[10px] font-normal text-muted">vs expected</span>
            </div>
            <div className="mt-2 h-8">
              <Sparkline
                data={card.sparkline}
                positiveIsGood={!changeIsBad}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
              <span>Confidence</span>
              <span className="font-semibold text-ink">{card.confidence}%</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
