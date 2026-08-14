import { useLocation, useNavigate } from 'react-router-dom'

function Topics() {

  const location = useLocation()
  const navigate = useNavigate()

  const subject = location.state?.subject || 'Mathematics'

  const topics = [
    {
      id: 1,
      name: 'Algebra',
      description: 'Learn equations, expressions and variables.',
      progress: 70,
    },
    {
      id: 2,
      name: 'Fractions',
      description: 'Understand and solve fraction problems.',
      progress: 45,
    },
    {
      id: 3,
      name: 'Geometry',
      description: 'Learn shapes, angles and measurements.',
      progress: 52,
    },
    {
      id: 4,
      name: 'Numbers',
      description: 'Explore number systems and operations.',
      progress: 80,
    },
  ]

  const handleStartLearning = (topic) => {
    navigate('/learning-path', {
      state: {
        subject,
        topic: topic.name,
      },
    })
  }

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
          {subject}
        </h1>

        <p className="text-muted">
          Choose a topic and continue learning.
        </p>

      </div>

      {/* Topics */}
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

    </div>
  )
}

export default Topics