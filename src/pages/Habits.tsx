import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Habit = { id: string; name: string; icon?: string; color?: string; is_default?: boolean }
type Log = { id: string; habit_id: string; date: string; completed: boolean }

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [name, setName] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  async function load() {
    const [h, l] = await Promise.all([
      api.get<Habit[]>('/api/habits'),
      api.get<Log[]>(`/api/habit-logs?from=${today}&to=${today}`),
    ])
    setHabits(h); setLogs(l)
  }
  useEffect(() => { load() }, [])

  const doneToday = (habitId: string) => logs.some(l => l.habit_id === habitId && l.completed)

  async function add(e: FormEvent) {
    e.preventDefault(); if (!name.trim()) return
    await api.post('/api/habits', { name, color: '#7c5cff' })
    setName(''); load()
  }
  async function toggle(h: Habit) {
    const done = doneToday(h.id)
    await api.post('/api/habit-logs', { habit_id: h.id, date: today, completed: !done })
    load()
  }
  async function remove(h: Habit) {
    if (!confirm(`Delete ${h.name}?`)) return
    await api.delete(`/api/habits/${h.id}`); load()
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Habits</h1>
      <form onSubmit={add} className="card mb-6 flex gap-2">
        <input className="input" placeholder="New habit name…" value={name} onChange={e => setName(e.target.value)} />
        <button className="btn-primary">Add</button>
      </form>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {habits.map(h => (
          <div key={h.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{ background: h.color || '#7c5cff' }} />
              <div>
                <div className="font-medium">{h.name}</div>
                <div className="text-xs text-muted">{doneToday(h.id) ? 'Done today' : 'Pending'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className={doneToday(h.id) ? 'btn-ghost' : 'btn-primary'} onClick={() => toggle(h)}>
                {doneToday(h.id) ? 'Undo' : 'Mark done'}
              </button>
              {!h.is_default && <button className="btn-danger" onClick={() => remove(h)}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
