import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssessmentById, getAssessments, submitAssessment } from '../api/assessmentApi'
import { saveActivity } from '../offline/activityStorage'

function Assessment() {
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState([])
  const [assessment, setAssessment] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getAssessments().then(({ assessments: available }) => setAssessments(available)).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  }, [])

  const openAssessment = async (id) => {
    setLoading(true); setError('')
    try {
      const { assessment: selected } = await getAssessmentById(id)
      setAssessment(selected); setCurrentQuestion(0); setSelectedAnswers({})
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true); setError('')
    try {
      const answers = assessment.questions.map((question) => ({ questionId: question.id, answer: selectedAnswers[question.id] }))
      if (navigator.onLine) {
        const { result } = await submitAssessment(assessment.id, answers)
        navigate('/results', { state: { result } })
      } else {
        const activity = {
          activityId: crypto.randomUUID(),
          type: 'quiz_submission',
          assessmentId: assessment.id,
          answers,
          completedAt: new Date().toISOString()
        }
        await saveActivity(activity)
        window.dispatchEvent(new Event('activity-updated'))
        alert("Saved offline. Your answers will sync when you're back online.")
        navigate('/learning-path')
      }
    } catch (requestError) { setError(requestError.message) } finally { setIsSubmitting(false) }
  }

  if (loading) return <div className="text-muted">Loading assessments…</div>
  if (error && !assessment) return <div className="alert alert-danger">Unable to load assessments: {error}</div>
  if (!assessment) return <div className="assessment-page"><h1 className="page-title">Assessments</h1><p className="text-muted mb-4">Choose an assessment to begin.</p>{!assessments.length ? <div className="alert alert-info">No assessments are available for your grade.</div> : <div className="row g-3">{assessments.map((item) => <div className="col-12 col-md-6" key={item.id}><div className="card assessment-card h-100"><div className="card-body p-4"><h4>{item.title}</h4><p className="text-muted mb-3">{item.subject}{item.topic ? ` · ${item.topic}` : ''} · {item.questionCount} questions</p><button className="btn btn-primary" onClick={() => openAssessment(item.id)}>Start Assessment</button></div></div></div>)}</div>}</div>

  const question = assessment.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100
  const isLastQuestion = currentQuestion === assessment.questions.length - 1
  return <div className="assessment-page"><div className="mb-4"><h1 className="page-title">{assessment.title}</h1><p className="text-muted">{assessment.subject}{assessment.topic ? ` · ${assessment.topic}` : ''}</p></div>{error && <div className="alert alert-danger">{error}</div>}<div className="assessment-progress-section mb-4"><div className="d-flex justify-content-between mb-2"><span className="small text-muted">Question {currentQuestion + 1} of {assessment.questions.length}</span><span className="small fw-semibold">{Math.round(progress)}%</span></div><div className="progress assessment-progress"><div className="progress-bar" style={{ width: `${progress}%` }} /></div></div><div className="card assessment-card"><div className="card-body p-4 p-md-5"><span className="badge text-bg-primary mb-3">Question {currentQuestion + 1}</span><h2 className="assessment-question">{question.questionText}</h2><div className="assessment-options">{question.options.map((option) => { const value = typeof option === 'string' ? option : option.value || option.text; const label = typeof option === 'string' ? option : option.text; return <button key={value} type="button" className={`assessment-option ${selectedAnswers[question.id] === value ? 'selected' : ''}`} onClick={() => setSelectedAnswers({ ...selectedAnswers, [question.id]: value })} disabled={isSubmitting}><span className="option-circle">{selectedAnswers[question.id] === value ? '✓' : ''}</span><span>{label}</span></button> })}</div><div className="d-flex justify-content-between mt-4"><button className="btn btn-outline-secondary" onClick={() => setCurrentQuestion(currentQuestion - 1)} disabled={currentQuestion === 0 || isSubmitting}>← Previous</button>{isLastQuestion ? <button className="btn btn-primary" onClick={handleSubmit} disabled={!selectedAnswers[question.id] || isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit Assessment'}</button> : <button className="btn btn-primary" onClick={() => setCurrentQuestion(currentQuestion + 1)} disabled={!selectedAnswers[question.id] || isSubmitting}>Next →</button>}</div></div></div></div>
}

export default Assessment
