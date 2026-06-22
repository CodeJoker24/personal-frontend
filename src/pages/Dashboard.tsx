import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Summary = {
  habits_total: number; habits_done_today: number
  tasks_open: number; goals_open: number
  month_income: number; month_expense: number; month_net: number
}

export default function Dashboard() {
  const [s, setS] = useState<Summary | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    api.get<Summary>('/api/analytics/summary').then(setS).catch(e => setErr(e.message))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-1">Dashboard</h1>
      <p className="text-muted mb-6">A snapshot of today.</p>
      {err && <p className="text-red-400">{err}</p>}
      {!s ? <p className="text-muted">Loading…</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Stat label="Habits done today" value={`${s.habits_done_today} / ${s.habits_total}`} />
          <Stat label="Open tasks" value={s.tasks_open} />
          <Stat label="Open goals" value={s.goals_open} />
          <Stat label="Income (month)" value={`$${s.month_income.toFixed(2)}`} />
          <Stat label="Expense (month)" value={`$${s.month_expense.toFixed(2)}`} />
          <Stat label="Net (month)" value={`$${s.month_net.toFixed(2)}`} accent />
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="card">
      <div className="text-sm text-muted">{label}</div>
      <div className={`text-3xl font-semibold mt-2 ${accent ? 'text-accent' : ''}`}>{value}</div>
    </div>
  )
}
