import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setErr(null); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setErr(error.message)
    nav('/')
  }

  async function google() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="card w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-muted text-sm mb-6">Sign in to your dashboard.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? '…' : 'Sign in'}</button>
        </form>
        <button onClick={google} className="btn-ghost w-full mt-3">Continue with Google</button>
        <div className="flex justify-between text-sm mt-4 text-muted">
          <Link to="/signup" className="hover:text-text">Create account</Link>
          <Link to="/reset-password" className="hover:text-text">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}
