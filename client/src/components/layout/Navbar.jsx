import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPendingActivities } from '../../offline/activityStorage'
import { syncPendingActivities } from '../../offline/syncOffline'
import { clearAuthToken } from '../../services/apiClient'
import { getCurrentUser } from '../../api/authApi'

function Navbar() {
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
            'Your offline learning package is outdated. Connect to the internet to download the latest version.'
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

    getCurrentUser().then(({ user: currentUser }) => {
      setUser(currentUser)
    }).catch(() => {
      clearAuthToken()
      navigate('/login', { replace: true })
    })

    updatePendingCount()

    const interval = setInterval(updatePendingCount, 3000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('activity-updated', updatePendingCount)
      clearInterval(interval)
    }
  }, [])

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm py-2">
      <div className="container-fluid px-4">

        {/* Logo */}
        <Link
          className="navbar-brand fw-bold text-primary fs-4"
          to="/dashboard"
        >
          Edu-Track
        </Link>

        <div className="ms-auto d-flex align-items-center gap-3">

          {/* Sync Status */}
          {syncStatus && (
            <span
              className="small text-muted border-end pe-3 text-end"
              style={{
                maxWidth: '300px',
                display: 'inline-block'
              }}
            >
              {syncStatus}
            </span>
          )}

          {/* Network Status */}
          <div className="d-flex align-items-center gap-2">

            <span
              className="rounded-circle d-inline-block"
              style={{
                width: '10px',
                height: '10px',
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

          {/* Pending Sync */}
          {pendingCount > 0 && (
            <div className="d-flex align-items-center gap-2 border-start ps-3">

              <span className="badge bg-warning text-dark small">
                Pending sync: {pendingCount}
              </span>

              {isOnline && (
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="btn btn-sm btn-outline-primary py-0 px-2"
                  style={{ fontSize: '12px' }}
                >
                  {isSyncing
                    ? 'Syncing...'
                    : 'Sync Now'}
                </button>
              )}

            </div>
          )}

          {/* Profile Menu */}
          <div
            className="border-start ps-3 position-relative"
          >

            <button
              type="button"
              className="btn btn-light d-flex align-items-center gap-2"
              onClick={() =>
                setShowProfileMenu(!showProfileMenu)
              }
            >

              <span className="text-muted small">
                Welcome, {user?.name || 'Student'}
              </span>

              <span>
                ▼
              </span>

            </button>

            {showProfileMenu && (
              <div
                className="position-absolute bg-white border rounded shadow-sm"
                style={{
                  right: 0,
                  top: 'calc(100% + 8px)',
                  minWidth: '180px',
                  zIndex: 1000
                }}
              >

                {/* Profile */}
                <Link
                  to="/profile"
                  className="dropdown-item px-3 py-2"
                  onClick={() =>
                    setShowProfileMenu(false)
                  }
                >
                  👤 Profile
                </Link>

                {/* Logout */}
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
  )
}

export default Navbar
