import { get, post } from '../services/apiClient'

export const generateLearningPath = (payload) => post('/learning-path/generate', payload, { authenticated: true })
export const getLearningPath = () => get('/learning-path', { authenticated: true })
export const getLearningPaths = () => get('/learning-path/history', { authenticated: true })
export const getNextLearningItem = () => get('/learning-path/next', { authenticated: true })
