import { post } from '../services/apiClient'

export const getExplanation = (payload) => post('/ai/explanation', payload, { authenticated: true })
export const getPractice = (payload) => post('/ai/practice', payload, { authenticated: true })
