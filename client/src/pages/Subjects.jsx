import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProgress } from '../api/progressApi'
import { getAssessments } from '../api/assessmentApi'

function Subjects() {

  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    let active = true
    getProgress()
      .then(async ({ progress: records }) => {
        if (!active) return

        // Collapse concept-level records into subject-level cards
        const subjectMap = new Map()
        records.forEach((r) => {
          const existing = subjectMap.get(r.subject)
          if (!existing) {
            subjectMap.set(r.subject, {
              id:          r.subject,
              name:        r.subject,
              description: `Improve your understanding of ${r.subject}.`,
              topicSet:    new Set([r.topic]),
              totalPct:    r.completionPercentage,
              count:       1,
            })
          } else {
            existing.topicSet.add(r.topic)
            existing.totalPct += r.completionPercentage
            existing.count    += 1
          }
        })

        const progressSubjects =
          [...subjectMap.values()].map((s) => ({
            id:          s.id,
            name:        s.name,
            description: s.description,
            topics:      s.topicSet.size,
            progress:    Math.round(s.totalPct / s.count),
          }))

        // Before the first assessment, there are no Progress documents yet.
        // The existing assessment endpoint is already filtered by the student's grade,
        // so it provides the available subject names without creating progress data.
        if (progressSubjects.length) {
          setSubjects(progressSubjects)
          return
        }

        const { assessments } = await getAssessments()
        if (!active) return

        const availableSubjects = new Map()
        for (const assessment of assessments || []) {
          const name = String(assessment.subject || '').trim()
          if (!name) continue

          const existing = availableSubjects.get(name) || {
            id: name,
            name,
            description: `Improve your understanding of ${name}.`,
            topicSet: new Set(),
            progress: 0,
          }

          if (assessment.topic) existing.topicSet.add(assessment.topic)
          availableSubjects.set(name, existing)
        }

        setSubjects(
          [...availableSubjects.values()].map((subject) => ({
            id: subject.id,
            name: subject.name,
            description: subject.description,
            topics: subject.topicSet.size,
            progress: 0,
          }))
        )
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const handleExplore = (subject) => {
    navigate('/topics', { state: { subject: subject.name } })
  }

  if (loading) return <div className="text-muted">Loading subjects…</div>

  return (
    <div>

      {/* Page Header */}
      <div className="mb-4">

        <h1 className="page-title">
          My Subjects
        </h1>

        <p className="text-muted">
          Choose a subject and continue your learning journey.
        </p>

      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!subjects.length
        ? (
          <div className="alert alert-info">
            No subjects yet.{' '}
            <button className="btn btn-link p-0" onClick={() => navigate('/assessment')}>
              Take an assessment
            </button>{' '}
            to populate your subjects.
          </div>
        )
        : (
          <div className="row g-4">

            {subjects.map((subject) => (

              <div
                className="col-12 col-md-6"
                key={subject.id}
              >

                <div className="card subject-card h-100">

                  <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-start mb-3">

                      <div>

                        <h4 className="subject-title">
                          {subject.name}
                        </h4>

                        <p className="text-muted mb-0">
                          {subject.description}
                        </p>

                      </div>

                      <span className="subject-topic-count">
                        {subject.topics} Topics
                      </span>

                    </div>

                    {/* Progress */}
                    <div className="d-flex justify-content-between mb-2">

                      <span className="small text-muted">
                        Progress
                      </span>

                      <span className="small fw-semibold">
                        {subject.progress}%
                      </span>

                    </div>

                    <div className="progress subject-progress mb-4">

                      <div
                        className="progress-bar"
                        style={{
                          width: `${subject.progress}%`,
                        }}
                      />

                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() => handleExplore(subject)}
                    >
                      Explore Subject
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

export default Subjects
