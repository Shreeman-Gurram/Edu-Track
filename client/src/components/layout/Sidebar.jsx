import { NavLink } from 'react-router-dom'

function Sidebar() {

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
      name: 'Learning Path',
      path: '/learning-path',
    },
    {
      name: 'Progress',
      path: '/progress',
    },
  ]

  return (
    <aside className="sidebar bg-white border-end">

      <div className="p-3">

        <h6 className="text-uppercase text-muted mb-3">
          Learning
        </h6>

        <div className="d-flex flex-column gap-2">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {link.name}
            </NavLink>
          ))}

        </div>

      </div>

    </aside>
  )
}

export default Sidebar