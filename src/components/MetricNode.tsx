import { memo } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import clsx from 'clsx'
import type { MetricNodeData } from '../types'
import { Sparkline } from './Sparkline'

export type MetricNodePayload = MetricNodeData & {
  selected?: boolean
  highlighted?: boolean
  dimmed?: boolean
  [key: string]: unknown
}

export type MetricFlowNode = Node<MetricNodePayload, 'metric'>

function MetricNodeComponent({ data }: NodeProps<MetricFlowNode>) {
  const isNegative = data.change < 0
  const changeIsBad = data.isRoot ? isNegative : data.impact < 0

  return (
    <div
      className={clsx(
        'w-[168px] rounded-xl border bg-surface-raised/95 backdrop-blur-sm transition-all duration-200',
        data.selected && 'ring-2 ring-accent border-accent/50 scale-105 z-10',
        data.highlighted && !data.selected && 'ring-1 ring-accent/40 border-accent/30',
        data.dimmed && 'opacity-35',
        data.isRoot && data.severity === 'high' && 'border-danger/50 node-pulse',
        !data.selected && !data.isRoot && 'border-border hover:border-border-bright',
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-border-bright !w-2 !h-2 !border-0" />
      <div className="p-2.5">
        <div className="text-[11px] font-semibold text-ink leading-tight">{data.label}</div>
        <div
          className={clsx(
            'mt-0.5 text-sm font-bold tabular-nums',
            changeIsBad ? 'text-danger' : 'text-success',
          )}
        >
          {isNegative ? '' : '+'}
          {data.change}%
        </div>
        <div className="mt-1 h-7">
          <Sparkline data={data.sparkline} positiveIsGood={!changeIsBad} height={28} />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px]">
          <span className="text-muted">Impact</span>
          <span
            className={clsx(
              'font-semibold tabular-nums',
              data.impact < 0 ? 'text-danger' : 'text-success',
            )}
          >
            {data.impact > 0 ? '+' : ''}
            {data.impact} pts
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-border-bright !w-2 !h-2 !border-0" />
    </div>
  )
}

export const MetricNode = memo(MetricNodeComponent)
