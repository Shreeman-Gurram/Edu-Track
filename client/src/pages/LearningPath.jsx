import { useNavigate } from 'react-router-dom'

function LearningPath() {
  const navigate = useNavigate()

  const recommendations = [
    {
      id: 1,
      name: 'Fractions',
      description:
        'Practice adding, subtracting and comparing fractions.',
      progress: 45,
      status: 'Needs more practice',
      action: 'Start Learning',
    },
    {
      id: 2,
      name: 'Algebra',
      description:
        'Strengthen your understanding of equations and variables.',
      progress: 70,
      status: 'Keep improving',
      action: 'Continue Learning',
    },
    {
      id: 3,
      name: 'Geometry',
      description:
        'Review shapes, angles and measurements.',
      progress: 85,
      status: 'Strong area',
      action: 'Review',
    },
  ]

  return (
    <div className="container py-4">

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="fw-bold">
          Your Learning Path
        </h1>

        <p className="text-muted">
          A learning plan based on your current performance.
        </p>
      </div>

      {/* Focus Area */}
      <div className="card focus-card mb-5">
        <div className="card-body p-4">

          <span className="badge text-bg-primary mb-3">
            🎯 Focus Area
          </span>

          <h2 className="fw-bold">
            Fractions
          </h2>

          <p className="text-muted">
            Your assessment shows that this topic needs
            more practice.
          </p>

          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">
              Current Progress
            </span>

            <span className="fw-semibold">
              45%
            </span>
          </div>

          <div
            className="progress mb-4"
            style={{ height: '10px' }}
          >
            <div
              className="progress-bar"
              style={{ width: '45%' }}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/topics')}
          >
            Start Learning
          </button>

        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-4">
        <h2 className="fw-bold">
          Recommended for You
        </h2>

        <p className="text-muted">
          Focus on these topics to improve your performance.
        </p>
      </div>

      <div className="row g-4">

        {recommendations.map((topic) => (

          <div
            className="col-12 col-md-6 col-lg-4"
            key={topic.id}
          >

            <div className="card recommendation-card h-100">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-start mb-3">

                  <h4 className="fw-bold mb-0">
                    {topic.name}
                  </h4>

                  <span className="badge bg-light text-dark">
                    {topic.status}
                  </span>

                </div>

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

                <div
                  className="progress mb-4"
                  style={{ height: '8px' }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${topic.progress}%`,
                    }}
                  />
                </div>

                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate('/topics')}
                >
                  {topic.action}
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