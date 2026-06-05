import clsx from 'clsx'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CohortRow, DataQuality, EvidenceTab, ShapDriver, TrendPoint } from '../types'

const tabs: { id: EvidenceTab; label: string }[] = [
  { id: 'evidence', label: 'Evidence' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'counterfactual', label: 'Counterfactual' },
  { id: 'forecast', label: 'Forecast' },
  { id: 'recommendations', label: 'Recommendations' },
]

interface EvidencePanelProps {
  activeTab: EvidenceTab
  onTabChange: (tab: EvidenceTab) => void
  cohortData: CohortRow[]
  trendData: TrendPoint[]
  shapDrivers: ShapDriver[]
  dataQuality: DataQuality
}

function QualityGauge({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 18
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" fill="none" stroke="var(--color-border)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
        <text x="22" y="24" textAnchor="middle" className="fill-ink text-[9px] font-semibold">
          {value}%
        </text>
      </svg>
      <span className="text-[10px] text-muted">{label}</span>
    </div>
  )
}

export function EvidencePanel({
  activeTab,
  onTabChange,
  cohortData,
  trendData,
  shapDrivers,
  dataQuality,
}: EvidencePanelProps) {
  return (
    <div className="flex min-h-[260px] flex-col rounded-xl border border-border bg-surface/50 panel-glow overflow-hidden">
      <div className="flex border-b border-border overflow-x-auto scroll-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'shrink-0 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin p-4 space-y-4">
        {activeTab === 'evidence' && (
          <>
            <div>
              <h3 className="text-xs font-semibold text-ink mb-2">Cohort Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-muted border-b border-border">
                      <th className="pb-2 text-left font-medium">Cohort</th>
                      <th className="pb-2 text-right font-medium">Actual</th>
                      <th className="pb-2 text-right font-medium">Expected</th>
                      <th className="pb-2 text-right font-medium">Impact on NRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((row) => (
                      <tr key={row.cohort} className="border-b border-border/50">
                        <td className="py-2 text-ink">{row.cohort}</td>
                        <td className="py-2 text-right tabular-nums text-danger font-medium">
                          {row.actual}%
                        </td>
                        <td className="py-2 text-right tabular-nums text-muted">{row.expected}%</td>
                        <td className="py-2 text-right tabular-nums text-danger font-semibold">
                          {row.impact} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-ink mb-2">Trend Over Time</h3>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[90, 104]} tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface-raised)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                  <ReferenceLine x="Oct 24" stroke="var(--color-danger)" strokeDasharray="4 4" label={{ value: 'Anomaly Start', fill: 'var(--color-danger)', fontSize: 10 }} />
                  <Line type="monotone" dataKey="expected" stroke="var(--color-muted)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Expected" />
                  <Line type="monotone" dataKey="actual" stroke="var(--color-danger)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-danger)' }} name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold text-ink mb-2">SHAP Impact (Top Drivers)</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={shapDrivers} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
                    <XAxis type="number" domain={[-6, 0]} tick={{ fontSize: 9, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="factor" width={100} tick={{ fontSize: 9, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                    <Bar dataKey="impact" fill="var(--color-danger)" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-ink mb-2">Data Quality</h3>
                <div className="flex items-center justify-around pt-2">
                  <QualityGauge value={dataQuality.overall} label="Overall" />
                  <QualityGauge value={dataQuality.freshness} label="Freshness" />
                  <QualityGauge value={dataQuality.coverage} label="Coverage" />
                  <QualityGauge value={dataQuality.consistency} label="Consistency" />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-3 text-xs">
            {[
              { date: 'Dec 12, 2024', event: 'NRR anomaly flagged for Oct/Nov cohorts', severity: 'high' },
              { date: 'Dec 10, 2024', event: 'Payment success rate dipped 2.1%', severity: 'medium' },
              { date: 'Dec 5, 2024', event: 'JPay activity signal crossed -15% threshold', severity: 'high' },
              { date: 'Dec 3, 2024', event: 'Onboarding completion rate declined', severity: 'high' },
              { date: 'Oct 1, 2024', event: 'Onboarding flow variant B deployed', severity: 'info' },
            ].map((item) => (
              <div key={item.date} className="flex gap-3 border-l-2 border-border pl-3 py-1">
                <div className="text-muted shrink-0 w-20">{item.date}</div>
                <div className="text-ink">{item.event}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'counterfactual' && (
          <div className="space-y-3 text-xs text-muted">
            <p className="text-ink font-medium">What if JPay activity matched expected?</p>
            <div className="rounded-lg border border-border bg-surface-raised p-3 space-y-2">
              <div className="flex justify-between">
                <span>Projected NRR (Oct cohort)</span>
                <span className="text-success font-semibold">98.6%</span>
              </div>
              <div className="flex justify-between">
                <span>Gap closed</span>
                <span className="text-accent font-semibold">+7.4 pts</span>
              </div>
              <div className="flex justify-between">
                <span>Confidence interval</span>
                <span>96.2% – 100.1%</span>
              </div>
            </div>
            <p>
              Counterfactual model holds all other signals at observed levels and simulates
              JPay activity at the cohort benchmark. Onboarding completion is the secondary lever.
            </p>
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-3 text-xs">
            <p className="text-ink font-medium">30-day NRR forecast (Dec 2024 cohort)</p>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart
                data={[
                  { month: 'Now', value: 94.2, lower: 92, upper: 96 },
                  { month: '+7d', value: 93.8, lower: 91, upper: 95.5 },
                  { month: '+14d', value: 93.1, lower: 89.5, upper: 95 },
                  { month: '+21d', value: 92.4, lower: 88, upper: 94.5 },
                  { month: '+30d', value: 91.6, lower: 86.5, upper: 94 },
                ]}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 98]} tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <Line type="monotone" dataKey="upper" stroke="var(--color-accent)" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                <Line type="monotone" dataKey="value" stroke="var(--color-warning)" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="lower" stroke="var(--color-accent)" strokeWidth={1} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-muted">
              Without intervention, NRR for at-risk cohorts is projected to decline a further 2.6 pts
              over 30 days. JPay activation remains the highest-leverage intervention.
            </p>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-3">
            {[
              {
                priority: 'P0',
                action: 'Route to Payments / Growth for JPay activation review',
                owner: 'Payments / Growth Team',
              },
              {
                priority: 'P1',
                action: 'Audit onboarding variant B impact on bank-linking completion',
                owner: 'Product / Onboarding',
              },
              {
                priority: 'P2',
                action: 'Segment promo-attached accounts for targeted JPay nudges',
                owner: 'Growth Marketing',
              },
            ].map((rec) => (
              <div
                key={rec.action}
                className="rounded-lg border border-border bg-surface-raised p-3 text-xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={clsx(
                      'rounded px-1.5 py-0.5 text-[9px] font-bold',
                      rec.priority === 'P0' && 'bg-danger/20 text-danger',
                      rec.priority === 'P1' && 'bg-warning/20 text-warning',
                      rec.priority === 'P2' && 'bg-border text-muted',
                    )}
                  >
                    {rec.priority}
                  </span>
                  <span className="text-muted">{rec.owner}</span>
                </div>
                <p className="text-ink">{rec.action}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
