import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/authApi'
import { replaceAuthSession } from '../services/apiClient'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '10',
  })

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })

    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all fields.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      const { token, user } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        grade: formData.grade,
      })
      replaceAuthSession(token, user)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* Left Section */}
        <div className="auth-intro">

          <div className="auth-brand">
            EduTrack
          </div>

          <h1>
            Start your learning journey.
          </h1>

          <p>
            Create your account and get a learning
            experience built around your needs.
          </p>

          <div className="auth-feature">
            <span>✓</span>
            <span>Personalized learning experience</span>
          </div>

          <div className="auth-feature">
            <span>✓</span>
            <span>Smart assessments</span>
          </div>

          <div className="auth-feature">
            <span>✓</span>
            <span>Track your progress</span>
          </div>

        </div>

        {/* Register Card */}
        <div className="auth-card">

          <div className="mb-4">

            <h2 className="fw-bold mb-2">
              Create your account
            </h2>

            <p className="text-muted mb-0">
              Start learning with EduTrack.
            </p>

          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-3">

              <label
                htmlFor="name"
                className="form-label fw-semibold"
              >
                Full name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                className="form-control auth-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

            {/* Email */}
            <div className="mb-3">

              <label
                htmlFor="email"
                className="form-label fw-semibold"
              >
                Email address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                className="form-control auth-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* Password */}
            <div className="mb-3">

              <label
                htmlFor="password"
                className="form-label fw-semibold"
              >
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                className="form-control auth-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />

            </div>

            {/* Confirm Password */}
            <div className="mb-4">

              <label
                htmlFor="confirmPassword"
                className="form-label fw-semibold"
              >
                Confirm password
              </label>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control auth-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

            </div>

            {/* Grade Selection */}
            <div className="mb-4">
              <label htmlFor="grade" className="form-label fw-semibold">
                Grade
              </label>
              <select
                id="grade"
                name="grade"
                className="form-select auth-input"
                value={formData.grade}
                onChange={handleChange}
              >
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
               
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account…' : 'Create Account'}
            </button>

          </form>

          <p className="text-center text-muted mt-4 mb-0">

            Already have an account?{' '}

            <Link
              to="/login"
              className="text-decoration-none fw-semibold"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Register
