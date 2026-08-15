import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getLearningPath } from '../api/learningApi'

function buildKeyPoints(item) {
  const points = []
  if (item.recommendedAction) points.push(item.recommendedAction)
  if (item.trend === 'declining')
    points.push('Your score on this concept has dropped — focus carefully before moving on.')
  if (item.trend === 'improving')
    points.push('You are improving on this concept — keep up the consistent practice.')
  if ((item.latestScore || 0) < 40)
    points.push('Start with the basics and make sure the core idea is clear before practising.')
  else if ((item.latestScore || 0) < 60)
    points.push('You have a partial understanding — review examples and try more questions.')
  else if ((item.latestScore || 0) < 80)
    points.push('You are close to mastering this — a few more practice rounds should do it.')
  else
    points.push('You are strong here — challenge yourself with harder variations.')
  points.push(`Your current score on this concept: ${Math.round(item.latestScore || 0)}%`)
  return points
}

function priorityColour(priority) {
  if (priority === 'high')   return 'danger'
  if (priority === 'medium') return 'warning'
  return 'success'
}

function itemsToLessons(items) {
  return items.map((item) => ({
    id:        item._id || item.concept,
    title:     item.concept || item.topic,
    topic:     item.topic,
    content:   item.recommendedAction || 'Review this concept and complete the practice questions below.',
    keyPoints: buildKeyPoints(item),
    priority:  item.priority,
    score:     Math.round(item.latestScore || 0),
    trend:     item.trend,
    status:    item.status,
  }))
}

function LearningContent() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [lessons, setLessons]               = useState([])
  const [assessmentTitle, setAssessmentTitle] = useState('')
  const [subject, setSubject]               = useState('')
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState('')
  const [currentLesson, setCurrentLesson]   = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult]         = useState(false)

  useEffect(() => {
    // If navigated from LearningPath with specific path data, use it directly
    if (state?.pathItems && state.pathItems.length) {
      setLessons(itemsToLessons(state.pathItems))
      setAssessmentTitle(state.assessmentTitle || '')
      setSubject(state.subject || '')
      setLoading(false)
      return
    }

    // Fallback: load the most recent active path from the API
    let active = true
    getLearningPath()
      .then(({ learningPath }) => {
        if (!active) return
        if (!learningPath || !learningPath.items || !learningPath.items.length) {
          setLoading(false)
          return
        }
        setLessons(itemsToLessons(learningPath.items))
        setAssessmentTitle(learningPath.assessment?.title || '')
        setSubject(learningPath.assessment?.subject || '')
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (loading) return <div className="text-muted container py-4">Loading learning content…</div>

  if (!lessons.length) return (
    <div className="container py-4">
      <button
        className="btn btn-link text-decoration-none px-0 mb-4"
        onClick={() => navigate('/learning-path')}
      >
        ← Back to Learning Path
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="alert alert-info">
        No learning content yet.{' '}
        <button className="btn btn-link p-0" onClick={() => navigate('/assessment')}>
          Take an assessment
        </button>{' '}
        to generate your personalised lessons.
      </div>
    </div>
  )

  const lesson   = lessons[currentLesson]
  const progress = ((currentLesson + 1) / lessons.length) * 100

  const handleAnswer = (option) => {
    setSelectedAnswer(option)
    setShowResult(false)
  }

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
      setSelectedAnswer('')
      setShowResult(false)
    }
  }

  const previousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
      setSelectedAnswer('')
      setShowResult(false)
    }
  }

  return (
    <div className="container py-4 learning-content-page">

      {/* Back Button */}
      <button
        className="btn btn-link text-decoration-none px-0 mb-4"
        onClick={() => navigate('/learning-path')}
      >
        ← Back to Learning Path
      </button>

      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary mb-2">
          {subject || lesson.topic}
        </span>

        <h1 className="fw-bold mb-2">
          {assessmentTitle || lesson.title}
        </h1>

        <p className="text-muted mb-0">
          Concept {currentLesson + 1} of {lessons.length}
        </p>
      </div>

      {/* Progress */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">

          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">Learning Progress</span>
            <span className="text-muted">{Math.round(progress)}%</span>
          </div>

          <div className="progress" style={{ height: '10px' }}>
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>

        </div>
      </div>

      {/* Concept Score + Priority */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 d-flex gap-3 align-items-center flex-wrap">
          <div>
            <span className="text-muted small d-block">Concept</span>
            <strong>{lesson.title}</strong>
          </div>
          <div>
            <span className="text-muted small d-block">Your Score</span>
            <strong className="fs-5">{lesson.score}%</strong>
          </div>
          <div>
            <span className="text-muted small d-block">Priority</span>
            <span className={`badge text-bg-${priorityColour(lesson.priority)}`}>
              {lesson.priority}
            </span>
          </div>
          <div>
            <span className="text-muted small d-block">Trend</span>
            <span className="fw-semibold text-capitalize">
              {(lesson.trend || '').replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">

          <h2 className="fw-bold mb-3">{lesson.title}</h2>

          <p className="fs-5 text-muted">{lesson.content}</p>

        </div>
      </div>

      {/* Key Points */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">

          <h3 className="fw-bold mb-4">Key Points</h3>

          <div>
            {lesson.keyPoints.map((point, index) => (
              <div key={index} className="learning-point mb-3">
                <span className="point-icon">✓</span>
                <span>{point}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Self-check */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">

          <div className="mb-4">
            <span className="badge bg-primary mb-2">Self Check</span>
            <h3 className="fw-bold">Do you feel confident about "{lesson.title}"?</h3>
          </div>

          <div className="mb-4">
            {['Yes, I understand it', 'Somewhat — need more practice', 'No — I need to review again'].map((option) => (
              <button
                key={option}
                type="button"
                className={`lesson-option ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswer(option)}
              >
                <span className="option-radio">{selectedAnswer === option ? '●' : '○'}</span>
                <span>{option}</span>
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary"
            disabled={!selectedAnswer}
            onClick={() => setShowResult(true)}
          >
            Submit
          </button>

          {showResult && (
            <div className="mt-4">
              {selectedAnswer === 'Yes, I understand it' ? (
                <div className="alert alert-success mb-0">
                  <strong>Great! 🎉</strong> Move on to the next concept when you are ready.
                </div>
              ) : selectedAnswer === 'Somewhat — need more practice' ? (
                <div className="alert alert-warning mb-0">
                  <strong>Keep going.</strong> Re-read the key points and try the next concept — practice makes it stick.
                </div>
              ) : (
                <div className="alert alert-danger mb-0">
                  <strong>No problem.</strong> Review the content above carefully, then retake the assessment to rebuild your score.
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Navigation */}
      <div className="d-flex justify-content-between align-items-center gap-3">

        <button
          className="btn btn-outline-secondary"
          disabled={currentLesson === 0}
          onClick={previousLesson}
        >
          ← Previous
        </button>

        <span className="text-muted small">
          {currentLesson + 1} / {lessons.length}
        </span>

        <button
          className="btn btn-primary"
          disabled={currentLesson === lessons.length - 1}
          onClick={nextLesson}
        >
          Next →
        </button>

      </div>

    </div>
  )
}

export default LearningContent
