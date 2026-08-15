import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLearningPaths } from '../api/learningApi'

// Overall priority based on average score across all concepts in the path
function overallPriorityLabel(items) {
  if (!items || !items.length) return 'low'
  const avg = items.reduce((sum, i) => sum + (i.latestScore || 0), 0) / items.length
  if (avg < 40) return 'high'
  if (avg < 70) return 'medium'
  return 'low'
}

function overallProgress(items) {
  if (!items || !items.length) return 0
  return Math.round(
    items.reduce((sum, i) => sum + (i.latestScore || 0), 0) / items.length
  )
}

function priorityBadgeColour(priority) {
  if (priority === 'high')   return 'danger'
  if (priority === 'medium') return 'warning'
  return 'success'
}

function LearningPath() {
  const navigate    = useNavigate()
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [paths, setPaths]         = useState([])
  const [focusPath, setFocusPath] = useState(null)

  useEffect(() => {
    let active = true
    getLearningPaths()
      .then(({ learningPaths }) => {
        if (!active) return
        if (!learningPaths || !learningPaths.length) {
          setLoading(false)
          return
        }

        // Build display structure — learningPaths is newest-first from API
        const built = learningPaths.map((lp) => ({
          id:           lp._id,
          assessment:   lp.assessment?.title || 'Assessment',
          assessmentId: lp.assessment?._id
            ? String(lp.assessment._id)
            : String(lp.assessment || lp._id),
          subject:      lp.assessment?.subject || '',
          items:        lp.items || [],
          progress:     overallProgress(lp.items),
          priority:     overallPriorityLabel(lp.items || []),
          createdAt:    lp.createdAt,
        }))

        // Deduplicate: same assessment taken multiple times →
        // keep only the most recent path (first occurrence, API is newest-first)
        const seen    = new Set()
        const deduped = built.filter((lp) => {
          const key = lp.assessmentId
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })

        setPaths(deduped)

        // Focus = lowest average score (most needs attention)
        const priorityRank = { high: 1, medium: 2, low: 3 }
        const focus = [...deduped].sort(
          (a, b) => priorityRank[a.priority] - priorityRank[b.priority]
        )[0]
        setFocusPath(focus)
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const openPath = (lp) => {
    navigate('/learning-content', {
      state: {
        pathId:          lp.id,
        pathItems:       lp.items,
        assessmentTitle: lp.assessment,
        subject:         lp.subject,
      },
    })
  }

  if (loading) return <div className="text-muted container py-4">Loading your learning path…</div>

  if (!paths.length) return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold">Your Learning Path</h1>
        <p className="text-muted">A learning plan based on your current performance.</p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="alert alert-info">
        No learning path yet.{' '}
        <button className="btn btn-link p-0" onClick={() => navigate('/assessment')}>
          Take an assessment
        </button>{' '}
        to generate your personalised track.
      </div>
    </div>
  )

  return (
    <div className="container py-4">

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="fw-bold">Your Learning Path</h1>
        <p className="text-muted">A learning plan based on your current performance.</p>
      </div>

      {/* Focus Area — path that needs the most attention */}
      {focusPath && (
        <div className="card focus-card mb-5">
          <div className="card-body p-4">

            <span className="badge text-bg-primary mb-3">
              🎯 Focus Area
            </span>

            <h2 className="fw-bold">
              {focusPath.assessment}
            </h2>

            <p className="text-muted">
              {focusPath.subject && `${focusPath.subject} · `}
              Your highest-priority learning track right now.
            </p>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Overall Progress</span>
              <span className="fw-semibold">{focusPath.progress}%</span>
            </div>

            <div className="progress mb-4" style={{ height: '10px' }}>
              <div className="progress-bar" style={{ width: `${focusPath.progress}%` }} />
            </div>

            <button
              className="btn btn-primary"
              onClick={() => openPath(focusPath)}
            >
              Start Learning
            </button>

          </div>
        </div>
      )}

      {/* All paths — one card per unique assessment */}
      <div className="mb-4">
        <h2 className="fw-bold">Recommended for You</h2>
        <p className="text-muted">All your active learning tracks.</p>
      </div>

      <div className="row g-4">

        {paths.map((lp) => (

          <div className="col-12 col-md-6 col-lg-4" key={lp.id}>

            <div className="card recommendation-card h-100">
              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h4 className="fw-bold mb-0">{lp.assessment}</h4>
                  <span className={`badge text-bg-${priorityBadgeColour(lp.priority)}`}>
                    {lp.priority} priority
                  </span>
                </div>

                <p className="text-muted">
                  {lp.subject && `${lp.subject} · `}
                  {lp.items.length} concept{lp.items.length !== 1 ? 's' : ''} to review
                </p>

                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-muted">Progress</span>
                  <span className="small fw-semibold">{lp.progress}%</span>
                </div>

                <div className="progress mb-4" style={{ height: '8px' }}>
                  <div className="progress-bar" style={{ width: `${lp.progress}%` }} />
                </div>

                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => openPath(lp)}
                >
                  Start Learning
                </button>

              </div>
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default LearningPath
