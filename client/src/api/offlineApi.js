import { get, post } from '../services/apiClient'

export const getLearningPackage = () => get('/offline/package', { authenticated: true })
export const syncOfflineActivity = (payload) => post('/offline/sync', payload, { authenticated: true })
