import { useEffect, useState } from 'react'
import { getCurrentUser } from '../api/authApi'

function Profile() {
  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProfile() {
    try {
      setLoading(true)
      setError('')

      const response = await getCurrentUser()

      if (response?.success && response?.user) {
        setUser(response.user)
      } else {
        setError('Unable to load profile information.')
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to reach the server. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      loadProfile()
    })
  }, [])

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary">
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">
          No profile information available.
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          Student Profile
        </h2>

        <p className="text-muted mb-0">
          View and manage your account information
        </p>
      </div>

      <div className="row g-4">

        {/* Profile summary */}
        <div className="col-lg-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body text-center p-4">

              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: '90px',
                  height: '90px',
                  fontSize: '34px',
                  fontWeight: '600'
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <h4 className="fw-bold mb-1">
                {user.name}
              </h4>

              <p className="text-muted mb-3">
                {user.role}
              </p>

              <span className="badge bg-primary-subtle text-primary px-3 py-2">
                Active Student
              </span>

            </div>

          </div>

        </div>

        {/* Information */}
        <div className="col-lg-8">

          <div className="card border-0 shadow-sm">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h5 className="fw-bold mb-0">
                  Personal Information
                </h5>

              </div>

              <div>

                <div className="row g-4">

                  {/* Name */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={user.name || ''}
                      readOnly
                    />

                  </div>

                  {/* Email */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      value={user.email || ''}
                      readOnly
                    />

                  </div>

                  {/* Role */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Role
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={user.role || ''}
                      readOnly
                    />

                  </div>

                  {/* Grade */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Grade / Year
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={user.grade || 'Not set'}
                      readOnly
                    />

                  </div>

                </div>

              </div>

              <div className="alert alert-info mt-4 mb-0">
                Your information is loaded securely from your authenticated account.
             </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Profile
