# Protected Route Component Usage

## Overview
The `ProtectedRoute` component is a wrapper that protects routes from unauthorized access based on authentication status and user roles.

## Basic Usage

### 1. Import the Component
```jsx
import ProtectedRoute from './components/ProtectedRoute'
```

### 2. Protect a Route (Requires Login Only)
```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### 3. Protect a Route (Requires Specific Role)
```jsx
// Student-only route
<Route 
  path="/student/dashboard" 
  element={
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  } 
/>

// Teacher-only route
<Route 
  path="/teacher/dashboard" 
  element={
    <ProtectedRoute requiredRole="teacher">
      <TeacherDashboard />
    </ProtectedRoute>
  } 
/>
```

### 4. Custom Redirect Path
```jsx
<Route 
  path="/student/grades" 
  element={
    <ProtectedRoute requiredRole="student" redirectTo="/login/student">
      <GradesView />
    </ProtectedRoute>
  } 
/>
```

## Full Example in App.jsx

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Page imports
import Landing from './pages/Landing'
import StudentLogin from './pages/StudentLogin'
import TeacherLogin from './pages/TeacherLogin'
import StudentRegister from './pages/StudentRegister'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/register/student" element={<StudentRegister />} />

        {/* Protected routes - Student only */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute requiredRole="student" redirectTo="/login/student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected routes - Teacher only */}
        <Route 
          path="/teacher/dashboard" 
          element={
            <ProtectedRoute requiredRole="teacher" redirectTo="/login/teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected routes - Any authenticated user */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

## How It Works

1. **Authentication Check**
   - First checks if user has a valid session token
   - If not authenticated, redirects to login page

2. **Role Check** (if requiredRole is specified)
   - Checks if user has the required role
   - If user doesn't have the role, redirects to their role-specific dashboard

3. **Access Granted**
   - If all checks pass, renders the child components

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Components to render if authorized |
| requiredRole | string | No | - | Required role ('student', 'teacher', etc.) |
| redirectTo | string | No | '/login/student' | Path to redirect to if unauthorized |

## Advanced Usage

### Multiple Allowed Roles
If you need to allow multiple roles, you can modify the component or create role-specific wrappers:

```jsx
// In ProtectedRoute.jsx
function ProtectedRoute({ children, allowedRoles, redirectTo = '/login/student' }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to={redirectTo} replace />
  }

  if (allowedRoles && !allowedRoles.some(role => authService.hasRole(role))) {
    return <Navigate to="/" replace />
  }

  return children
}

// Usage
<ProtectedRoute allowedRoles={['student', 'teacher']}>
  <SharedComponent />
</ProtectedRoute>
```

### Redirect with Return URL
The component already saves the attempted location in `state.from`, which can be used to redirect users back after login:

```jsx
// In Login component
import { useLocation, useNavigate } from 'react-router-dom'

function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleLogin = async () => {
    await authService.login(email, password, role)
    navigate(from, { replace: true })
  }
}
```

## Best Practices

1. **Always use ProtectedRoute for sensitive pages**
   - Dashboards
   - User profiles
   - Data views
   - Settings pages

2. **Keep public routes unprotected**
   - Landing page
   - Login/Register pages
   - About/Help pages

3. **Use role-specific redirects**
   - Student routes should redirect to student login
   - Teacher routes should redirect to teacher login

4. **Test with different user roles**
   - Verify students can't access teacher routes
   - Verify teachers can't access student-only features

## Troubleshooting

### User keeps getting redirected to login
- Check if tokens are properly stored in localStorage
- Verify token hasn't expired
- Check browser console for errors

### User with correct role still can't access route
- Verify role is stored correctly in localStorage
- Check that `authService.hasRole()` returns true
- Ensure user object has the `role` property

### Infinite redirect loop
- Make sure login page is not protected
- Verify redirectTo path is not the current path
- Check that authenticated users aren't redirected to login

