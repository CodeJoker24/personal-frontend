import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function Signup() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setErr(null); setMsg(null); setLoading(true)
    const { error, data } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { display_name: displayName } },
    })
    setLoading(false)
    if (error) return setErr(error.message)
    if (data.session) nav('/')
    else setMsg('Check your email to confirm your account.')
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="card w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-1">Create account</h1>
        <p className="text-muted text-sm mb-6">Start tracking your life today.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div><label className="label">Display name</label>
            <input className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
          <div><label className="label">Email</label>
            <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><label className="label">Password</label>
            <input className="input" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} /></div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          {msg && <p className="text-sm text-accent">{msg}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? '…' : 'Sign up'}</button>
        </form>
        <p className="text-sm text-muted mt-4">Have an account? <Link to="/login" className="text-text">Sign in</Link></p>
      </div>
    </div>
  )
}
