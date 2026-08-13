import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setError('')

    // Temporary frontend navigation.
    // Backend authentication will be connected later.
    navigate('/dashboard')
  }

  return (
    <div className="login-page">

      <div className="login-container">

        {/* Brand */}
        <div className="text-center mb-4">

          <div className="brand-logo">
            E
          </div>

          <h1 className="brand-title">
            Edu-Track
          </h1>

          <p className="text-muted">
            Your personalized learning journey
          </p>

        </div>

        {/* Login Card */}
        <div className="card login-card border-0">

          <div className="card-body p-4 p-md-5">

            <h2 className="login-heading">
              Welcome back 👋
            </h2>

            <p className="text-muted mb-4">
              Sign in to continue learning.
            </p>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-3">

                <label
                  htmlFor="email"
                  className="form-label fw-semibold"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>

              {/* Error */}
              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mt-2"
              >
                Login
              </button>

            </form>

            <div className="text-center mt-4">

              <span className="text-muted">
                Don't have an account?
              </span>{' '}

              <button
                type="button"
                className="btn btn-link p-0"
              >
                Sign up
              </button>

            </div>

          </div>

        </div>

        <p className="text-center text-muted small mt-4">
          Learn smarter. Learn your way.
        </p>

      </div>

    </div>
  )
}

export default Login