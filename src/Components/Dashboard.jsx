import { useEffect, useMemo, useState } from 'react'
import { getUsers, getEvents } from '../api'
import Avatar from './Avatar'

const ROLES = ['all', 'admin', 'dev', 'user']
const LABEL = { all: 'Tous', admin: 'Admin', dev: 'Développeur', user: 'Utilisateur' }
const fmt = (d) => {
  const x = new Date(String(d).length === 10 ? `${d}T00:00:00` : d)
  return isNaN(x) ? d : x.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
const has = (q, ...vals) => !q || vals.some((v) => String(v || '').toLowerCase().includes(q))

export default function Dashboard({ me, onLeave }) {
  const [data, setData] = useState({ loading: true, users: [], events: [], offline: false })
  const [tab, setTab] = useState('users')
  const [q, setQ] = useState('')
  const [role, setRole] = useState('all')

  useEffect(() => {
    Promise.all([getUsers(), getEvents()]).then(([u, e]) =>
      setData({ loading: false, users: u.users, events: e.events, offline: u.offline || e.offline }))
  }, [])

  const s = q.trim().toLowerCase()
  const users = useMemo(() => data.users.filter((u) =>
    (role === 'all' || u.role === role) && has(s, u.name, u.login, u.email)), [data.users, s, role])
  const events = useMemo(() => data.events.filter((e) =>
    has(s, e.title, e.place, e.description)), [data.events, s])

  const isUsers = tab === 'users'
  const shown = isUsers ? users.length : events.length
  const total = isUsers ? data.users.length : data.events.length
  const switchTab = (t) => { setTab(t); setQ('') }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="me">
          <Avatar name={me.name} role={me.role} size={36} />
          <span><strong>{me.name}</strong><small>Connecté · lecture seule</small></span>
        </div>
        <button className="btn ghost" onClick={onLeave}>Quitter la démo</button>
      </header>

      <main className="content">
        <div className="head">
          <h1>{isUsers ? 'Utilisateurs' : 'Événements'}</h1>
          <p>{data.loading ? 'Chargement…' : `${shown} sur ${total}`}</p>
        </div>

        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={isUsers} className={`tab ${isUsers ? 'on' : ''}`} onClick={() => switchTab('users')}>Utilisateurs</button>
          <button role="tab" aria-selected={!isUsers} className={`tab ${!isUsers ? 'on' : ''}`} onClick={() => switchTab('events')}>Événements</button>
        </div>

        {data.offline && <p className="banner">Serveur injoignable : affichage de données d’exemple.</p>}

        <div className="tools">
          <input type="search" aria-label="Rechercher" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={isUsers ? 'Rechercher un nom, un login, un e-mail' : 'Rechercher un titre, un lieu'} />
          {isUsers && (
            <div className="chips" role="group" aria-label="Filtrer par rôle">
              {ROLES.map((r) => (
                <button key={r} className={`chip ${role === r ? 'on' : ''}`} aria-pressed={role === r}
                  onClick={() => setRole(r)}>{LABEL[r]}</button>
              ))}
            </div>
          )}
        </div>

        {shown === 0 && !data.loading ? (
          <p className="empty">Aucun résultat. Essayez un autre mot{isUsers ? ' ou choisissez « Tous »' : ''}.</p>
        ) : isUsers ? (
          <table className="table">
            <thead><tr><th>Utilisateur</th><th>Login</th><th>E-mail</th><th>Rôle</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label="Utilisateur"><span className="who"><Avatar name={u.name} role={u.role} />{u.name}</span></td>
                  <td data-label="Login">{u.login}</td>
                  <td data-label="E-mail">{u.email}</td>
                  <td data-label="Rôle"><span className={`pill role-${u.role}`}>{LABEL[u.role] || u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="events">
            {events.map((e) => (
              <article className="event" key={e.id}>
                {/^https?:/.test(e.image || '') && <img src={e.image} alt="" loading="lazy" />}
                <div className="event-body">
                  <h3>{e.title}</h3>
                  <div className="meta">
                    <span>{fmt(e.date)}</span>{e.time && <span>{e.time}</span>}{e.place && <span>{e.place}</span>}
                  </div>
                  <p>{e.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
