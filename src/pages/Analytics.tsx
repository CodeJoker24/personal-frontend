import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Log = { habit_id: string; date: string; completed: boolean }
type Habit = { id: string; name: string; color?: string }

export default function Analytics() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    const from = new Date(Date.now() - 29 * 86400_000).toISOString().slice(0, 10)
    const to = new Date().toISOString().slice(0, 10)
    Promise.all([
      api.get<Habit[]>('/api/habits'),
      api.get<Log[]>(`/api/habit-logs?from=${from}&to=${to}`),
    ]).then(([h, l]) => { setHabits(h); setLogs(l) })
  }, [])

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i))
    return d.toISOString().slice(0, 10)
  })

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-1">Analytics</h1>
      <p className="text-muted mb-6">30-day habit consistency.</p>
      <div className="card overflow-x-auto">
        <table className="text-xs">
          <thead><tr><th className="text-left pr-3 py-1 text-muted">Habit</th>
            {days.map(d => <th key={d} className="px-0.5 text-muted">{d.slice(8)}</th>)}
            <th className="pl-3 text-muted">Total</th>
          </tr></thead>
          <tbody>
            {habits.map(h => {
              const set = new Set(logs.filter(l => l.habit_id === h.id && l.completed).map(l => l.date))
              const total = set.size
              return (
                <tr key={h.id}>
                  <td className="pr-3 py-1 whitespace-nowrap">{h.name}</td>
                  {days.map(d => (
                    <td key={d} className="px-0.5">
                      <div className="w-4 h-4 rounded"
                        style={{ background: set.has(d) ? (h.color || '#7c5cff') : '#1f2330' }} />
                    </td>
                  ))}
                  <td className="pl-3 text-muted">{total}/30</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
