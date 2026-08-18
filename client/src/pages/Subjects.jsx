import { useEffect, useState, useMemo } from 'react'
import { getSubjectCatalog } from '../api/assessmentApi'

/**
 * Read-only subject catalog page.
 * Shows: Subjects → Topics → Concepts (if available)
 * Data comes from the Question collection via GET /api/assessments/subjects
 */
function Subjects() {
  const [catalog, setCatalog]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [searchQuery, setSearchQuery]   = useState('')
  // Track which subjects/topics are expanded  { 'SubjectName': true, 'SubjectName||TopicName': true }
  const [expanded, setExpanded]         = useState({})

  useEffect(() => {
    let active = true
    getSubjectCatalog()
      .then(({ catalog: data }) => {
        if (!active) return
        setCatalog(data || [])
        // Auto-expand all subjects by default so data is immediately visible
        const initialExpanded = {}
        ;(data || []).forEach((s) => {
          initialExpanded[s.subject] = true
        })
        setExpanded(initialExpanded)
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  // Filter catalog based on search query (searches subject, topic, and concept names)
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return catalog

    return catalog
      .map((subjectEntry) => {
        // Check if subject name matches
        const subjectMatch = subjectEntry.subject.toLowerCase().includes(q)

        const filteredTopics = subjectEntry.topics
          .map((topicEntry) => {
            const topicMatch = topicEntry.topic.toLowerCase().includes(q)
            const filteredConcepts = topicEntry.concepts.filter((c) =>
              c.toLowerCase().includes(q)
            )

            if (topicMatch || filteredConcepts.length > 0 || subjectMatch) {
              return {
                ...topicEntry,
                concepts: subjectMatch || topicMatch ? topicEntry.concepts : filteredConcepts,
              }
            }
            return null
          })
          .filter(Boolean)

        if (subjectMatch || filteredTopics.length > 0) {
          return { ...subjectEntry, topics: subjectMatch ? subjectEntry.topics : filteredTopics }
        }
        return null
      })
      .filter(Boolean)
  }, [catalog, searchQuery])

  // When search is active, auto-expand everything so results are visible
  const effectiveExpanded = useMemo(() => {
    if (!searchQuery.trim()) return expanded
    const all = {}
    filteredCatalog.forEach((s) => {
      all[s.subject] = true
      s.topics.forEach((t) => {
        all[`${s.subject}||${t.topic}`] = true
      })
    })
    return all
  }, [searchQuery, filteredCatalog, expanded])

  const toggleSubject = (subjectName) => {
    setExpanded((prev) => ({ ...prev, [subjectName]: !prev[subjectName] }))
  }

  const toggleTopic = (subjectName, topicName) => {
    const key = `${subjectName}||${topicName}`
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const totalTopics   = catalog.reduce((sum, s) => sum + s.topics.length, 0)
  const totalConcepts = catalog.reduce(
    (sum, s) => sum + s.topics.reduce((ts, t) => ts + t.concepts.length, 0),
    0
  )

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted py-4">
        <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        Loading subjects…
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="page-title">Available Subjects</h1>
        <p className="text-muted mb-0">
          Browse all subjects, topics, and concepts available in the curriculum.
        </p>
      </div>

      {/* Stats bar */}
      {!error && catalog.length > 0 && (
        <div className="d-flex flex-wrap gap-3 mb-4">
          <span className="badge bg-primary-subtle text-primary fs-6 px-3 py-2">
            {catalog.length} {catalog.length === 1 ? 'Subject' : 'Subjects'}
          </span>
          <span className="badge bg-success-subtle text-success fs-6 px-3 py-2">
            {totalTopics} {totalTopics === 1 ? 'Topic' : 'Topics'}
          </span>
          {totalConcepts > 0 && (
            <span className="badge bg-info-subtle text-info fs-6 px-3 py-2">
              {totalConcepts} {totalConcepts === 1 ? 'Concept' : 'Concepts'}
            </span>
          )}
        </div>
      )}

      {/* Search bar */}
      {!error && catalog.length > 0 && (
        <div className="mb-4" style={{ maxWidth: '480px' }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              {/* Search icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="text-muted"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
              </svg>
            </span>
            <input
              type="search"
              className="form-control border-start-0 ps-0"
              placeholder="Search subjects, topics or concepts…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search subjects, topics and concepts"
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* No data state */}
      {!error && catalog.length === 0 && (
        <div className="alert alert-info">
          No subject data found. Please ensure questions have been seeded into the database.
        </div>
      )}

      {/* No search results */}
      {!error && catalog.length > 0 && filteredCatalog.length === 0 && (
        <div className="alert alert-warning">
          No subjects, topics, or concepts match &ldquo;{searchQuery}&rdquo;.
        </div>
      )}

      {/* Catalog tree */}
      <div className="d-flex flex-column gap-3">
        {filteredCatalog.map((subjectEntry) => {
          const isSubjectOpen = !!effectiveExpanded[subjectEntry.subject]

          return (
            <div
              key={subjectEntry.subject}
              className="card border shadow-sm"
              style={{ borderRadius: '12px', overflow: 'hidden' }}
            >
              {/* Subject header — clickable to expand/collapse */}
              <button
                type="button"
                className="d-flex align-items-center justify-content-between w-100 border-0 text-start px-4 py-3"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  cursor: 'pointer',
                }}
                onClick={() => toggleSubject(subjectEntry.subject)}
                aria-expanded={isSubjectOpen}
              >
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="d-flex align-items-center justify-content-center rounded-circle bg-white"
                    style={{ width: 36, height: 36, flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="#4f46e5"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.746c-.917-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                    </svg>
                  </span>

                  <div>
                    <h2 className="mb-0 fw-bold text-white" style={{ fontSize: '1.1rem' }}>
                      {subjectEntry.subject}
                    </h2>
                    <span className="text-white-50" style={{ fontSize: '0.8rem' }}>
                      {subjectEntry.topics.length}{' '}
                      {subjectEntry.topics.length === 1 ? 'topic' : 'topics'}
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  viewBox="0 0 16 16"
                  style={{
                    transform: isSubjectOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>

              {/* Topics list */}
              {isSubjectOpen && (
                <div className="p-3 d-flex flex-column gap-2">
                  {subjectEntry.topics.map((topicEntry) => {
                    const topicKey    = `${subjectEntry.subject}||${topicEntry.topic}`
                    const isTopicOpen = !!effectiveExpanded[topicKey]
                    const hasConcepts = topicEntry.concepts.length > 0

                    return (
                      <div
                        key={topicEntry.topic}
                        className="border rounded"
                        style={{ overflow: 'hidden', background: '#fafafa' }}
                      >
                        {/* Topic row */}
                        <button
                          type="button"
                          className="d-flex align-items-center justify-content-between w-100 border-0 bg-transparent text-start px-3 py-2"
                          style={{ cursor: hasConcepts ? 'pointer' : 'default' }}
                          onClick={() => hasConcepts && toggleTopic(subjectEntry.subject, topicEntry.topic)}
                          aria-expanded={hasConcepts ? isTopicOpen : undefined}
                          disabled={!hasConcepts}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {/* Topic bullet */}
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#4f46e5',
                                flexShrink: 0,
                                display: 'inline-block',
                              }}
                              aria-hidden="true"
                            />
                            <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>
                              {topicEntry.topic}
                            </span>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            {hasConcepts && (
                              <span
                                className="badge bg-primary-subtle text-primary"
                                style={{ fontSize: '0.75rem' }}
                              >
                                {topicEntry.concepts.length}{' '}
                                {topicEntry.concepts.length === 1 ? 'concept' : 'concepts'}
                              </span>
                            )}
                            {hasConcepts && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="#6c757d"
                                viewBox="0 0 16 16"
                                style={{
                                  transform: isTopicOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s ease',
                                }}
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                />
                              </svg>
                            )}
                          </div>
                        </button>

                        {/* Concepts list */}
                        {hasConcepts && isTopicOpen && (
                          <ul
                            className="mb-0 ps-0"
                            style={{ listStyle: 'none', borderTop: '1px solid #e9ecef' }}
                          >
                            {topicEntry.concepts.map((concept) => (
                              <li
                                key={concept}
                                className="d-flex align-items-center gap-2 px-4 py-2"
                                style={{
                                  fontSize: '0.875rem',
                                  color: '#495057',
                                  borderBottom: '1px solid #f1f3f5',
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  fill="#6f42c1"
                                  viewBox="0 0 16 16"
                                  aria-hidden="true"
                                  style={{ flexShrink: 0 }}
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                                </svg>
                                {concept}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Subjects
