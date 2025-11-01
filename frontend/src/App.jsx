import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import StudentLogin from './pages/StudentLogin'
import StudentRegister from './pages/StudentRegister'
import TeacherLogin from './pages/TeacherLogin'
import ParentLogin from './pages/ParentLogin'
import AccountRecovery from './pages/AccountRecovery'
import StudentDashboard from './pages/StudentDashboard'
import CareerResultPage from './pages/CareerResultPage'
import TeacherDashboard from './pages/TeacherDashboard'
import ParentDashboard from './pages/ParentDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/login/parent" element={<ParentLogin />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/recover" element={<AccountRecovery />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/career-pathway" element={<CareerResultPage />} />
        <Route 
          path="/teacher/dashboard" 
          element={
            <ProtectedRoute requiredRole="teacher" redirectTo="/login/teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/classes" 
          element={
            <ProtectedRoute requiredRole="teacher" redirectTo="/login/teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/assignments" 
          element={
            <ProtectedRoute requiredRole="teacher" redirectTo="/login/teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/students" 
          element={
            <ProtectedRoute requiredRole="teacher" redirectTo="/login/teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/analytics" 
          element={
            <ProtectedRoute requiredRole="teacher" redirectTo="/login/teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/announcements" 
          element={
            <ProtectedRoute requiredRole="teacher" redirectTo="/login/teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/settings" 
          element={
            <ProtectedRoute requiredRole="teacher" redirectTo="/login/teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/parent/dashboard" 
          element={
            <ProtectedRoute requiredRole="parent" redirectTo="/login/parent">
              <ParentDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
