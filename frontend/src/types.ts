export type Severity = 'high' | 'medium' | 'low'
export type EdgeStrength = 'strong' | 'medium' | 'weak'
export type InvestigationView = 'answer' | 'graph' | 'evidence'

export interface SparkPoint {
  month: string
  value: number
}

export interface MetricNodeData {
  id: string
  label: string
  change: number
  impact: number
  sparkline: SparkPoint[]
  severity?: Severity
  weight: number
  confidence: number
  firstDetected: string
  lastUpdated: string
  lag: string
  owner: string
  ownerTeam: string
  description: string
  evidence: string[]
  isRoot?: boolean
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  strength: number
  strengthClass: EdgeStrength
}

export interface AlertCard {
  id: string
  title: string
  metric: string
  change: number
  severity: Severity
  confidence: number
  sparkline: SparkPoint[]
  investigationId: string
}

export interface CohortRow {
  cohort: string
  actual: number
  expected: number
  impact: number
}

export interface TrendPoint {
  month: string
  actual: number
  expected: number
}

export interface ShapDriver {
  factor: string
  impact: number
}

export interface DataQuality {
  overall: number
  freshness: number
  coverage: number
  consistency: number
}

export interface Investigation {
  id: string
  title: string
  subtitle: string
  severity: Severity
  rootNodeId: string
  primaryDriverId: string
  causalPath: string[]
}

export type EvidenceTab = 'evidence' | 'timeline' | 'counterfactual' | 'forecast' | 'recommendations'
export type DetailTab = 'details' | 'path' | 'notes'

export interface Note {
  id: string
  author: string
  time: string
  text: string
}

export interface Verdict {
  headline: string
  rootCause: string
  trigger: string
  explainedShare: number
  confidence: number
  mrrAtRisk: string
  cohortLabel: string
}

export interface RankedDriver {
  rank: number
  nodeId: string
  label: string
  impact: number
  confidence: number
  ownerTeam: string
  summary: string
}

export interface CohortBenchmarkMetric {
  label: string
  problemValue: number
  healthyValue: number
  unit: '%' | 'days'
  lowerIsWorse?: boolean
}

export interface CohortBenchmark {
  problemCohort: string
  healthyCohort: string
  metrics: CohortBenchmarkMetric[]
}

export type CohortFilter = 'oct' | 'nov' | 'both'
