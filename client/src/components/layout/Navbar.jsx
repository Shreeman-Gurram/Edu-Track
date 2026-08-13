function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid px-4">

        <a
          className="navbar-brand fw-bold"
          href="/dashboard"
        >
          Edu-Track
        </a>

        <div className="ms-auto">
          <span className="text-muted">
            Welcome, Student
          </span>
        </div>

      </div>
    </nav>
  )
}

export default Navbar