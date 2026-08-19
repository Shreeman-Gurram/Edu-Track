import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/authApi'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in both password fields.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await resetPassword(token, {
        password: formData.password,
      })
      setSuccess(
        response.message || 'Password has been reset successfully.'
      )

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (requestError) {
      setError(requestError.message || 'Failed to reset password. The link may be expired.')
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
            Set a new password.
          </h1>

          <p>
            Choose a strong password to secure your account.
            You will be redirected to login after resetting.
          </p>

          <div className="auth-feature">
            <span>🔑</span>
            <span>Minimum 6 characters</span>
          </div>

          <div className="auth-feature">
            <span>✓</span>
            <span>Passwords must match</span>
          </div>

          <div className="auth-feature">
            <span>🔒</span>
            <span>Your password is securely encrypted</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="auth-card">

          <div className="mb-4">
            <h2 className="fw-bold mb-2">
              Reset Password
            </h2>

            <p className="text-muted mb-0">
              Enter your new password below.
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
              <div className="mt-2 small text-muted">
                Redirecting to login...
              </div>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>

              {/* New Password */}
              <div className="mb-3">
                <label
                  htmlFor="reset-password"
                  className="form-label fw-semibold"
                >
                  New Password
                </label>

                <input
                  type="password"
                  id="reset-password"
                  name="password"
                  className="form-control auth-input"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label
                  htmlFor="reset-confirm-password"
                  className="form-label fw-semibold"
                >
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="reset-confirm-password"
                  name="confirmPassword"
                  className="form-control auth-input"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 auth-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>

            </form>
          )}

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="text-center text-muted mb-0">
            Back to{' '}
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

export default ResetPassword
