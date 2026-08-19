import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/authApi'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await forgotPassword({ email: email.trim() })
      setSuccess(
        response.message ||
        'If an account exists for this email, a password reset link has been sent.'
      )
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong. Please try again.')
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
            Reset your password.
          </h1>

          <p>
            Enter the email address associated with your account
            and we'll send you a link to reset your password.
          </p>

          <div className="auth-feature">
            <span>🔒</span>
            <span>Secure password reset</span>
          </div>

          <div className="auth-feature">
            <span>📧</span>
            <span>Check your inbox for the reset link</span>
          </div>

          <div className="auth-feature">
            <span>⏱️</span>
            <span>Link expires in 30 minutes</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="auth-card">

          <div className="mb-4">
            <h2 className="fw-bold mb-2">
              Forgot Password
            </h2>

            <p className="text-muted mb-0">
              Enter your email to receive a reset link.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label
                  htmlFor="forgot-email"
                  className="form-label fw-semibold"
                >
                  Email address
                </label>

                <input
                  type="email"
                  id="forgot-email"
                  name="email"
                  className="form-control auth-input"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 auth-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>

            </form>
          )}

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="text-center text-muted mb-0">
            Remember your password?{' '}
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

export default ForgotPassword
