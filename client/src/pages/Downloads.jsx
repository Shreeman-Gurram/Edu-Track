import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPackage } from '../offline/packageStorage'

function Downloads() {
  const navigate = useNavigate()

  const [downloadedPackage, setDownloadedPackage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDownloadedPackage()
  }, [])

  const loadDownloadedPackage = async () => {
    try {
      setLoading(true)
      setError('')

      const pkg = await getPackage()

      console.log('Downloaded package:', pkg)

      setDownloadedPackage(pkg)
    } catch (err) {
      console.error('Failed to load downloaded package:', err)
      setError('Unable to load downloaded packages.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    if (!downloadedPackage) return

    navigate('/learning-content', {
      state: {
        package: downloadedPackage,
        offline: true,
      },
    })
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

  return (
    <div className="container-fluid py-4">

      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          Downloads
        </h2>

        <p className="text-muted mb-0">
          Access your downloaded learning packages offline.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!downloadedPackage && !error && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">

            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}
            >
              📥
            </div>

            <h5 className="fw-bold">
              No downloaded packages yet
            </h5>

            <p className="text-muted mb-0">
              Download a subject package to access it
              when you're offline.
            </p>

          </div>
        </div>
      )}

      {downloadedPackage && (
        <div className="row g-4">

          <div className="col-md-6 col-lg-4">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body p-4">

                <div className="d-flex align-items-start gap-3 mb-3">

                  <div
                    className="rounded-3 bg-primary-subtle d-flex align-items-center justify-content-center"
                    style={{
                      width: '52px',
                      height: '52px',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    📦
                  </div>

                  <div>
                    <h5 className="fw-bold mb-1">
                      {downloadedPackage.name ||
                        downloadedPackage.title ||
                        downloadedPackage.subjectName ||
                        'Learning Package'}
                    </h5>

                    <span className="badge bg-success-subtle text-success">
                      Available Offline
                    </span>
                  </div>

                </div>

                <p className="text-muted small">
                  This learning package is stored on your
                  device and can be accessed without an
                  internet connection.
                </p>

                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={handleOpen}
                >
                  Open Package
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default Downloads