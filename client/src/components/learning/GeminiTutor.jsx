import { useEffect, useState } from 'react'
import { getAdaptiveTutor } from '../../api/aiApi'

function GeminiTutor({ concept, topic, subject, score, priority, trend }) {
  const [tutorData, setTutorData] = useState(null)
  const [noPerformance, setNoPerformance] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTutorContent = async () => {
    if (!concept) return

    setLoading(true)
    setError('')
    setTutorData(null)
    setNoPerformance(false)

    try {
      const response = await getAdaptiveTutor({
        concept,
        topic: topic || '',
        subject: subject || ''
      })

      if (response.noPerformance) {
        setNoPerformance(true)
      }

      setTutorData(response.data)
    } catch (err) {
      console.error('Gemini tutor error:', err)
      setError('AI tutor is temporarily unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTutorContent()
  }, [concept, topic, subject])

  return (
    <div className="card border-0 shadow-sm mb-4 gemini-tutor-card">
      <div className="card-body p-4 p-md-5">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
          <div>
            <span className="badge bg-info-subtle text-info mb-2">
              🤖 AI Tutor
            </span>
            <h3 className="fw-bold mb-1">
              AI Tutor — Personalized for You
            </h3>
          </div>

          {!loading && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={fetchTutorContent}
              title="Generate new content"
            >
              ↻ Refresh
            </button>
          )}
        </div>

        {/* Score info (only when performance exists) */}
        {!noPerformance && !loading && !error && (
          <div className="d-flex gap-3 mb-4 flex-wrap">
            <span className="text-muted small">
              Your current score: <strong>{score}%</strong>
            </span>

            {priority && (
              <span className="text-muted small">
                Priority: <strong className="text-capitalize">{priority}</strong>
              </span>
            )}

            {trend && (
              <span className="text-muted small">
                Trend: <strong className="text-capitalize">{(trend || '').replace(/_/g, ' ')}</strong>
              </span>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary mb-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mb-0">
              Generating personalized content...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="alert alert-warning mb-0">
            {error}
          </div>
        )}

        {/* No performance data message */}
        {noPerformance && !loading && !error && (
          <div className="alert alert-info mb-3">
            Complete an assessment to get personalized AI learning recommendations.
          </div>
        )}

        {/* Tutor content */}
        {tutorData && !loading && !error && (
          <div className="gemini-tutor-content">

            {/* Explanation */}
            {tutorData.explanation && (
              <div className="mb-4">
                <h5 className="fw-semibold mb-2">
                  📘 Brief Explanation
                </h5>
                <p className="mb-0" style={{ lineHeight: '1.7' }}>
                  {tutorData.explanation}
                </p>
              </div>
            )}

            {/* Example */}
            {tutorData.example && (
              <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#f0f7ff' }}>
                <h5 className="fw-semibold mb-2">
                  💡 Example
                </h5>
                <div className="mb-2">
                  <strong>Problem:</strong>{' '}
                  <span>{tutorData.example.question}</span>
                </div>
                <div>
                  <strong>Solution:</strong>{' '}
                  <span style={{ whiteSpace: 'pre-wrap' }}>{tutorData.example.solution}</span>
                </div>
              </div>
            )}

            {/* Practice Questions */}
            {tutorData.practice && tutorData.practice.length > 0 && (
              <div>
                <h5 className="fw-semibold mb-3">
                  ✏️ Try These
                </h5>

                {tutorData.practice.map((item, index) => (
                  <div
                    key={index}
                    className="mb-3 p-3 border rounded-3"
                  >
                    <div className="fw-semibold mb-2">
                      Question {index + 1}:
                    </div>
                    <p className="mb-2">
                      {item.question}
                    </p>

                    <div className="p-2 rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
                      <div className="fw-semibold text-success small mb-1">
                        Answer:
                      </div>
                      <p className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>
                        {item.answer}
                      </p>
                      {item.explanation && (
                        <p className="text-muted small mb-0">
                          {item.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GeminiTutor
