import { useState } from 'react'
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'

export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('demoUser')) } catch { return null }
  })

  const enter = (user) => {
    sessionStorage.setItem('demoUser', JSON.stringify(user))
    setSession(user)
  }
  const leave = () => {
    sessionStorage.removeItem('demoUser')
    setSession(null)
  }

  return session ? <Dashboard me={session} onLeave={leave} /> : <Login onEnter={enter} />
}
