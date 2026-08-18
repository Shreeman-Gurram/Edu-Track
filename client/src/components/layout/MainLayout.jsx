import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-vh-100 bg-light app-layout">

      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="app-body">

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="main-content">
          {children}
        </main>

      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    </div>
  )
}

export default MainLayout