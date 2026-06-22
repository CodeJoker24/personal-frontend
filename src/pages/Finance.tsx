import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Tx = { id: string; amount: number; type: 'income' | 'expense'; category?: string; description?: string; date: string }
type Budget = { id: string; name: string; amount: number; period?: string; category?: string }

export default function Finance() {
  const [tx, setTx] = useState<Tx[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [txForm, setTxForm] = useState<Partial<Tx>>({ type: 'expense', date: new Date().toISOString().slice(0, 10) })
  const [bForm, setBForm] = useState<Partial<Budget>>({ period: 'monthly' })

  async function load() {
    const [t, b] = await Promise.all([api.get<Tx[]>('/api/transactions'), api.get<Budget[]>('/api/budgets')])
    setTx(t); setBudgets(b)
  }
  useEffect(() => { load() }, [])

  async function addTx(e: FormEvent) {
    e.preventDefault(); if (txForm.amount === undefined) return
    await api.post('/api/transactions', { ...txForm, amount: Number(txForm.amount) })
    setTxForm({ type: 'expense', date: new Date().toISOString().slice(0, 10) }); load()
  }
  async function addBudget(e: FormEvent) {
    e.preventDefault(); if (!bForm.name || bForm.amount === undefined) return
    await api.post('/api/budgets', { ...bForm, amount: Number(bForm.amount) })
    setBForm({ period: 'monthly' }); load()
  }
  async function delTx(t: Tx) { await api.delete(`/api/transactions/${t.id}`); load() }
  async function delB(b: Budget) { await api.delete(`/api/budgets/${b.id}`); load() }

  const income = tx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = tx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Finance</h1>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <div className="card"><div className="text-sm text-muted">Income</div><div className="text-2xl text-emerald-400">${income.toFixed(2)}</div></div>
        <div className="card"><div className="text-sm text-muted">Expense</div><div className="text-2xl text-red-400">${expense.toFixed(2)}</div></div>
        <div className="card"><div className="text-sm text-muted">Net</div><div className="text-2xl">${(income - expense).toFixed(2)}</div></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <h2 className="font-medium mb-2">Add transaction</h2>
          <form onSubmit={addTx} className="card grid grid-cols-2 gap-3 mb-4">
            <select className="input" value={txForm.type} onChange={e => setTxForm({ ...txForm, type: e.target.value as Tx['type'] })}>
              <option value="expense">Expense</option><option value="income">Income</option>
            </select>
            <input className="input" type="number" step="0.01" placeholder="Amount" value={txForm.amount ?? ''} onChange={e => setTxForm({ ...txForm, amount: Number(e.target.value) })} />
            <input className="input" placeholder="Category" value={txForm.category || ''} onChange={e => setTxForm({ ...txForm, category: e.target.value })} />
            <input className="input" type="date" value={txForm.date} onChange={e => setTxForm({ ...txForm, date: e.target.value })} />
            <input className="input col-span-2" placeholder="Description" value={txForm.description || ''} onChange={e => setTxForm({ ...txForm, description: e.target.value })} />
            <button className="btn-primary col-span-2">Add</button>
          </form>
          <div className="space-y-2">
            {tx.map(t => (
              <div key={t.id} className="card flex justify-between items-center">
                <div>
                  <div className={`font-medium ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted">{t.date} · {t.category} · {t.description}</div>
                </div>
                <button className="btn-danger" onClick={() => delTx(t)}>Delete</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-medium mb-2">Budgets</h2>
          <form onSubmit={addBudget} className="card grid grid-cols-2 gap-3 mb-4">
            <input className="input col-span-2" placeholder="Name" value={bForm.name || ''} onChange={e => setBForm({ ...bForm, name: e.target.value })} />
            <input className="input" type="number" step="0.01" placeholder="Amount" value={bForm.amount ?? ''} onChange={e => setBForm({ ...bForm, amount: Number(e.target.value) })} />
            <select className="input" value={bForm.period} onChange={e => setBForm({ ...bForm, period: e.target.value })}>
              <option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
            </select>
            <input className="input col-span-2" placeholder="Category" value={bForm.category || ''} onChange={e => setBForm({ ...bForm, category: e.target.value })} />
            <button className="btn-primary col-span-2">Add budget</button>
          </form>
          <div className="space-y-2">
            {budgets.map(b => (
              <div key={b.id} className="card flex justify-between items-center">
                <div>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted">${Number(b.amount).toFixed(2)} · {b.period} · {b.category}</div>
                </div>
                <button className="btn-danger" onClick={() => delB(b)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
