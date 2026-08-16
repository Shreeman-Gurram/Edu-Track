import { useEffect, useState } from 'react'
import { getCurrentUser } from '../api/authApi'

function Profile() {
  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editing, setEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getCurrentUser()

      console.log('Profile API response:', response)

      if (response?.success && response?.user) {
        setUser(response.user)

        setFormData({
          name: response.user.name || '',
          email: response.user.email || '',
          grade: response.user.grade || ''
        })
      } else {
        setError('Unable to load profile information.')
      }
    } catch (err) {
      console.error('Profile API error:', err)

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to reach the server. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      grade: user.grade || ''
    })

    setEditing(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()

    /*
      IMPORTANT:

      We are not sending the data to the backend yet because
      the current backend does not expose an update-profile API.

      This function will be connected to the teammate's API
      once that endpoint is available.
    */

    console.log('Profile changes:', formData)

    setUser((previous) => ({
      ...previous,
      name: formData.name,
      email: formData.email,
      grade: formData.grade
    }))

    setEditing(false)
  }

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

                {!editing && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </button>
                )}

              </div>

              <form onSubmit={handleSave}>

                <div className="row g-4">

                  {/* Name */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      readOnly={!editing}
                    />

                  </div>

                  {/* Email */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!editing}
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
                      name="grade"
                      className="form-control"
                      value={formData.grade}
                      onChange={handleChange}
                      readOnly={!editing}
                    />

                  </div>

                </div>

                {editing && (
                  <div className="d-flex gap-2 mt-4">

                    <button
                      type="submit"
                      className="btn btn-success"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>

                  </div>
                )}

              </form>

              <div className="alert alert-info mt-4 mb-0">
                <strong>Profile editing:</strong>{' '}
                    You can update your profile information here.
                    Changes will be synchronized with your account when
                    the profile update service is connected.
             </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Profile