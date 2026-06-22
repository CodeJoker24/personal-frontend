import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Goal = { id: string; title: string; description?: string; target_date?: string; status?: string; progress?: number; category?: string }

export default function Goals() {
  const [items, setItems] = useState<Goal[]>([])
  const [form, setForm] = useState<Partial<Goal>>({ status: 'active', progress: 0 })

  const load = () => api.get<Goal[]>('/api/goals').then(setItems)
  useEffect(() => { load() }, [])

  async function add(e: FormEvent) {
    e.preventDefault(); if (!form.title) return
    await api.post('/api/goals', form); setForm({ status: 'active', progress: 0 }); load()
  }
  async function update(g: Goal, patch: Partial<Goal>) { await api.put(`/api/goals/${g.id}`, patch); load() }
  async function remove(g: Goal) { if (confirm('Delete goal?')) { await api.delete(`/api/goals/${g.id}`); load() } }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Goals</h1>
      <form onSubmit={add} className="card mb-6 grid sm:grid-cols-2 gap-3">
        <input className="input sm:col-span-2" placeholder="Goal title" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="input sm:col-span-2" placeholder="Description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="input" type="date" value={form.target_date || ''} onChange={e => setForm({ ...form, target_date: e.target.value })} />
        <input className="input" placeholder="Category" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} />
        <button className="btn-primary sm:col-span-2">Add goal</button>
      </form>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(g => (
          <div key={g.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-lg">{g.title}</div>
                {g.description && <div className="text-sm text-muted mt-1">{g.description}</div>}
                <div className="text-xs text-muted mt-2">
                  {g.category && <span className="mr-2">#{g.category}</span>}
                  {g.target_date && <span>Due {g.target_date}</span>}
                </div>
              </div>
              <button className="btn-danger" onClick={() => remove(g)}>Delete</button>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Progress</span><span>{g.progress ?? 0}%</span>
              </div>
              <input type="range" min={0} max={100} value={g.progress ?? 0}
                onChange={e => update(g, { progress: Number(e.target.value) })} className="w-full" />
              <div className="mt-3">
                <select className="input" value={g.status || 'active'}
                  onChange={e => update(g, { status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
