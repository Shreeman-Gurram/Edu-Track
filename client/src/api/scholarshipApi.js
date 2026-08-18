import { get } from '../services/apiClient'

export const getScholarships = () => get('/scholarships', { authenticated: true })
