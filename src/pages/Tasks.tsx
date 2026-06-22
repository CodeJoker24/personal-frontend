import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Task = { id: string; title: string; status?: string; priority?: string; due_date?: string; completed?: boolean }

export default function Tasks() {
  const [items, setItems] = useState<Task[]>([])
  const [form, setForm] = useState<Partial<Task>>({ status: 'todo', priority: 'medium' })

  const load = () => api.get<Task[]>('/api/tasks').then(setItems)
  useEffect(() => { load() }, [])

  async function add(e: FormEvent) {
    e.preventDefault(); if (!form.title) return
    await api.post('/api/tasks', form); setForm({ status: 'todo', priority: 'medium' }); load()
  }
  async function toggle(t: Task) {
    const done = t.status === 'done'
    await api.put(`/api/tasks/${t.id}`, { status: done ? 'todo' : 'done', completed: !done }); load()
  }
  async function remove(t: Task) { if (confirm('Delete task?')) { await api.delete(`/api/tasks/${t.id}`); load() } }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Tasks</h1>
      <form onSubmit={add} className="card mb-6 grid sm:grid-cols-4 gap-3">
        <input className="input sm:col-span-2" placeholder="Task title" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
        <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <input className="input" type="date" value={form.due_date || ''} onChange={e => setForm({ ...form, due_date: e.target.value })} />
        <button className="btn-primary sm:col-span-4">Add task</button>
      </form>
      <div className="space-y-2">
        {items.map(t => (
          <div key={t.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={t.status === 'done'} onChange={() => toggle(t)} className="w-4 h-4" />
              <div>
                <div className={t.status === 'done' ? 'line-through text-muted' : ''}>{t.title}</div>
                <div className="text-xs text-muted">
                  {t.priority && <span className="mr-2">{t.priority}</span>}
                  {t.due_date && <span>Due {t.due_date}</span>}
                </div>
              </div>
            </div>
            <button className="btn-danger" onClick={() => remove(t)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
