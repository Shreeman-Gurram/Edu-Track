import { post } from '../services/apiClient'

export const askQuestion = (payload) =>
  post('/ai/ask', payload, { authenticated: true })

export const getExplanation = (payload) =>
  post('/ai/explain', payload, { authenticated: true })

export const getPractice = (payload) =>
  post('/ai/generate-practice', payload, { authenticated: true })