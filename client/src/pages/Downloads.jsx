import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPackages, deletePackage, clearPackages } from '../offline/packageStorage'
import { getPendingActivities } from '../offline/activityStorage'

function Downloads() {
  const navigate = useNavigate()

  const [downloadedPackages, setDownloadedPackages] = useState([])
  const [pendingActivities, setPendingActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDownloadedPackages()
  }, [])

  const loadDownloadedPackages = async () => {
    try {
      setLoading(true)
      setError('')

      const pkgs = await getPackages()
      const activities = await getPendingActivities().catch(() => [])

      console.log('Downloaded packages:', pkgs)
      console.log('Pending activities:', activities)

      setDownloadedPackages(pkgs)
      setPendingActivities(activities)
    } catch (err) {
      console.error('Failed to load downloaded packages:', err)
      setError('Unable to load downloaded packages.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (pkg) => {
    navigate('/learning-content', {
      state: {
        package: pkg,
        offline: true,
      },
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this downloaded learning package?')) {
      return
    }

    try {
      await deletePackage(id)
      setDownloadedPackages((prev) => prev.filter((pkg) => pkg.id !== id))
    } catch (err) {
      console.error('Failed to delete package:', err)
      setError('Unable to delete package from device.')
    }
  }

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL downloaded learning packages?')) {
      return
    }

    try {
      await clearPackages()
      setDownloadedPackages([])
    } catch (err) {
      console.error('Failed to clear all packages:', err)
      setError('Unable to clear all packages from device.')
    }
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

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            Downloads
          </h2>
          <p className="text-muted mb-0">
            Access your downloaded learning packages offline.
          </p>
        </div>
        {downloadedPackages && downloadedPackages.length > 0 && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleDeleteAll}
          >
            🗑️ Clear All Downloads
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {(!downloadedPackages || downloadedPackages.length === 0) && !error && (
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

            <button
              type="button"
              className="btn btn-primary mt-4"
              onClick={() => navigate('/learning-path')}
            >
              Go to Learning Path
            </button>

          </div>
        </div>
      )}

      {downloadedPackages && downloadedPackages.length > 0 && (
        <div className="row g-4">

          {downloadedPackages.map((pkg) => {
            const pkgPendingCount = pendingActivities.filter(
              (act) => act.assessmentId === pkg.assessmentId
            ).length

            return (
              <div className="col-md-6 col-lg-4" key={pkg.id}>

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
                          {pkg.name ||
                            pkg.title ||
                            pkg.subjectName ||
                            'Learning Package'}
                        </h5>

                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                          <span className="badge bg-success-subtle text-success">
                            Available Offline
                          </span>
                          {pkgPendingCount > 0 && (
                            <span className="badge bg-warning text-dark" title="Answers waiting to sync to server">
                              ⚠️ {pkgPendingCount} Pending Sync
                            </span>
                          )}
                          <span className="text-muted small">
                            {pkg.lessons?.length || 0} Concept{pkg.lessons?.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-muted small">
                            ·
                          </span>
                          <span className="text-muted small">
                            {pkg.questions?.length || 0} Question{pkg.questions?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                    </div>

                    <p className="text-muted small">
                      This learning package is stored on your
                      device and can be accessed without an
                      internet connection.
                    </p>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary flex-grow-1"
                        onClick={() => handleOpen(pkg)}
                      >
                        Open Package
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        title="Delete package"
                        onClick={() => handleDelete(pkg.id)}
                      >
                        🗑️
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            )
          })}

        </div>
      )}

    </div>
  )
}

export default Downloads
