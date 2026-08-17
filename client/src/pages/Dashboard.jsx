import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../api/authApi'
import { getScholarships } from '../api/scholarshipApi'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [scholarships, setScholarships] = useState([])
  const [scholarshipsLoading, setScholarshipsLoading] = useState(true)
  const [scholarshipsError, setScholarshipsError] = useState(false)

  useEffect(() => {
    let active = true
    getCurrentUser().then(({ user: currentUser }) => {
      if (active) setUser(currentUser)
    }).catch((requestError) => {
      if (active) setError(requestError.message)
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true

    getScholarships()
      .then(({ scholarships: available }) => {
        if (active) setScholarships(available || [])
      })
      .catch(() => {
        if (active) setScholarshipsError(true)
      })
      .finally(() => {
        if (active) setScholarshipsLoading(false)
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
    <div className="d-flex flex-wrap gap-2"><button className="btn btn-primary" onClick={() => navigate('/assessment')}>Take Assessment</button><button className="btn btn-outline-primary" onClick={() => navigate('/subjects')}>Explore Subjects</button></div>
    <div className="card dashboard-card mt-4">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div><h4 className="mb-1">Scholarships &amp; Opportunities</h4><p className="text-muted mb-0">Opportunities currently available for Grade {user.grade || 'your class'}.</p></div>
          <span className="badge bg-primary-subtle text-primary">Grade {user.grade || 'not set'}</span>
        </div>
        {scholarshipsLoading && <p className="text-muted mb-0">Loading opportunities...</p>}
        {!scholarshipsLoading && scholarshipsError && <div className="alert alert-warning mb-0">Unable to load opportunities.</div>}
        {!scholarshipsLoading && !scholarshipsError && !scholarships.length && <p className="text-muted mb-0">No scholarships currently available for your grade.</p>}
        {!scholarshipsLoading && !scholarshipsError && scholarships.length > 0 && <div className="row g-3">{scholarships.slice(0, 3).map((scholarship) => <div className="col-12 col-lg-4" key={scholarship._id}><div className="border rounded p-3 h-100"><h6 className="fw-bold">{scholarship.title}</h6><p className="small text-muted mb-2">{scholarship.description}</p><p className="small mb-0"><strong>Deadline:</strong> {new Date(scholarship.applicationDeadline).toLocaleDateString()}</p>{scholarship.applicationLink && <a className="small d-inline-block mt-2" href={scholarship.applicationLink} target="_blank" rel="noreferrer">Learn more</a>}</div></div>)}</div>}
      </div>
    </div>
  </div>
}

export default Dashboard
