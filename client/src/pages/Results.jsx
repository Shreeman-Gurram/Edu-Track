import { useLocation, useNavigate } from 'react-router-dom'

function Results() {
  const location = useLocation()
  const navigate = useNavigate()

  const score = location.state?.score ?? 0
  const total = location.state?.total ?? 5

  const percentage = Math.round((score / total) * 100)

  let message = ''

  if (percentage >= 80) {
    message = 'Excellent work! You have a strong understanding of this assessment.'
  } else if (percentage >= 60) {
    message = 'Good job! You understand most of the concepts, but there is still room to improve.'
  } else {
    message = 'Keep practicing! Let us identify the topics where you need more support.'
  }

  return (
    <div className="results-page">

      {/* Header */}
      <div className="text-center mb-4">

        <div className="results-icon">
          ✓
        </div>

        <h1 className="page-title">
          Assessment Completed!
        </h1>

        <p className="text-muted">
          Here is a summary of your performance.
        </p>

      </div>

      {/* Score Card */}
      <div className="card results-card mb-4">

        <div className="card-body text-center p-4 p-md-5">

          <p className="text-muted mb-2">
            Your Score
          </p>

          <h2 className="results-score">
            {percentage}%
          </h2>

          <p className="results-correct">
            {score} out of {total} answers correct
          </p>

          <p className="text-muted results-message">
            {message}
          </p>

        </div>

      </div>

      {/* Performance */}
      <div className="card results-card mb-4">

        <div className="card-body p-4">

          <h4 className="mb-3">
            Your Performance
          </h4>

          <div className="performance-row">

            <span>
              Correct Answers
            </span>

            <strong>
              {score}
            </strong>

          </div>

          <div className="performance-row">

            <span>
              Incorrect Answers
            </span>

            <strong>
              {total - score}
            </strong>

          </div>

          <div className="performance-row">

            <span>
              Total Questions
            </span>

            <strong>
              {total}
            </strong>

          </div>

        </div>

      </div>

      {/* Temporary Recommendation */}
      <div className="card results-card recommendation-card mb-4">

        <div className="card-body p-4">

          <h4 className="mb-2">
            Recommended Next Step
          </h4>

          <p className="text-muted mb-3">
            Based on your current score, you can continue learning
            and strengthen the topics where you need more practice.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/learning-path')}
          >
            View Learning Path
          </button>

        </div>

      </div>

      {/* Actions */}
      <div className="text-center">

        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => navigate('/subjects')}
        >
          Back to Subjects
        </button>

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>

      </div>

    </div>
  )
}

export default Results