import Navbar from './Navbar'
import Sidebar from './Sidebar'

function MainLayout({ children }) {
  return (
    <div className="min-vh-100 bg-light">

      <Navbar />

      <div className="d-flex">

        <Sidebar />

        <main className="flex-grow-1 p-4">
          {children}
        </main>

      </div>

    </div>
  )
}

export default MainLayout