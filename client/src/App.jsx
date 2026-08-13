import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import Topics from './pages/Topics'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import LearningPath from './pages/LearningPath'
import Progress from './pages/Progress'

import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login does not use the main layout */}
        <Route path="/" element={<Login />} />

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

      </Routes>
    </BrowserRouter>
  )
}

export default App