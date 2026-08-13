import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Assessment() {
  const navigate = useNavigate()

  const questions = [
    {
      id: 1,
      question: 'What is 3/4 + 1/4?',
      options: ['1/2', '1', '3/8', '4/8'],
      answer: '1',
    },
    {
      id: 2,
      question: 'What is 5 × 6?',
      options: ['25', '30', '35', '40'],
      answer: '30',
    },
    {
      id: 3,
      question: 'What is the value of x if x + 5 = 12?',
      options: ['5', '6', '7', '8'],
      answer: '7',
    },
    {
      id: 4,
      question: 'How many sides does a triangle have?',
      options: ['2', '3', '4', '5'],
      answer: '3',
    },
    {
      id: 5,
      question: 'What is 10% of 100?',
      options: ['5', '10', '20', '50'],
      answer: '10',
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})

  const question = questions[currentQuestion]

  const handleAnswer = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: answer,
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    let score = 0

    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        score++
      }
    })

    navigate('/results', {
      state: {
        score,
        total: questions.length,
      },
    })
  }

  const progress =
    ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="assessment-page">

      {/* Header */}
      <div className="mb-4">

        <h1 className="page-title">
          Mathematics Assessment
        </h1>

        <p className="text-muted">
          Test your understanding of the topics you have learned.
        </p>

      </div>

      {/* Progress */}
      <div className="assessment-progress-section mb-4">

        <div className="d-flex justify-content-between mb-2">

          <span className="small text-muted">
            Question {currentQuestion + 1} of {questions.length}
          </span>

          <span className="small fw-semibold">
            {Math.round(progress)}%
          </span>

        </div>

        <div className="progress assessment-progress">

          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* Question Card */}
      <div className="card assessment-card">

        <div className="card-body p-4 p-md-5">

          <span className="badge text-bg-primary mb-3">
            Question {currentQuestion + 1}
          </span>

          <h2 className="assessment-question">
            {question.question}
          </h2>

          {/* Options */}
          <div className="assessment-options">

            {question.options.map((option) => (

              <button
                key={option}
                type="button"
                className={`assessment-option ${
                  selectedAnswers[question.id] === option
                    ? 'selected'
                    : ''
                }`}
                onClick={() => handleAnswer(option)}
              >
                <span className="option-circle">
                  {selectedAnswers[question.id] === option
                    ? '✓'
                    : ''}
                </span>

                <span>
                  {option}
                </span>

              </button>

            ))}

          </div>

          {/* Navigation */}
          <div className="d-flex justify-content-between mt-4">

            <button
              className="btn btn-outline-secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!selectedAnswers[question.id]}
              >
                Submit Assessment
              </button>

            ) : (

              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!selectedAnswers[question.id]}
              >
                Next →
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Assessment