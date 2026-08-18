import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPendingActivities } from '../../offline/activityStorage'
import { syncPendingActivities } from '../../offline/syncOffline'
import { clearAuthToken } from '../../services/apiClient'
import { getCurrentUser } from '../../api/authApi'

function Navbar({ onMenuClick }) {
  const navigate = useNavigate()

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingCount, setPendingCount] = useState(0)
  const [syncStatus, setSyncStatus] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [user, setUser] = useState(null)

  const updatePendingCount = () => {
    getPendingActivities()
      .then((activities) => {
        setPendingCount(activities.length)
      })
      .catch((err) => {
        console.error('Failed to get pending activities count:', err)
      })
  }

  const handleSync = async () => {
    if (!navigator.onLine) {
      setSyncStatus('Cannot sync while offline.')
      return
    }

    setIsSyncing(true)
    setSyncStatus('Syncing activities...')

    try {
      const result = await syncPendingActivities()

      if (result.success) {
        if (result.syncedCount > 0) {
          setSyncStatus(
            `Successfully synced ${result.syncedCount} activities!`
          )
        } else {
          setSyncStatus('')
        }

        if (result.packageOutdated) {
          setSyncStatus(
            'Your offline learning package is outdated.'
          )
        }
      } else {
        setSyncStatus(result.message || 'Sync failed.')
      }

      updatePendingCount()
    } catch {
      setSyncStatus('Sync failed: network error.')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    setUser(null)
    setShowProfileMenu(false)
    navigate('/login')
  }

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      handleSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
      setSyncStatus('')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('activity-updated', updatePendingCount)

    getCurrentUser()
      .then(({ user: currentUser }) => {
        setUser(currentUser)
      })
      .catch(() => {
        clearAuthToken()
        navigate('/login', { replace: true })
      })

    updatePendingCount()

    const interval = setInterval(updatePendingCount, 3000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener(
        'activity-updated',
        updatePendingCount
      )
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <nav className="navbar bg-white border-bottom shadow-sm app-navbar">

        <div className="container-fluid app-navbar-inner">

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-menu-button btn btn-outline-primary"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            ☰
          </button>

          {/* Logo */}
          <Link
            className="navbar-brand fw-bold text-primary fs-4"
            to="/dashboard"
          >
            Edu-Track
          </Link>

          <div className="navbar-actions">

            {/* Sync status message */}
            {syncStatus && (
              <span className="sync-message small text-muted">
                {syncStatus}
              </span>
            )}

            {/* Network Status */}
            <div className="network-status d-flex align-items-center gap-2">
              <span
                className="rounded-circle d-inline-block"
                style={{
                  width: '10px',
                  height: '10px',
                  flexShrink: 0,
                  backgroundColor: isOnline
                    ? '#198754'
                    : '#dc3545',
                  boxShadow: isOnline
                    ? '0 0 8px #198754'
                    : '0 0 8px #dc3545'
                }}
              />

              <span className="fw-semibold small">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Sync */}
            {isOnline && (
              <div className="sync-container d-flex align-items-center gap-2">

                {pendingCount > 0 ? (
                  <span className="badge bg-warning text-dark small">
                    Pending: {pendingCount}
                  </span>
                ) : (
                  <span className="text-muted small sync-text">
                    Synced
                  </span>
                )}

                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="btn btn-sm btn-outline-primary sync-button"
                  title="Sync offline activities manually"
                >
                  {isSyncing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <span>🔄</span>
                      <span className="sync-now-text">
                        Sync Now
                      </span>
                    </>
                  )}
                </button>

              </div>
            )}

            {/* Profile */}
            <div className="profile-container position-relative">

              <button
                type="button"
                className="btn btn-light profile-button d-flex align-items-center gap-2"
                onClick={() =>
                  setShowProfileMenu(!showProfileMenu)
                }
              >

                <span className="text-muted small profile-name">
                  Welcome, {user?.name || 'Student'}
                </span>

                <span>▼</span>

              </button>

              {showProfileMenu && (
                <div
                  className="position-absolute bg-white border rounded shadow-sm profile-dropdown"
                >

                  <Link
                    to="/profile"
                    className="dropdown-item px-3 py-2"
                    onClick={() =>
                      setShowProfileMenu(false)
                    }
                  >
                    👤 Profile
                  </Link>

                  <button
                    type="button"
                    className="dropdown-item px-3 py-2 text-danger"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>
      </nav>

      {!isOnline && (
        <div className="bg-warning text-dark text-center py-2 fw-semibold small offline-banner">
          📶 You are currently offline. Accessing downloaded packages.
        </div>
      )}
    </>
  )
}

export default Navbar