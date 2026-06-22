import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Journal = { id: string; title?: string; content?: string; mood?: string; date: string }

export default function Journals() {
  const [items, setItems] = useState<Journal[]>([])
  const [form, setForm] = useState<Partial<Journal>>({ date: new Date().toISOString().slice(0, 10) })

  const load = () => api.get<Journal[]>('/api/journals').then(setItems)
  useEffect(() => { load() }, [])

  async function add(e: FormEvent) {
    e.preventDefault(); if (!form.content) return
    await api.post('/api/journals', form)
    setForm({ date: new Date().toISOString().slice(0, 10) }); load()
  }
  async function remove(j: Journal) { if (confirm('Delete entry?')) { await api.delete(`/api/journals/${j.id}`); load() } }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Journals</h1>
      <form onSubmit={add} className="card mb-6 space-y-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="input sm:col-span-2" placeholder="Title (optional)" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input className="input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <input className="input" placeholder="Mood (e.g. happy, focused…)" value={form.mood || ''} onChange={e => setForm({ ...form, mood: e.target.value })} />
        <textarea className="input min-h-32" placeholder="What happened today?" value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} />
        <button className="btn-primary">Save entry</button>
      </form>
      <div className="space-y-3">
        {items.map(j => (
          <div key={j.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-muted">{j.date} {j.mood && `· ${j.mood}`}</div>
                {j.title && <div className="font-medium mt-1">{j.title}</div>}
                <div className="mt-2 whitespace-pre-wrap text-sm">{j.content}</div>
              </div>
              <button className="btn-danger" onClick={() => remove(j)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
