import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

type Profile = { id: string; display_name?: string; avatar_url?: string; bio?: string }

export default function Profile() {
  const { user } = useAuth()
  const [p, setP] = useState<Profile | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => { api.get<Profile>('/api/profile').then(setP) }, [])

  async function save(e: FormEvent) {
    e.preventDefault(); if (!p) return
    const updated = await api.put<Profile>('/api/profile', {
      display_name: p.display_name, avatar_url: p.avatar_url, bio: p.bio,
    })
    setP(updated); setMsg('Saved.'); setTimeout(() => setMsg(null), 2000)
  }

  if (!p) return <p className="text-muted">Loading…</p>

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-semibold mb-6">Profile</h1>
      <form onSubmit={save} className="card space-y-3">
        <div><label className="label">Email</label>
          <input className="input" disabled value={user?.email || ''} /></div>
        <div><label className="label">Display name</label>
          <input className="input" value={p.display_name || ''} onChange={e => setP({ ...p, display_name: e.target.value })} /></div>
        <div><label className="label">Avatar URL</label>
          <input className="input" value={p.avatar_url || ''} onChange={e => setP({ ...p, avatar_url: e.target.value })} /></div>
        <div><label className="label">Bio</label>
          <textarea className="input min-h-24" value={p.bio || ''} onChange={e => setP({ ...p, bio: e.target.value })} /></div>
        <button className="btn-primary">Save</button>
        {msg && <p className="text-sm text-accent">{msg}</p>}
      </form>
    </div>
  )
}
