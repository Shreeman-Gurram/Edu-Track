import { useNavigate } from 'react-router-dom'

const topicProgress = [
  {
    id: 1,
    name: 'Fractions',
    subject: 'Mathematics',
    progress: 75,
    status: 'In Progress',
  },
  {
    id: 2,
    name: 'Algebra',
    subject: 'Mathematics',
    progress: 60,
    status: 'In Progress',
  },
  {
    id: 3,
    name: 'Geometry',
    subject: 'Mathematics',
    progress: 90,
    status: 'Almost Complete',
  },
  {
    id: 4,
    name: 'Statistics',
    subject: 'Mathematics',
    progress: 40,
    status: 'Needs Practice',
  },
]

function Progress() {
  const navigate = useNavigate()

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
                78%
              </h2>

              <small className="text-success">
                ↑ 8% from your last assessment
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
                Topics Completed
              </p>

              <h2 className="fw-bold mb-0">
                8 / 12
              </h2>

              <small className="text-muted">
                4 topics remaining
              </small>

            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="col-12 col-md-4">
          <div className="card progress-summary-card h-100">
            <div className="card-body p-4">

              <div className="progress-icon mb-3">
                🎯
              </div>

              <p className="text-muted mb-1">
                Lessons Completed
              </p>

              <h2 className="fw-bold mb-0">
                24 / 30
              </h2>

              <small className="text-muted">
                6 lessons remaining
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

          {topicProgress.map((topic) => (

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
                    Mathematics Assessment
                  </small>
                </div>

                <strong>
                  78%
                </strong>
              </div>

              <div className="activity-item">
                <div>
                  <h6 className="fw-semibold mb-1">
                    Lessons Completed
                  </h6>

                  <small className="text-muted">
                    This learning period
                  </small>
                </div>

                <strong>
                  24
                </strong>
              </div>

              <div className="activity-item">
                <div>
                  <h6 className="fw-semibold mb-1">
                    Current Streak
                  </h6>

                  <small className="text-muted">
                    Keep learning every day!
                  </small>
                </div>

                <strong>
                  🔥 5 days
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