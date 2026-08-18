import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getProgress } from '../api/progressApi'

function masteryStatus(level) {
  if (level === 'weak')           return 'Needs Practice'
  if (level === 'needs_practice') return 'In Progress'
  return 'Strong'
}

function Topics() {

  const location = useLocation()
  const navigate = useNavigate()

  const subject = location.state?.subject || ''

  const [topics, setTopics]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    let active = true
    getProgress()
      .then(({ progress: records }) => {
        if (!active) return

        // Filter records for this subject, collapse by topic
        const topicMap = new Map()
        records
          .filter((r) => !subject || r.subject === subject)
          .forEach((r) => {
            const existing = topicMap.get(r.topic)
            if (!existing) {
              topicMap.set(r.topic, {
                id:          r.topic,
                name:        r.topic,
                description: `Practice and improve your understanding of ${r.topic}.`,
                totalPct:    r.completionPercentage,
                count:       1,
                masteryLevel: r.masteryLevel,
              })
            } else {
              existing.totalPct    += r.completionPercentage
              existing.count       += 1
              existing.masteryLevel = r.masteryLevel
            }
          })

        setTopics(
          [...topicMap.values()].map((t) => ({
            id:          t.id,
            name:        t.name,
            description: t.description,
            progress:    Math.round(t.totalPct / t.count),
            status:      masteryStatus(t.masteryLevel),
          }))
        )
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [subject])

  const handleStartLearning = (topic) => {
    navigate('/learning-path', {
      state: { subject, topic: topic.name },
    })
  }

  if (loading) return <div className="text-muted">Loading topics…</div>

  return (
    <div>

      {/* Header */}
      <div className="mb-4">

        <button
          className="btn btn-link p-0 mb-3"
          onClick={() => navigate('/subjects')}
        >
          ← Back to Subjects
        </button>

        <h1 className="page-title">
          {subject || 'Topics'}
        </h1>

        <p className="text-muted">
          Choose a topic and continue learning.
        </p>

      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!topics.length
        ? (
          <div className="alert alert-info">
            No topics found for {subject} yet.{' '}
            <button className="btn btn-link p-0" onClick={() => navigate('/assessment')}>
              Take an assessment
            </button>{' '}
            to populate your topics.
          </div>
        )
        : (
          <div className="row g-4">

            {topics.map((topic) => (

              <div
                className="col-12 col-md-6"
                key={topic.id}
              >

                <div className="card topic-card h-100">

                  <div className="card-body p-4">

                    <h4 className="topic-title">
                      {topic.name}
                    </h4>

                    <p className="text-muted">
                      {topic.description}
                    </p>

                    <div className="d-flex justify-content-between mb-2">

                      <span className="small text-muted">
                        Progress
                      </span>

                      <span className="small fw-semibold">
                        {topic.progress}%
                      </span>

                    </div>

                    <div className="progress topic-progress mb-4">

                      <div
                        className="progress-bar"
                        style={{
                          width: `${topic.progress}%`,
                        }}
                      />

                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() => handleStartLearning(topic)}
                    >
                      {topic.progress > 0
                        ? 'Continue Learning'
                        : 'Start Learning'}
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )
      }

    </div>
  )
}

export default Topics
