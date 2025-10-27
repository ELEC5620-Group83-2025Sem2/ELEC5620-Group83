import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import StudentLogin from './pages/StudentLogin'
import StudentRegister from './pages/StudentRegister'
import TeacherLogin from './pages/TeacherLogin'
import AccountRecovery from './pages/AccountRecovery'
import StudentDashboard from './pages/StudentDashboard'
import CareerDetailPage from './pages/CareerDetailPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/recover" element={<AccountRecovery />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/career-details" element={<CareerDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
