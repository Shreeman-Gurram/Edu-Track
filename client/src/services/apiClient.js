const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'edutrackToken'

const USER_KEY = 'edutrackUser'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_KEY)
  }
}

export function getCurrentUserFromStorage() {
  const userStr = localStorage.getItem(USER_KEY)
  try {
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export async function request(path, { method = 'GET', body, authenticated = false } = {}) {
  const headers = { Accept: 'application/json' }
  const token = getAuthToken()

  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (authenticated && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new Error('Unable to reach the server. Please try again.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Request failed with status ${response.status}`)
  }

  return data
}

export const get = (path, options) => request(path, { ...options, method: 'GET' })
export const post = (path, body, options) => request(path, { ...options, method: 'POST', body })
