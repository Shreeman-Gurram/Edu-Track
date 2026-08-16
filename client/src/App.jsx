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
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
          <MainLayout>
            <Profile />
          </MainLayout>
          }
        />
        <Route
          path="/subjects"
          element={
            <MainLayout>
              <Subjects />
            </MainLayout>
          }
        />

        <Route
          path="/topics"
          element={
            <MainLayout>
              <Topics />
            </MainLayout>
          }
        />

        <Route
          path="/learning-content"
          element={<LearningContent />}
        />

        <Route
          path="/assessment"
          element={
            <MainLayout>
              <Assessment />
            </MainLayout>
          }
        />

        <Route
          path="/results"
          element={
            <MainLayout>
              <Results />
            </MainLayout>
          }
        />

        <Route
          path="/learning-path"
          element={
            <MainLayout>
              <LearningPath />
            </MainLayout>
          }
        />

        <Route
          path="/progress"
          element={
            <MainLayout>
              <Progress />
            </MainLayout>
          }
        />
        <Route
          path="/downloads"
          element={
          <MainLayout>
            <Downloads />
          </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App