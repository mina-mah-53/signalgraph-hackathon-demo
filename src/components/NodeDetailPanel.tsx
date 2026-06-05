import clsx from 'clsx'
import {
  Code2,
  GitCompare,
  Hash,
  MessageSquare,
  Ticket,
  Zap,
} from 'lucide-react'
import type { DetailTab, MetricNodeData, Note } from '../types'
import { Sparkline } from './Sparkline'

const detailTabs: { id: DetailTab; label: string; count?: number }[] = [
  { id: 'details', label: 'Node Details' },
  { id: 'path', label: 'Path Insights' },
  { id: 'notes', label: 'Notes', count: 2 },
]

interface NodeDetailPanelProps {
  node: MetricNodeData
  activeTab: DetailTab
  onTabChange: (tab: DetailTab) => void
  notes: Note[]
  causalPath: string[]
  allNodes: Record<string, MetricNodeData>
  onAction: (action: string) => void
}

export function NodeDetailPanel({
  node,
  activeTab,
  onTabChange,
  notes,
  causalPath,
  allNodes,
  onAction,
}: NodeDetailPanelProps) {
  const isNegative = node.change < 0
  const changeIsBad = node.isRoot ? isNegative : node.impact < 0

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-l border-border bg-surface overflow-hidden">
      <div className="flex border-b border-border overflow-x-auto scroll-thin">
        {detailTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'shrink-0 px-3 py-2.5 text-[11px] font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 text-[9px] text-muted">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin p-4 space-y-4">
        {activeTab === 'details' && (
          <>
            <div>
              <h2 className="text-sm font-semibold text-ink">{node.label}</h2>
              <div
                className={clsx(
                  'mt-1 text-2xl font-bold tabular-nums',
                  changeIsBad ? 'text-danger' : 'text-success',
                )}
              >
                {isNegative ? '' : '+'}
                {node.change}%
              </div>
              <div className="mt-2 h-10">
                <Sparkline data={node.sparkline} positiveIsGood={!changeIsBad} height={40} />
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg bg-surface-raised px-3 py-2 text-xs">
                <span className="text-muted">Impact on NRR</span>
                <span className={clsx('font-bold tabular-nums', node.impact < 0 ? 'text-danger' : 'text-success')}>
                  {node.impact > 0 ? '+' : ''}
                  {node.impact} pts
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              {[
                ['Weight', node.weight.toFixed(2)],
                ['Confidence', `${node.confidence}%`],
                ['First Detected', node.firstDetected],
                ['Last Updated', node.lastUpdated],
                ['Lag', node.lag],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-medium text-ink mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                Owner
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-[10px] font-semibold text-accent">
                  {node.ownerTeam
                    .split('/')
                    .map((s) => s.trim()[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-medium text-ink">{node.ownerTeam}</div>
                  <div className="text-[10px] text-muted">{node.owner}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                Description
              </div>
              <p className="text-xs text-muted leading-relaxed">{node.description}</p>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                Top Evidence
              </div>
              <ul className="space-y-1.5">
                {node.evidence.map((item) => (
                  <li key={item} className="text-xs text-muted flex gap-2">
                    <span className="text-accent shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Code2, label: 'View SQL', action: 'sql' },
                { icon: GitCompare, label: 'View Cohorts', action: 'cohorts' },
                { icon: Zap, label: 'Run Counterfactual', action: 'counterfactual' },
                { icon: Ticket, label: 'Create Jira Ticket', action: 'jira' },
                { icon: Hash, label: 'Send to Slack', action: 'slack' },
              ].map((btn) => (
                <button
                  key={btn.action}
                  type="button"
                  onClick={() => onAction(btn.action)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-[10px] font-medium text-muted hover:border-accent/40 hover:text-ink transition-colors col-span-1 last:col-span-2"
                >
                  <btn.icon className="h-3.5 w-3.5 shrink-0" />
                  {btn.label}
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === 'path' && (
          <div className="space-y-3">
            <p className="text-xs text-muted">
              Causal path from root metric to selected signal:
            </p>
            <ol className="space-y-2">
              {causalPath.map((id, i) => {
                const n = allNodes[id]
                if (!n) return null
                const isSelected = id === node.id
                return (
                  <li
                    key={id}
                    className={clsx(
                      'rounded-lg border px-3 py-2 text-xs transition-colors',
                      isSelected
                        ? 'border-accent/50 bg-accent/10'
                        : 'border-border bg-surface-raised',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted font-mono text-[10px]">{i + 1}</span>
                      <span className="font-medium text-ink">{n.label}</span>
                    </div>
                    <div className="mt-1 text-muted tabular-nums">
                      {n.change > 0 ? '+' : ''}
                      {n.change}% · Impact {n.impact} pts
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="rounded-lg border border-border bg-surface-raised p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-medium text-ink">{note.author}</span>
                  <span className="text-[10px] text-muted ml-auto">{note.time}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
