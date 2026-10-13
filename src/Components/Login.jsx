import { useEffect, useState } from 'react'
import { getUsers } from '../api'
import Avatar from './Avatar'

export default function Login({ onEnter }) {
  const [state, setState] = useState({ loading: true, users: [], offline: false })

  useEffect(() => {
    getUsers().then((r) => setState({ loading: false, ...r }))
  }, [])

  const { loading, users, offline } = state
  const profiles = users.slice(0, 3)

  return (
    <main className="login">
      <section className="login-hero">
        <p className="hero-tag">Démo en lecture seule</p>
        <h1>EVENTS MANAGEMENT</h1>
        <p>Parcourez les comptes de la base de données sans rien modifier. Aucun identifiant à saisir.</p>
      </section>

      <section className="login-card" aria-live="polite">
        <h2>Entrer dans la démo</h2>
        <p className={`status ${offline ? 'warn' : 'ok'}`}>
          {loading ? 'Connexion à la base…' : offline ? 'Serveur injoignable : données d’exemple' : 'Base de données connectée'}
        </p>

        <button className="btn primary" disabled={loading || !users.length} onClick={() => onEnter(profiles[0])}>
          Se connecter en un clic
        </button>

        {profiles.length > 1 && (
          <>
            <p className="or">ou choisir un profil</p>
            <ul className="profiles">
              {profiles.map((u) => (
                <li key={u.id}>
                  <button className="profile" onClick={() => onEnter(u)}>
                    <Avatar name={u.name} role={u.role} />
                    <span><strong>{u.name}</strong><small>{u.role}</small></span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  )
}