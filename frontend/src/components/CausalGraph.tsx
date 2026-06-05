import { useCallback, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type Edge,
  type Node,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import clsx from 'clsx'
import { GitCompare, Share2, Undo2 } from 'lucide-react'
import type { GraphEdge, Investigation, MetricNodeData } from '../types'
import { MetricNode, type MetricFlowNode } from './MetricNode'

const nodeTypes = { metric: MetricNode } as const

const positions: Record<string, { x: number; y: number }> = {
  nrr: { x: 280, y: 0 },
  'sub-retention': { x: 0, y: 140 },
  'jpay-activity': { x: 200, y: 140 },
  'payment-success': { x: 420, y: 140 },
  'promo-usage': { x: 600, y: 140 },
  'churn-rate': { x: 0, y: 300 },
  'daily-jpay-users': { x: 140, y: 300 },
  'onboarding-completion': { x: 300, y: 300 },
  'payment-failures': { x: 500, y: 300 },
}

function edgeColor(strengthClass: GraphEdge['strengthClass'], highlighted: boolean) {
  if (highlighted) return 'var(--color-accent)'
  if (strengthClass === 'strong') return 'var(--color-success)'
  if (strengthClass === 'medium') return 'var(--color-warning)'
  return 'var(--color-border-bright)'
}

function edgeStyle(strengthClass: GraphEdge['strengthClass']) {
  if (strengthClass === 'strong') return undefined
  if (strengthClass === 'medium') return '6 4'
  return '2 4'
}

interface CausalGraphProps {
  nodes: Record<string, MetricNodeData>
  edges: GraphEdge[]
  investigation: Investigation
  selectedNodeId: string
  highlightedPath: string[]
  walkingBack: boolean
  onSelectNode: (id: string) => void
  onWalkBack: () => void
  onShare: () => void
}

export function CausalGraph({
  nodes,
  edges,
  investigation,
  selectedNodeId,
  highlightedPath,
  walkingBack,
  onSelectNode,
  onWalkBack,
  onShare,
}: CausalGraphProps) {
  const pathSet = useMemo(() => new Set(highlightedPath), [highlightedPath])

  const initialNodes: MetricFlowNode[] = useMemo(
    () =>
      Object.values(nodes).map((node) => ({
        id: node.id,
        type: 'metric' as const,
        position: positions[node.id] ?? { x: 0, y: 0 },
        data: {
          ...node,
          selected: node.id === selectedNodeId,
          highlighted: pathSet.has(node.id),
          dimmed: highlightedPath.length > 0 && !pathSet.has(node.id),
        },
      })),
    [nodes, selectedNodeId, pathSet, highlightedPath.length],
  )

  const initialEdges: Edge[] = useMemo(
    () =>
      edges.map((edge) => {
        const sourceInPath = pathSet.has(edge.source)
        const targetInPath = pathSet.has(edge.target)
        const isPathEdge =
          highlightedPath.length > 1 &&
          highlightedPath.some(
            (id, i) =>
              i < highlightedPath.length - 1 &&
              id === edge.source &&
              highlightedPath[i + 1] === edge.target,
          )
        const highlighted = isPathEdge || (sourceInPath && targetInPath && highlightedPath.length <= 2)

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'default',
          animated: walkingBack && highlighted,
          label: edge.strength.toFixed(2),
          labelStyle: {
            fill: highlighted ? 'var(--color-accent)' : 'var(--color-muted)',
            fontSize: 10,
            fontWeight: 600,
          },
          labelBgStyle: { fill: 'var(--color-surface)', fillOpacity: 0.9 },
          labelBgPadding: [4, 6] as [number, number],
          labelBgBorderRadius: 4,
          style: {
            stroke: edgeColor(edge.strengthClass, highlighted),
            strokeWidth: highlighted ? 2.5 : edge.strengthClass === 'strong' ? 2 : 1,
            strokeDasharray: highlighted ? undefined : edgeStyle(edge.strengthClass),
            opacity: highlightedPath.length > 0 && !highlighted ? 0.2 : 1,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor(edge.strengthClass, highlighted),
            width: 16,
            height: 16,
          },
        }
      }),
    [edges, pathSet, highlightedPath, walkingBack],
  )

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialNodes)
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setFlowNodes(initialNodes)
  }, [initialNodes, setFlowNodes])

  useEffect(() => {
    setFlowEdges(initialEdges)
  }, [initialEdges, setFlowEdges])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelectNode(node.id)
    },
    [onSelectNode],
  )

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface/50 panel-glow overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-ink">
              Investigation: {investigation.title}
            </h2>
            <span
              className={clsx(
                'rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                investigation.severity === 'high' && 'bg-danger/20 text-danger',
              )}
            >
              {investigation.severity} severity
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">{investigation.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onWalkBack}
            className={clsx(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
              walkingBack
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:border-accent/40 hover:text-ink',
            )}
          >
            <Undo2 className="h-3.5 w-3.5" />
            Walk Backwards
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-border-bright hover:text-ink transition-colors"
          >
            <GitCompare className="h-3.5 w-3.5" />
            Compare Cohorts
          </button>
          <button
            type="button"
            onClick={onShare}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-border-bright hover:text-ink transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-[240px]">
        <div className="w-36 shrink-0 border-r border-border p-3 text-[10px] text-muted space-y-3">
          <div className="font-semibold text-ink text-xs">Edge Strength</div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-8 bg-success rounded" />
            <span>Strong (0.7–1.0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-8 border-t-2 border-dashed border-warning rounded" />
            <span>Medium (0.4–0.7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-border-bright" />
            <span>Weak (&lt;0.4)</span>
          </div>
          {highlightedPath.length > 0 && (
            <div className="mt-4 rounded-lg bg-accent/10 p-2 text-accent">
              <div className="font-semibold text-xs mb-1">Active Path</div>
              {highlightedPath.map((id, i) => (
                <div key={id} className="truncate">
                  {i > 0 && '↓ '}
                  {nodes[id]?.label ?? id}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 signalgraph-flow h-full w-full">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes as never}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.4}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={20} size={1} color="oklch(0.25 0.03 250)" />
            <Controls
              showInteractive={false}
              className="!bg-surface-raised !border-border !shadow-none [&>button]:!bg-surface-raised [&>button]:!border-border [&>button]:!text-muted [&>button:hover]:!bg-border"
            />
            <MiniMap
              nodeColor={(n) =>
                n.id === selectedNodeId ? 'var(--color-accent)' : 'var(--color-surface-raised)'
              }
              maskColor="oklch(0.1 0.02 250 / 0.8)"
              className="!bg-surface !border-border"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}
