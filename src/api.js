import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000',
  timeout: 4000,
})

// Mode démo : seules les requêtes GET sont autorisées.
api.interceptors.request.use((config) => {
  if ((config.method || 'get').toLowerCase() !== 'get') {
    return Promise.reject(new Error('Mode lecture seule : seules les requêtes GET sont autorisées.'))
  }
  return config
})

const SAMPLE = [
  { id: 1, name: 'Amira Ben Salah', login: 'amira', email: 'amira@exemple.tn', role: 'admin' },
  { id: 2, name: 'Youssef Trabelsi', login: 'youssef', email: 'youssef@exemple.tn', role: 'dev' },
  { id: 3, name: 'Nour Gharbi', login: 'nour', email: 'nour@exemple.tn', role: 'user' },
  { id: 4, name: 'Karim Jlassi', login: 'karim', email: 'karim@exemple.tn', role: 'user' },
  { id: 5, name: 'Salma Mrad', login: 'salma', email: 'salma@exemple.tn', role: 'dev' },
]

// Ne garde que les champs affichables (jamais de mot de passe).
const clean = (u, i) => ({
  id: u.id ?? u._id ?? i,
  name: u.name || u.login || 'Sans nom',
  login: u.login || '',
  email: u.email || '',
  role: u.role || 'user',
})

// GET /users → { users, offline }. Si le serveur est injoignable, données d'exemple.
export async function getUsers() {
  try {
    const { data } = await api.get('/demo/users')
    const list = Array.isArray(data) ? data : data.users || data.data || []
    return { users: list.map(clean), offline: false }
  } catch {
    return { users: SAMPLE, offline: true }
  }
}

const SAMPLE_EVENTS = [
  { id: 1, title: 'Festival du film méditerranéen', description: 'Projections et rencontres avec des réalisateurs.', date: '2026-11-14', place: 'Sfax', image: '', time: '18:00' },
  { id: 2, title: 'Salon de l’emploi', description: 'Plus de 60 entreprises recrutent.', date: '2026-11-21', place: 'Tunis', image: '', time: '09:00' },
  { id: 3, title: 'Concert au bord de mer', description: 'Soirée musicale en plein air.', date: '2026-12-05', place: 'Sousse', image: '', time: '20:30' },
]

// GET /demo/evenements → { events, offline }
export async function getEvents() {
  try {
    const { data } = await api.get('/demo/evenements')
    return { events: Array.isArray(data) ? data : [], offline: false }
  } catch {
    return { events: SAMPLE_EVENTS, offline: true }
  }
}
