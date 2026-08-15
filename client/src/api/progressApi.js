import { get } from '../services/apiClient'

export const getProgress = () => get('/progress', { authenticated: true })
export const getTopicProgress = (topic) => get(`/progress/${encodeURIComponent(topic)}`, { authenticated: true })
