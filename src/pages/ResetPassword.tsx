import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function ResetPassword() {
  const [recovery, setRecovery] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) setRecovery(true)
  }, [])

  async function sendLink(e: FormEvent) {
    e.preventDefault(); setErr(null); setMsg(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) return setErr(error.message)
    setMsg('Check your inbox for a reset link.')
  }

  async function updatePw(e: FormEvent) {
    e.preventDefault(); setErr(null); setMsg(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return setErr(error.message)
    setMsg('Password updated. You can sign in now.')
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="card w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">{recovery ? 'Set new password' : 'Reset password'}</h1>
        {recovery ? (
          <form onSubmit={updatePw} className="space-y-3">
            <div><label className="label">New password</label>
              <input className="input" type="password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} /></div>
            <button className="btn-primary w-full">Update password</button>
          </form>
        ) : (
          <form onSubmit={sendLink} className="space-y-3">
            <div><label className="label">Email</label>
              <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
            <button className="btn-primary w-full">Send reset link</button>
          </form>
        )}
        {err && <p className="text-sm text-red-400 mt-3">{err}</p>}
        {msg && <p className="text-sm text-accent mt-3">{msg}</p>}
        <p className="text-sm text-muted mt-4"><Link to="/login" className="text-text">Back to sign in</Link></p>
      </div>
    </div>
  )
}
