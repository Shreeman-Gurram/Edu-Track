import { NavLink } from 'react-router-dom'

function Sidebar({ isOpen, onClose }) {

  const links = [
    {
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      name: 'Subjects',
      path: '/subjects',
    },
    {
      name: 'Assessments',
      path: '/assessment',
    },
    {
      name: 'Learning Path',
      path: '/learning-path',
    },
    {
      name: 'Progress',
      path: '/progress',
    },
    {
      name: 'Downloads',
      path: '/downloads',
    },
  ]

  return (
    <aside
      className={`sidebar bg-white border-end ${
        isOpen ? 'sidebar-mobile-open' : ''
      }`}
    >

      {/* Mobile close button */}
      <div className="sidebar-mobile-header">
        <h6 className="text-uppercase text-muted mb-0">
          Learning
        </h6>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Desktop heading */}
      <div className="sidebar-desktop-header">
        <h6 className="text-uppercase text-muted mb-3">
          Learning
        </h6>
      </div>

      <div className="sidebar-links">

        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {link.name}
          </NavLink>
        ))}

      </div>

    </aside>
  )
}

export default Sidebar
