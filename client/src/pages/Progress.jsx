import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProgress } from '../api/progressApi'

function masteryStatus(level) {
  if (level === 'weak')           return 'Needs Practice'
  if (level === 'needs_practice') return 'In Progress'
  return 'Strong'
}

function Progress() {
  const navigate = useNavigate()
  const [summary, setSummary]           = useState(null)
  const [topicProgress, setTopicProgress] = useState([])
  const [latestAssessment, setLatestAssessment] = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  useEffect(() => {
    let active = true
    getProgress()
      .then(({ summary: s, progress: records }) => {
        if (!active) return
        setSummary(s)

        // Collapse concept-level records into topic-level for display
        const topicMap = new Map()
        records.forEach((r) => {
          const key = `${r.subject}::${r.topic}`
          const existing = topicMap.get(key)
          if (!existing) {
            topicMap.set(key, {
              id:       key,
              name:     r.topic,
              subject:  r.subject,
              progress: r.completionPercentage,
              status:   masteryStatus(r.masteryLevel),
              count:    1,
              total:    r.completionPercentage,
            })
          } else {
            existing.count += 1
            existing.total += r.completionPercentage
            existing.progress = Math.round(existing.total / existing.count)
            existing.status   = masteryStatus(r.masteryLevel)
          }
        })
        setTopicProgress([...topicMap.values()])

        // Latest assessment = most recently updated record
        if (records.length) {
          const latest = [...records].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
          setLatestAssessment({ subject: latest.subject, topic: latest.topic })
        }
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (loading) return <div className="text-muted container py-4">Loading your progress…</div>

  const overallPct   = summary ? Math.round(summary.overallPercentage) : 0
  const strongCount  = summary ? summary.strongTopics  : 0
  const weakCount    = summary ? summary.weakTopics    : 0
  const totalTopics  = summary ? summary.totalTopics   : 0

  return (
    <div className="container py-4 progress-page">

      {/* Back */}
      <button
        className="btn btn-link text-decoration-none px-0 mb-4"
        onClick={() => navigate('/dashboard')}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary mb-2">
          Your Learning
        </span>

        <h1 className="fw-bold mb-2">
          My Progress
        </h1>

        <p className="text-muted">
          Track your learning journey and see how you're improving.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-5">

        {/* Overall Score */}
        <div className="col-12 col-md-4">
          <div className="card progress-summary-card h-100">
            <div className="card-body p-4">

              <div className="progress-icon mb-3">
                📊
              </div>

              <p className="text-muted mb-1">
                Overall Score
              </p>

              <h2 className="fw-bold mb-0">
                {overallPct}%
              </h2>

              <small className="text-success">
                Across all your assessments
              </small>

            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="col-12 col-md-4">
          <div className="card progress-summary-card h-100">
            <div className="card-body p-4">

              <div className="progress-icon mb-3">
                📚
              </div>

              <p className="text-muted mb-1">
                Strong Topics
              </p>

              <h2 className="fw-bold mb-0">
                {strongCount} / {totalTopics}
              </h2>

              <small className="text-muted">
                {weakCount} topic{weakCount !== 1 ? 's' : ''} need{weakCount === 1 ? 's' : ''} practice
              </small>

            </div>
          </div>
        </div>

        {/* Weak topics */}
        <div className="col-12 col-md-4">
          <div className="card progress-summary-card h-100">
            <div className="card-body p-4">

              <div className="progress-icon mb-3">
                🎯
              </div>

              <p className="text-muted mb-1">
                Topics Tracked
              </p>

              <h2 className="fw-bold mb-0">
                {totalTopics}
              </h2>

              <small className="text-muted">
                From your assessment results
              </small>

            </div>
          </div>
        </div>

      </div>

      {/* Topic Progress */}
      <div className="card border-0 shadow-sm mb-5">

        <div className="card-body p-4 p-md-5">

          <div className="mb-4">
            <h2 className="fw-bold mb-2">
              Topic Progress
            </h2>

            <p className="text-muted mb-0">
              See how you're performing across different topics.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {!topicProgress.length
            ? <p className="text-muted mb-0">No progress recorded yet. Take an assessment to get started.</p>
            : topicProgress.map((topic) => (

            <div
              key={topic.id}
              className="topic-progress-item"
            >

              <div className="d-flex justify-content-between align-items-start mb-2">

                <div>
                  <h5 className="fw-semibold mb-1">
                    {topic.name}
                  </h5>

                  <small className="text-muted">
                    {topic.subject}
                  </small>
                </div>

                <span className="fw-semibold">
                  {topic.progress}%
                </span>

              </div>

              <div
                className="progress mb-2"
                style={{ height: '9px' }}
              >
                <div
                  className="progress-bar"
                  style={{
                    width: `${topic.progress}%`,
                  }}
                />
              </div>

              <small className="text-muted">
                {topic.status}
              </small>

            </div>

          ))}

        </div>

      </div>

      {/* Learning Activity */}
      <div className="row g-4 mb-5">

        <div className="col-12 col-lg-8">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4 p-md-5">

              <h2 className="fw-bold mb-4">
                Learning Activity
              </h2>

              <div className="activity-item">
                <div>
                  <h6 className="fw-semibold mb-1">
                    Latest Assessment
                  </h6>

                  <small className="text-muted">
                    {latestAssessment
                      ? `${latestAssessment.subject} — ${latestAssessment.topic}`
                      : 'No assessments yet'}
                  </small>
                </div>

                <strong>
                  {overallPct}%
                </strong>
              </div>

              <div className="activity-item">
                <div>
                  <h6 className="fw-semibold mb-1">
                    Topics Practised
                  </h6>

                  <small className="text-muted">
                    Across all your assessments
                  </small>
                </div>

                <strong>
                  {totalTopics}
                </strong>
              </div>

              <div className="activity-item">
                <div>
                  <h6 className="fw-semibold mb-1">
                    Strong Topics
                  </h6>

                  <small className="text-muted">
                    Topics you have mastered
                  </small>
                </div>

                <strong>
                  ✅ {strongCount}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* Continue Learning */}
        <div className="col-12 col-lg-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4 d-flex flex-column">

              <span className="badge bg-primary-subtle text-primary align-self-start mb-3">
                Keep Going
              </span>

              <h3 className="fw-bold">
                Continue Learning
              </h3>

              <p className="text-muted flex-grow-1">
                Keep working on your recommended topics
                to improve your overall performance.
              </p>

              <button
                className="btn btn-primary w-100"
                onClick={() => navigate('/learning-path')}
              >
                View Learning Path
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Progress