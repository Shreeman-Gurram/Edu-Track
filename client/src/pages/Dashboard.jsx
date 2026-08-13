function Dashboard() {
  const stats = [
    {
      title: 'Overall Progress',
      value: '68%',
      description: 'Learning completed',
    },
    {
      title: 'Assessments',
      value: '8',
      description: 'Completed',
    },
    {
      title: 'Topics',
      value: '12',
      description: 'Completed',
    },
  ]

  const weakAreas = [
    {
      subject: 'Fractions',
      score: 45,
    },
    {
      subject: 'Geometry',
      score: 52,
    },
    {
      subject: 'Algebra',
      score: 61,
    },
  ]

  const activities = [
    'Completed Algebra Assessment',
    'Practiced Fractions',
    'Completed Geometry Quiz',
  ]

  return (
    <div>

      {/* Header */}
      <div className="mb-4">

        <h1 className="dashboard-title">
          Good morning, Student 👋
        </h1>

        <p className="text-muted">
          Continue your learning journey and improve your skills.
        </p>

      </div>

      {/* Statistics */}
      <div className="row g-3 mb-4">

        {stats.map((stat) => (
          <div
            className="col-12 col-md-4"
            key={stat.title}
          >
            <div className="card dashboard-card h-100">

              <div className="card-body">

                <p className="text-muted mb-2">
                  {stat.title}
                </p>

                <h2 className="stat-value">
                  {stat.value}
                </h2>

                <small className="text-muted">
                  {stat.description}
                </small>

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Continue Learning */}
      <div className="card dashboard-card mb-4">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <h4 className="mb-1">
                Continue Learning
              </h4>

              <p className="text-muted mb-0">
                Pick up where you left off.
              </p>
            </div>

            <span className="badge text-bg-primary">
              In Progress
            </span>

          </div>

          <div className="learning-item">

            <div className="d-flex justify-content-between mb-2">

              <strong>
                Fractions
              </strong>

              <span className="text-muted">
                68%
              </span>

            </div>

            <div className="progress mb-3">
              <div
                className="progress-bar"
                style={{ width: '68%' }}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={() => window.location.href = '/learning-path'}
            >       
            Continue Learning
            </button>

          </div>

        </div>

      </div>

      {/* Weak Areas */}
      <div className="mb-4">

        <div className="mb-3">

          <h4 className="mb-1">
            Needs Improvement
          </h4>

          <p className="text-muted mb-0">
            Topics where you can improve your score.
          </p>

        </div>

        <div className="row g-3">

          {weakAreas.map((area) => (
            <div
              className="col-12 col-md-4"
              key={area.subject}
            >

              <div className="card dashboard-card h-100">

                <div className="card-body">

                  <div className="d-flex justify-content-between mb-3">

                    <strong>
                      {area.subject}
                    </strong>

                    <span className="text-muted">
                      {area.score}%
                    </span>

                  </div>

                  <div className="progress">

                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${area.score}%`,
                      }}
                    />

                  </div>

                  <button className="btn btn-outline-primary btn-sm mt-3">
                    Practice
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Recent Activity */}
      <div className="card dashboard-card">

        <div className="card-body">

          <h4 className="mb-3">
            Recent Activity
          </h4>

          <div className="activity-list">

            {activities.map((activity, index) => (
              <div
                className="activity-item"
                key={index}
              >

                <span className="activity-check">
                  ✓
                </span>

                <span>
                  {activity}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard