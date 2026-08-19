import { get, post } from '../services/apiClient'

export const register = (payload) => post('/auth/register', payload)
export const login = (payload) => post('/auth/login', payload)
export const getCurrentUser = () => get('/auth/me', { authenticated: true })
export const forgotPassword = (payload) => post('/auth/forgot-password', payload)
export const resetPassword = (token, payload) => post(`/auth/reset-password/${token}`, payload)
