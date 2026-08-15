import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../api/authApi'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getCurrentUser().then(({ user: currentUser }) => {
      if (active) setUser(currentUser)
    }).catch((requestError) => {
      if (active) setError(requestError.message)
    })
    return () => { active = false }
  }, [])

  if (error) return <div className="alert alert-danger">Unable to load your profile: {error}</div>
  if (!user) return <div className="text-muted">Loading your dashboard…</div>

  return <div>
    <div className="mb-4"><h1 className="dashboard-title">Welcome, {user.name}</h1><p className="text-muted">Continue your learning journey and improve your skills.</p></div>
    <div className="card dashboard-card mb-4"><div className="card-body p-4"><h4 className="mb-3">Your Profile</h4><div className="row g-3">
      <div className="col-12 col-md-6"><span className="text-muted d-block">Email</span><strong>{user.email}</strong></div>
      <div className="col-6 col-md-3"><span className="text-muted d-block">Grade</span><strong>{user.grade || 'Not set'}</strong></div>
      <div className="col-6 col-md-3"><span className="text-muted d-block">Role</span><strong className="text-capitalize">{user.role}</strong></div>
    </div></div></div>
    <div className="d-flex gap-2"><button className="btn btn-primary" onClick={() => navigate('/assessment')}>Take Assessment</button><button className="btn btn-outline-primary" onClick={() => navigate('/subjects')}>Explore Subjects</button></div>
  </div>
}

export default Dashboard
