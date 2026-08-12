import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import Topics from './pages/Topics'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import LearningPath from './pages/LearningPath'
import Progress from './pages/Progress'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/subjects" element={<Subjects />} />

        <Route path="/topics" element={<Topics />} />

        <Route path="/assessment" element={<Assessment />} />

        <Route path="/results" element={<Results />} />

        <Route
          path="/learning-path"
          element={<LearningPath />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App