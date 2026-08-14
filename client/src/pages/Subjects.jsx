import { useNavigate } from 'react-router-dom'

function Subjects() {

  const navigate = useNavigate()

  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      description: 'Numbers, algebra, geometry and more.',
      topics: 6,
      progress: 68,
    },
    {
      id: 2,
      name: 'Science',
      description: 'Explore physics, biology and chemistry.',
      topics: 8,
      progress: 52,
    },
    {
      id: 3,
      name: 'English',
      description: 'Improve grammar, vocabulary and writing.',
      topics: 5,
      progress: 75,
    },
    {
      id: 4,
      name: 'Computer Science',
      description: 'Learn programming and computer concepts.',
      topics: 10,
      progress: 40,
    },
  ]

  const handleExplore = (subject) => {
    navigate('/topics', {
      state: {
        subject: subject.name,
      },
    })
  }

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

      {/* Subject Cards */}
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

    </div>
  )
}

export default Subjects