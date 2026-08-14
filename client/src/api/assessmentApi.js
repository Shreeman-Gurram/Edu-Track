import { get, post } from '../services/apiClient'

export const getAssessments = () => get('/assessments', { authenticated: true })
export const getAssessmentById = (id) => get(`/assessments/${id}`, { authenticated: true })
export const submitAssessment = (id, answers) => post(`/assessments/${id}/submit`, { answers }, { authenticated: true })
