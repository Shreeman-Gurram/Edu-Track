import { get, post } from '../services/apiClient'

export const register = (payload) => post('/auth/register', payload)
export const login = (payload) => post('/auth/login', payload)
export const getCurrentUser = () => get('/auth/me', { authenticated: true })
