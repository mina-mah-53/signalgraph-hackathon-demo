import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import type { SparkPoint } from '../types'

interface SparklineProps {
  data: SparkPoint[]
  color?: string
  height?: number
  positiveIsGood?: boolean
}

export function Sparkline({
  data,
  color,
  height = 32,
  positiveIsGood = true,
}: SparklineProps) {
  const last = data[data.length - 1]?.value ?? 0
  const first = data[0]?.value ?? 0
  const trending = last - first
  const isGood = positiveIsGood ? trending >= 0 : trending <= 0

  const stroke =
    color ?? (isGood ? 'var(--color-success)' : 'var(--color-danger)')
  const fillId = `spark-${stroke.replace(/[^a-z]/gi, '')}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={stroke}
          strokeWidth={1.5}
          fill={`url(#${fillId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
