import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const NAV = [
  { to: '/', label: 'Dashboard' },
  { to: '/habits', label: 'Habits' },
  { to: '/goals', label: 'Goals' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/projects', label: 'Projects' },
  { to: '/journals', label: 'Journals' },
  { to: '/finance', label: 'Finance' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/profile', label: 'Profile' },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r border-border bg-surface p-4 hidden md:flex flex-col">
        <div className="text-lg font-semibold mb-6 px-2">Life Dashboard</div>
        <nav className="flex flex-col gap-1">
          {NAV.map(n => (
            <NavLink
              key={n.to} to={n.to} end={n.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-primary/15 text-primary' : 'text-muted hover:text-text hover:bg-bg'}`
              }
            >{n.label}</NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-border">
          <div className="text-xs text-muted truncate mb-2">{user?.email}</div>
          <button className="btn-ghost w-full text-sm" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  )
}
