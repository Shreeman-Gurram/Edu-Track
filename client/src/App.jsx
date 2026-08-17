import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import Topics from './pages/Topics'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import LearningPath from './pages/LearningPath'
import Progress from './pages/Progress'
import LearningContent from './pages/LearningContent'
import MainLayout from './components/layout/MainLayout'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Downloads from './pages/Downloads'
import ProtectedRoute from './components/auth/ProtectedRoute'

function privatePage(page) {
  return <ProtectedRoute><MainLayout>{page}</MainLayout></ProtectedRoute>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login does not use the main layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages using Navbar + Sidebar */}
        <Route
          path="/dashboard"
          element={privatePage(<Dashboard />)}
        />
        <Route
          path="/profile"
          element={privatePage(<Profile />)}
        />
        <Route
          path="/subjects"
          element={privatePage(<Subjects />)}
        />

        <Route
          path="/topics"
          element={privatePage(<Topics />)}
        />

        <Route
          path="/learning-content"
          element={<ProtectedRoute><LearningContent /></ProtectedRoute>}
        />

        <Route
          path="/assessment"
          element={privatePage(<Assessment />)}
        />

        <Route
          path="/results"
          element={privatePage(<Results />)}
        />

        <Route
          path="/learning-path"
          element={privatePage(<LearningPath />)}
        />

        <Route
          path="/progress"
          element={privatePage(<Progress />)}
        />
        <Route
          path="/downloads"
          element={privatePage(<Downloads />)}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
