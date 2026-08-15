import { useLocation, useNavigate } from 'react-router-dom'

function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const result = state?.result

  if (!result) {
    return <div className="alert alert-info">No assessment result is available. <button className="btn btn-link p-0" onClick={() => navigate('/assessment')}>Take an assessment</button></div>
  }

  const topicEntries = Object.entries(result.topicPerformance || {})
  return <div className="results-page">
    <div className="text-center mb-4"><div className="results-icon">✓</div><h1 className="page-title">Assessment Completed!</h1><p className="text-muted">Here is the result returned by your assessment.</p></div>
    <div className="card results-card mb-4"><div className="card-body text-center p-4 p-md-5"><p className="text-muted mb-2">Your Score</p><h2 className="results-score">{result.percentage}%</h2><p className="results-correct">{result.score} out of {result.totalQuestions} answers correct</p></div></div>
    <div className="card results-card mb-4"><div className="card-body p-4"><h4 className="mb-3">Topic Performance</h4>{topicEntries.length ? topicEntries.map(([topic, performance]) => <div className="performance-row" key={topic}><span>{topic} <small className="text-muted">({performance.correct}/{performance.total})</small></span><strong>{performance.percentage}%</strong></div>) : <p className="text-muted mb-0">No topic performance data was returned.</p>}</div></div>
    <div className="card results-card mb-4"><div className="card-body p-4"><h4 className="mb-2">Weak Concepts</h4>{result.weakConcepts?.length ? <ul className="mb-0">{result.weakConcepts.map((concept) => <li key={concept}>{concept}</li>)}</ul> : <p className="text-muted mb-0">No weak concepts were identified.</p>}</div></div>
    <div className="text-center"><button className="btn btn-outline-secondary me-2" onClick={() => navigate('/assessment')}>Take Another Assessment</button><button className="btn btn-outline-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button></div>
  </div>
}

export default Results
