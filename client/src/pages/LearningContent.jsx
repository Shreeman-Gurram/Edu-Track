import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const lessons = [
  {
    id: 1,
    title: 'What are Fractions?',
    content:
      'A fraction represents a part of a whole. It is written using a numerator and a denominator.',
    keyPoints: [
      'The numerator is the number above the line.',
      'The denominator is the number below the line.',
      'Fractions can represent parts of a whole.',
    ],
    question: 'What is 1/2 + 1/2?',
    options: ['1', '2', '1/4', '3/4'],
    answer: '1',
  },
  {
    id: 2,
    title: 'Adding Fractions',
    content:
      'When fractions have the same denominator, add their numerators and keep the denominator the same.',
    keyPoints: [
      'Keep the denominator the same.',
      'Add the numerators.',
      'Simplify the answer when necessary.',
    ],
    question: 'What is 1/4 + 1/4?',
    options: ['1/2', '1/4', '2', '3/4'],
    answer: '1/2',
  },
  {
    id: 3,
    title: 'Comparing Fractions',
    content:
      'Fractions can be compared to determine which represents a larger or smaller part of a whole.',
    keyPoints: [
      'Compare fractions using common denominators.',
      'A larger numerator means a larger fraction when denominators are equal.',
      'Use visual models when needed.',
    ],
    question: 'Which fraction is larger?',
    options: ['1/4', '3/4', '1/8', '1/10'],
    answer: '3/4',
  },
]

function LearningContent() {
  const navigate = useNavigate()

  const [currentLesson, setCurrentLesson] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)

  const lesson = lessons[currentLesson]

  const progress =
    ((currentLesson + 1) / lessons.length) * 100

  const handleAnswer = (option) => {
    setSelectedAnswer(option)
    setShowResult(false)
  }

  const checkAnswer = () => {
    if (!selectedAnswer) return
    setShowResult(true)
  }

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
      setSelectedAnswer('')
      setShowResult(false)
    }
  }

  const previousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
      setSelectedAnswer('')
      setShowResult(false)
    }
  }

  return (
    <div className="container py-4 learning-content-page">

      {/* Back Button */}
      <button
        className="btn btn-link text-decoration-none px-0 mb-4"
        onClick={() => navigate('/learning-path')}
      >
        ← Back to Learning Path
      </button>

      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary mb-2">
          Mathematics
        </span>

        <h1 className="fw-bold mb-2">
          {lesson.title}
        </h1>

        <p className="text-muted mb-0">
          Fractions • Lesson {currentLesson + 1} of {lessons.length}
        </p>
      </div>

      {/* Progress */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">

          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">
              Lesson Progress
            </span>

            <span className="text-muted">
              {Math.round(progress)}%
            </span>
          </div>

          <div
            className="progress"
            style={{ height: '10px' }}
          >
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>
      </div>

      {/* Lesson Content */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">

          <h2 className="fw-bold mb-3">
            {lesson.title}
          </h2>

          <p className="fs-5 text-muted">
            {lesson.content}
          </p>

        </div>
      </div>

      {/* Key Points */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">

          <h3 className="fw-bold mb-4">
            Key Points
          </h3>

          <div>
            {lesson.keyPoints.map((point, index) => (
              <div
                key={index}
                className="learning-point mb-3"
              >
                <span className="point-icon">
                  ✓
                </span>

                <span>
                  {point}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Practice Question */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">

          <div className="mb-4">
            <span className="badge bg-primary mb-2">
              Practice
            </span>

            <h3 className="fw-bold">
              {lesson.question}
            </h3>
          </div>

          {/* Options */}
          <div className="mb-4">

            {lesson.options.map((option) => (

              <button
                key={option}
                type="button"
                className={`lesson-option ${
                  selectedAnswer === option
                    ? 'selected'
                    : ''
                }`}
                onClick={() => handleAnswer(option)}
              >
                <span className="option-radio">
                  {selectedAnswer === option
                    ? '●'
                    : '○'}
                </span>

                <span>{option}</span>
              </button>

            ))}

          </div>

          {/* Check Answer */}
          <button
            className="btn btn-primary"
            disabled={!selectedAnswer}
            onClick={checkAnswer}
          >
            Check Answer
          </button>

          {/* Result */}
          {showResult && (
            <div className="mt-4">

              {selectedAnswer === lesson.answer ? (
                <div className="alert alert-success mb-0">
                  <strong>Correct! 🎉</strong>
                  <br />
                  Great job. You're ready to continue.
                </div>
              ) : (
                <div className="alert alert-danger mb-0">
                  <strong>Not quite.</strong>
                  <br />
                  Review the concept and try again.
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Navigation */}
      <div className="d-flex justify-content-between align-items-center gap-3">

        <button
          className="btn btn-outline-secondary"
          disabled={currentLesson === 0}
          onClick={previousLesson}
        >
          ← Previous
        </button>

        <span className="text-muted small">
          {currentLesson + 1} / {lessons.length}
        </span>

        <button
          className="btn btn-primary"
          disabled={currentLesson === lessons.length - 1}
          onClick={nextLesson}
        >
          Next →
        </button>

      </div>

    </div>
  )
}

export default LearningContent