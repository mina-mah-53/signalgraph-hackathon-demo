# SignalGraph Demo

Interactive hackathon demo for **SignalGraph: Business Brain** — autonomous metric monitoring, causal explanation, and forecasting.

## Friday demo slice

- **Metric:** NRR (3-month)
- **Cohort:** Oct/Nov 2024 conversion cohorts
- **Story:** NRR drop driven by lower JPay activity and onboarding completion
- **Data:** Mock data only (Option A)

## Run locally

```bash
cd signalgraph
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Try it

1. Click alert cards to jump to related signals
2. Click graph nodes to inspect details in the right panel
3. Hit **Walk Backwards** to animate the causal path: NRR → JPay Activity → Daily JPay Users → Onboarding
4. Explore Evidence tabs (timeline, counterfactual, forecast, recommendations)
5. Use action buttons (SQL, Jira, Slack) for demo toasts

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- React Flow (`@xyflow/react`) for the causal graph
- Recharts for sparklines and charts
- Lucide React for icons
