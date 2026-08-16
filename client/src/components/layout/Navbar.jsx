import { useEffect, useState } from 'react'
import { getPendingActivities } from '../../offline/activityStorage'
import { syncPendingActivities } from '../../offline/syncOffline'

function Navbar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingCount, setPendingCount] = useState(0)
  const [syncStatus, setSyncStatus] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)

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
          setSyncStatus(`Successfully synced ${result.syncedCount} activities!`)
        } else {
          setSyncStatus('')
        }
        if (result.packageOutdated) {
          setSyncStatus('Your offline learning package is outdated. Connect to the internet to download the latest version.')
        }
      } else {
        setSyncStatus(result.message || 'Sync failed.')
      }
      updatePendingCount()
    } catch (err) {
      setSyncStatus('Sync failed: network error.')
    } finally {
      setIsSyncing(false)
    }
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

    // Initial check
    updatePendingCount()

    // Regular polling for changes in IndexedDB (every 3 seconds)
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
        <a className="navbar-brand fw-bold text-primary fs-4" href="/dashboard">
          Edu-Track
        </a>

        <div className="ms-auto d-flex align-items-center gap-3">
          {/* Sync Status Feedback message */}
          {syncStatus && (
            <span className="small text-muted border-end pe-3 text-end" style={{ maxWidth: '300px', display: 'inline-block' }}>
              {syncStatus}
            </span>
          )}

          {/* Network Status indicator */}
          <div className="d-flex align-items-center gap-2">
            <span
              className={`rounded-circle d-inline-block`}
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: isOnline ? '#198754' : '#dc3545',
                boxShadow: isOnline ? '0 0 8px #198754' : '0 0 8px #dc3545'
              }}
            />
            <span className="fw-semibold small">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Pending Sync Count & Sync Button */}
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
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
              )}
            </div>
          )}

          <div className="border-start ps-3">
            <span className="text-muted small">Welcome, Student</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar