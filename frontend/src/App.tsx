import { useCallback, useState } from 'react'
import { CausalGraph } from './components/CausalGraph'
import { CohortBenchmarkPanel } from './components/CohortBenchmark'
import { DriverDetail } from './components/DriverDetail'
import { EvidencePanel } from './components/EvidencePanel'
import { NodeDetailPanel } from './components/NodeDetailPanel'
import { RankedDrivers } from './components/RankedDrivers'
import { Sidebar } from './components/Sidebar'
import { Toast } from './components/Toast'
import { TopBar } from './components/TopBar'
import { VerdictBanner } from './components/VerdictBanner'
import { ViewToggle } from './components/ViewToggle'
import {
  cohortBenchmark,
  cohortBenchmarkNov,
  cohortComparison,
  dataQuality,
  graphEdges,
  investigations,
  metricNodes,
  notes,
  rankedDrivers,
  shapDrivers,
  trendData,
  verdict,
} from './data/mockData'
import type { CohortFilter, DetailTab, EvidenceTab, InvestigationView } from './types'

const investigation = investigations[0]

const actionMessages: Record<string, string> = {
  sql: 'SQL query copied to clipboard (demo)',
  cohorts: 'Opening cohort explorer (demo)',
  counterfactual: 'Running counterfactual simulation...',
  jira: 'Jira ticket JOB-4821 created (demo)',
  slack: 'Alert posted to #revenue-analytics (demo)',
  share: 'Investigation link copied to clipboard (demo)',
}

export default function App() {
  const [view, setView] = useState<InvestigationView>('answer')
  const [selectedNodeId, setSelectedNodeId] = useState(investigation.primaryDriverId)
  const [highlightedPath, setHighlightedPath] = useState<string[]>([])
  const [walkingBack, setWalkingBack] = useState(false)
  const [evidenceTab, setEvidenceTab] = useState<EvidenceTab>('evidence')
  const [detailTab, setDetailTab] = useState<DetailTab>('details')
  const [toast, setToast] = useState<string | null>(null)
  const [cohortFilter, setCohortFilter] = useState<CohortFilter>('oct')

  const showToast = useCallback((message: string) => {
    setToast(message)
  }, [])

  const handleWalkBack = useCallback(() => {
    const path = investigation.causalPath
    setWalkingBack(true)
    setHighlightedPath([])
    setSelectedNodeId(path[0])

    path.forEach((nodeId, index) => {
      setTimeout(() => {
        setHighlightedPath(path.slice(0, index + 1))
        setSelectedNodeId(nodeId)
        if (index === path.length - 1) {
          setWalkingBack(false)
        }
      }, index * 700)
    })
  }, [])

  const handleSelectNode = useCallback((id: string) => {
    setSelectedNodeId(id)
    setHighlightedPath([])
    setWalkingBack(false)
    setDetailTab('details')
  }, [])

  const handleDriverSelect = useCallback(
    (nodeId: string) => {
      handleSelectNode(nodeId)
      const pathIndex = investigation.causalPath.indexOf(nodeId)
      if (pathIndex >= 0) {
        setHighlightedPath(investigation.causalPath.slice(0, pathIndex + 1))
      }
    },
    [handleSelectNode],
  )

  const handleAction = useCallback(
    (action: string) => {
      showToast(actionMessages[action] ?? 'Action triggered (demo)')
    },
    [showToast],
  )

  const openGraph = useCallback(() => {
    setView('graph')
    setHighlightedPath(investigation.causalPath)
  }, [])

  const selectedNode = metricNodes[selectedNodeId] ?? metricNodes[investigation.primaryDriverId]

  return (
    <div className="flex h-full overflow-hidden bg-bg">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-border px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-base font-semibold text-ink">{investigation.title}</h1>
                <p className="text-xs text-muted mt-0.5">{investigation.subtitle}</p>
              </div>
              <ViewToggle active={view} onChange={setView} />
            </div>
          </div>

          {view === 'answer' && (
            <div className="flex-1 overflow-y-auto scroll-thin">
              <div className="mx-auto max-w-2xl px-5 py-6 space-y-8">
                <VerdictBanner verdict={verdict} />
                <RankedDrivers
                  drivers={rankedDrivers}
                  selectedNodeId={selectedNodeId}
                  onSelect={handleDriverSelect}
                  onOpenGraph={openGraph}
                />
                <DriverDetail node={selectedNode} onAction={handleAction} />
                <CohortBenchmarkPanel
                  benchmark={cohortBenchmark}
                  benchmarkNov={cohortBenchmarkNov}
                  filter={cohortFilter}
                  onFilterChange={setCohortFilter}
                />
              </div>
            </div>
          )}

          {view === 'graph' && (
            <div className="flex min-h-0 flex-1 gap-3 p-3">
              <div className="min-h-0 flex-1">
                <CausalGraph
                  nodes={metricNodes}
                  edges={graphEdges}
                  investigation={investigation}
                  selectedNodeId={selectedNodeId}
                  highlightedPath={highlightedPath}
                  walkingBack={walkingBack}
                  onSelectNode={handleSelectNode}
                  onWalkBack={handleWalkBack}
                  onShare={() => handleAction('share')}
                />
              </div>
              <NodeDetailPanel
                node={selectedNode}
                activeTab={detailTab}
                onTabChange={setDetailTab}
                notes={notes}
                causalPath={investigation.causalPath}
                allNodes={metricNodes}
                onAction={handleAction}
              />
            </div>
          )}

          {view === 'evidence' && (
            <div className="flex-1 overflow-hidden p-3">
              <EvidencePanel
                activeTab={evidenceTab}
                onTabChange={setEvidenceTab}
                cohortData={cohortComparison}
                trendData={trendData}
                shapDrivers={shapDrivers}
                dataQuality={dataQuality}
              />
            </div>
          )}
        </main>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
