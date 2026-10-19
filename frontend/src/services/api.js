export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost/backend/api'

export async function postJSON(path, body, withCredentials = true) {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: withCredentials ? 'include' : 'omit',
    body: JSON.stringify(body)
  })
  return res.json()
}

export async function getJSON(path){
  const res = await fetch(`${API_BASE}/${path}`, { credentials: 'include' })
  return res.json()
}
