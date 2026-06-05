import { Network, Search } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="flex h-full w-14 shrink-0 flex-col items-center border-r border-border bg-surface py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
        <Network className="h-4 w-4 text-accent" />
      </div>

      <nav className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          title="Investigations"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"
        >
          <Search className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
        </button>
      </nav>

      <div className="mt-auto flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-[10px] font-semibold text-accent">
        FA
      </div>
    </aside>
  )
}
