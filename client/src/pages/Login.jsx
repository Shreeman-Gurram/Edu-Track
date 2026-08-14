import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })

    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.')
      return
    }

    // Temporary frontend authentication
    localStorage.setItem(
      'edutrackUser',
      JSON.stringify({
        email: formData.email,
      })
    )

    navigate('/dashboard')
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
            Learn at your own pace.
          </h1>

          <p>
            Continue your personalized learning journey
            and improve your skills one step at a time.
          </p>

          <div className="auth-feature">
            <span>✓</span>
            <span>Personalized learning paths</span>
          </div>

          <div className="auth-feature">
            <span>✓</span>
            <span>Track your learning progress</span>
          </div>

          <div className="auth-feature">
            <span>✓</span>
            <span>Practice and improve your skills</span>
          </div>

        </div>

        {/* Login Card */}
        <div className="auth-card">

          <div className="mb-4">
            <h2 className="fw-bold mb-2">
              Welcome back
            </h2>

            <p className="text-muted mb-0">
              Sign in to continue learning.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

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
            <div className="mb-4">

              <div className="d-flex justify-content-between">

                <label
                  htmlFor="password"
                  className="form-label fw-semibold"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                >
                  Forgot password?
                </button>

              </div>

              <input
                type="password"
                id="password"
                name="password"
                className="form-control auth-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 auth-button"
            >
              Sign In
            </button>

          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="text-center text-muted mb-0">

            Don't have an account?{' '}

            <Link
              to="/register"
              className="text-decoration-none fw-semibold"
            >
              Create account
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Login