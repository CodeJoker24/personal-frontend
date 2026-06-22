import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Project = { id: string; name: string; description?: string; status?: string; color?: string; start_date?: string; end_date?: string }

export default function Projects() {
  const [items, setItems] = useState<Project[]>([])
  const [form, setForm] = useState<Partial<Project>>({ status: 'active', color: '#22d3ee' })

  const load = () => api.get<Project[]>('/api/projects').then(setItems)
  useEffect(() => { load() }, [])

  async function add(e: FormEvent) {
    e.preventDefault(); if (!form.name) return
    await api.post('/api/projects', form); setForm({ status: 'active', color: '#22d3ee' }); load()
  }
  async function remove(p: Project) { if (confirm('Delete project?')) { await api.delete(`/api/projects/${p.id}`); load() } }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Projects</h1>
      <form onSubmit={add} className="card mb-6 grid sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Project name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="color" value={form.color || '#22d3ee'} onChange={e => setForm({ ...form, color: e.target.value })} />
        <input className="input sm:col-span-2" placeholder="Description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="input" type="date" value={form.start_date || ''} onChange={e => setForm({ ...form, start_date: e.target.value })} />
        <input className="input" type="date" value={form.end_date || ''} onChange={e => setForm({ ...form, end_date: e.target.value })} />
        <button className="btn-primary sm:col-span-2">Add project</button>
      </form>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(p => (
          <div key={p.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <span className="w-3 h-3 rounded-full" style={{ background: p.color || '#22d3ee' }} />
                <div>
                  <div className="font-medium text-lg">{p.name}</div>
                  {p.description && <div className="text-sm text-muted mt-1">{p.description}</div>}
                  <div className="text-xs text-muted mt-2">
                    {p.start_date} {p.end_date && `→ ${p.end_date}`}
                  </div>
                </div>
              </div>
              <button className="btn-danger" onClick={() => remove(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
