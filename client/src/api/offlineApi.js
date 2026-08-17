import { get, post } from '../services/apiClient'

export const getLearningPackage = (learningPathId = null) => get(learningPathId ? `/offline/package?learningPathId=${learningPathId}` : '/offline/package', { authenticated: true })
export const syncOfflineActivity = (payload) => post('/offline/sync', payload, { authenticated: true })
