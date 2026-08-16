import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getLearningPath } from '../api/learningApi'
import { getPackage } from '../offline/packageStorage'
import { saveActivity } from '../offline/activityStorage'
import { submitAssessment } from '../api/assessmentApi'

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

  // Quiz-specific state
  const [pkgQuestions, setPkgQuestions]     = useState([])
  const [pkgAssessmentId, setPkgAssessmentId] = useState(null)
  const [quizAnswers, setQuizAnswers]       = useState({})
  const [quizFeedback, setQuizFeedback]     = useState(null)
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false)

  useEffect(() => {
    // Helper to load questions and assessmentId from offline store if package exists
    const loadQuestionsFromStore = () => {
      getPackage()
        .then((pkg) => {
          if (pkg) {
            setPkgQuestions(pkg.questions || [])
            setPkgAssessmentId(pkg.assessmentId || null)
          }
        })
        .catch((err) => {
          console.error('Failed to load questions from offline store:', err)
        })
    }

    const loadOfflinePackage = async () => {
      try {
        const pkg = await getPackage()
        if (pkg && pkg.lessons && pkg.lessons.length) {
          setLessons(itemsToLessons(pkg.lessons))
          setAssessmentTitle(pkg.title || 'Offline Learning Path')
          setSubject(pkg.lessons[0]?.topic || '')
          setPkgQuestions(pkg.questions || [])
          setPkgAssessmentId(pkg.assessmentId || null)
        } else {
          setError('No downloaded learning package found. Please connect to the internet to download your learning path.')
        }
      } catch (err) {
        setError('Failed to load offline learning package: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    // Always fetch offline store questions in background if available
    loadQuestionsFromStore()

    // If navigated from LearningPath with specific path data, use it directly
    if (state?.pathItems && state.pathItems.length) {
      setLessons(itemsToLessons(state.pathItems))
      setAssessmentTitle(state.assessmentTitle || '')
      setSubject(state.subject || '')
      setLoading(false)
      return
    }

    if (!navigator.onLine) {
      loadOfflinePackage()
      return
    }

    // Fallback: load the most recent active path from the API
    let active = true
    getLearningPath()
      .then(({ learningPath }) => {
        if (!active) return
        if (!learningPath || !learningPath.items || !learningPath.items.length) {
          // If no live learning path active, try loading offline package
          loadOfflinePackage()
          return
        }
        setLessons(itemsToLessons(learningPath.items))
        setAssessmentTitle(learningPath.assessment?.title || '')
        setSubject(learningPath.assessment?.subject || '')
      })
      .catch((err) => {
        if (active) {
          // Attempt offline package if API load fails
          loadOfflinePackage()
        }
      })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [state])

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

  // Filter questions for the current concept
  const currentConceptQuestions = (pkgQuestions || []).filter(
    (q) => q.concept === lesson.title || q.topic === lesson.topic
  )

  const handleAnswer = (option) => {
    setSelectedAnswer(option)
    setShowResult(false)
  }

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
      setSelectedAnswer('')
      setShowResult(false)
      setQuizAnswers({})
      setQuizFeedback(null)
    }
  }

  const previousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
      setSelectedAnswer('')
      setShowResult(false)
      setQuizAnswers({})
      setQuizFeedback(null)
    }
  }

  const handleQuizAnswer = (questionId, value) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleQuizSubmit = async () => {
    const answers = currentConceptQuestions.map((q) => ({
      questionId: q.questionId,
      answer: quizAnswers[q.questionId]
    }))

    if (!pkgAssessmentId) {
      setQuizFeedback({
        type: 'danger',
        message: 'No assessment ID found. Cannot submit quiz.'
      })
      return
    }

    setIsSubmittingQuiz(true)
    setQuizFeedback(null)

    if (navigator.onLine) {
      try {
        const res = await submitAssessment(pkgAssessmentId, answers)
        setQuizFeedback({
          type: 'success',
          message: `Quiz submitted successfully! Score: ${res.result.score}/${res.result.totalQuestions} (${res.result.percentage}%).`
        })
      } catch (err) {
        setQuizFeedback({
          type: 'danger',
          message: err.message || 'Failed to submit quiz.'
        })
      } finally {
        setIsSubmittingQuiz(false)
      }
    } else {
      try {
        const activity = {
          activityId: crypto.randomUUID(),
          type: 'quiz_submission',
          assessmentId: pkgAssessmentId,
          answers,
          completedAt: new Date().toISOString()
        }
        await saveActivity(activity)
        setQuizFeedback({
          type: 'success',
          message: "Saved offline. Your answers will sync when you're back online."
        })
        window.dispatchEvent(new Event('activity-updated'))
      } catch (err) {
        setQuizFeedback({
          type: 'danger',
          message: 'Failed to save quiz offline: ' + err.message
        })
      } finally {
        setIsSubmittingQuiz(false)
      }
    }
  }

  const isQuizReady = currentConceptQuestions.length > 0 && 
    currentConceptQuestions.every((q) => quizAnswers[q.questionId])

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

      {/* Concept Practice Quiz OR Fallback Self-check */}
      {currentConceptQuestions.length > 0 ? (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <span className="badge bg-primary mb-2">Concept Practice Quiz</span>
            <h3 className="fw-bold mb-4">Test your knowledge on "{lesson.title}"</h3>

            {currentConceptQuestions.map((q, qIndex) => (
              <div key={q.questionId} className="mb-5 border-bottom pb-4">
                <h5 className="fw-semibold mb-3">Question {qIndex + 1}: {q.questionText}</h5>
                <div className="d-flex flex-column gap-2">
                  {q.options.map((option) => {
                    const value = typeof option === 'string' ? option : option.value || option.text
                    const label = typeof option === 'string' ? option : option.text
                    const isSelected = quizAnswers[q.questionId] === value

                    return (
                      <button
                        key={value}
                        type="button"
                        className={`lesson-option text-start d-flex align-items-center py-2 px-3 border rounded ${isSelected ? 'selected border-primary bg-primary-subtle' : 'bg-light'}`}
                        onClick={() => handleQuizAnswer(q.questionId, value)}
                        disabled={isSubmittingQuiz}
                        style={{ transition: 'all 0.2s' }}
                      >
                        <span className="option-radio me-3 fw-bold">{isSelected ? '●' : '○'}</span>
                        <span>{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {quizFeedback && (
              <div className={`alert alert-${quizFeedback.type} mb-4`}>
                {quizFeedback.message}
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              disabled={!isQuizReady || isSubmittingQuiz}
              onClick={handleQuizSubmit}
            >
              {isSubmittingQuiz ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      ) : (
        /* Fallback Self-check */
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
      )}

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
