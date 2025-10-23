# Authentication Setup Guide

This document explains how to set up and use the authentication system for the HSC Power application.

## Overview

The authentication system is built with:
- **Backend**: Express.js with Supabase Auth
- **Frontend**: React with custom auth service
- **Database**: PostgreSQL (via Supabase) with role-based access control
- **Roles**: Student, Teacher (with potential for Parent and Admin)

## Backend Setup

### 1. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 2. API Endpoints

The following authentication endpoints are available:

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "classCode": "CLASS123"  // Required for students only
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1234567890
  }
}
```

#### POST `/api/auth/login`
Login an existing user.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "student"  // Must match user's role
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "roles": ["student"]
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1234567890
  }
}
```

#### POST `/api/auth/logout`
Logout a user (mainly handled client-side).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### 3. Authentication Middleware

Two middleware functions are available for protecting routes:

#### `verifyAuth`
Verifies the JWT token and attaches the user to the request object.

**Usage:**
```javascript
import { verifyAuth } from './middleware/auth.js';

router.get('/protected', verifyAuth, (req, res) => {
  // req.user contains the authenticated user
  res.json({ user: req.user });
});
```

#### `requireRole(allowedRoles)`
Checks if the authenticated user has one of the allowed roles.

**Usage:**
```javascript
import { verifyAuth, requireRole } from './middleware/auth.js';

// Only students can access this route
router.get('/student-only', verifyAuth, requireRole(['student']), (req, res) => {
  res.json({ message: 'Student access granted' });
});

// Both students and teachers can access this route
router.get('/student-or-teacher', verifyAuth, requireRole(['student', 'teacher']), (req, res) => {
  res.json({ message: 'Access granted' });
});
```

## Frontend Setup

### 1. Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Auth Service

The `authService` provides the following methods:

#### `login(email, password, role)`
Login a user.

```javascript
import authService from '../services/authService.js';

try {
  const data = await authService.login('student@example.com', 'password123', 'student');
  console.log('Logged in:', data.user);
  // Navigate to dashboard
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### `signup(userData)`
Register a new user.

```javascript
import authService from '../services/authService.js';

try {
  const data = await authService.signup({
    email: 'student@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'student',
    classCode: 'CLASS123'
  });
  console.log('Registered:', data.user);
  // Navigate to login
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

#### `logout()`
Logout the current user.

```javascript
import authService from '../services/authService.js';

await authService.logout();
// Navigate to home/login page
```

#### `getCurrentUser()`
Get the current logged-in user.

```javascript
import authService from '../services/authService.js';

const user = authService.getCurrentUser();
if (user) {
  console.log('Current user:', user);
}
```

#### `isAuthenticated()`
Check if a user is authenticated.

```javascript
import authService from '../services/authService.js';

if (authService.isAuthenticated()) {
  console.log('User is logged in');
}
```

#### `hasRole(role)`
Check if the current user has a specific role.

```javascript
import authService from '../services/authService.js';

if (authService.hasRole('student')) {
  console.log('User is a student');
}
```

#### `authenticatedRequest(endpoint, options)`
Make an authenticated API request.

```javascript
import authService from '../services/authService.js';

try {
  const data = await authService.authenticatedRequest('/profile', {
    method: 'GET'
  });
  console.log('Profile:', data);
} catch (error) {
  console.error('Request failed:', error.message);
}
```

### 3. Protected Routes Example

Create a protected route component:

```javascript
import { Navigate } from 'react-router-dom';
import authService from '../services/authService.js';

function ProtectedRoute({ children, requiredRole }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login/student" />;
  }

  if (requiredRole && !authService.hasRole(requiredRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

// Usage in App.jsx
<Route 
  path="/student/dashboard" 
  element={
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  } 
/>
```

## Database Schema

### Tables

#### `profiles`
Stores user profile information.
- `id` (uuid) - User ID (matches auth.users.id)
- `first_name` (text)
- `last_name` (text)
- `email` (text)
- Other profile fields...

#### `profile_roles`
Maps users to their roles (many-to-many).
- `profile_id` (uuid) - References profiles.id
- `role` (role_type) - Enum: 'student', 'teacher', 'parent', 'admin'

#### `classes`
Stores class information.
- `id` (uuid)
- `class_code` (text) - Unique code for class enrollment
- Other class fields...

#### `enrollments`
Maps students to classes.
- `student_id` (uuid) - References profiles.id
- `class_id` (uuid) - References classes.id

## Role-Based Access Flow

### Student Registration
1. Student fills registration form with class code
2. Backend creates user in Supabase Auth
3. Backend creates profile in `profiles` table
4. Backend assigns 'student' role in `profile_roles` table
5. Backend looks up class by `class_code`
6. Backend enrolls student in class via `enrollments` table
7. User can now login

### Teacher Login
1. Teacher must be created by admin (via admin panel or direct DB access)
2. Teacher logs in with credentials
3. Backend verifies role matches 'teacher'
4. Session token is returned
5. Teacher can access teacher-specific routes

### Student Login
1. Student logs in with credentials
2. Backend verifies role matches 'student'
3. Session token is returned
4. Student can access student-specific routes

## Security Considerations

1. **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
2. **Password Requirements**: Minimum 8 characters (enforced in frontend and Supabase)
3. **Role Verification**: Backend always verifies roles, never trust frontend
4. **Class Code**: Required for student registration to prevent unauthorized access
5. **Row Level Security**: Enabled in Supabase for all tables

## Testing the Authentication

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Student Registration
1. Navigate to `/register/student`
2. Fill in the form with a valid class code
3. Submit and verify user is created
4. Check that you're redirected to login page

### 4. Test Student Login
1. Navigate to `/login/student`
2. Enter credentials from registration
3. Submit and verify you're redirected to dashboard
4. Check localStorage for tokens

### 5. Test Teacher Login
1. Create a teacher account in the database:
   ```sql
   -- Insert into auth.users (via Supabase dashboard)
   -- Then insert into profiles and profile_roles
   INSERT INTO profile_roles (profile_id, role)
   VALUES ('teacher_uuid', 'teacher');
   ```
2. Navigate to `/login/teacher`
3. Enter teacher credentials
4. Verify login works

## Troubleshooting

### "Invalid class code" error
- Ensure the class exists in the `classes` table with a matching `class_code`
- Create a test class:
  ```sql
  INSERT INTO classes (class_code, name, year, subject)
  VALUES ('TEST123', 'Test Class', 2024, 'Mathematics');
  ```

### "Failed to assign user role" error
- Check that the `profile_roles` table exists
- Verify Row Level Security policies allow inserts

### CORS errors
- Ensure backend CORS is configured to allow frontend origin
- Check that `VITE_API_BASE_URL` is set correctly

### Token expired
- Tokens expire based on Supabase settings
- Implement token refresh logic if needed

## Next Steps

1. **Implement Token Refresh**: Auto-refresh tokens before expiry
2. **Add Password Reset**: Implement forgot password flow
3. **Email Verification**: Require email verification after signup
4. **Admin Panel**: Create admin interface for managing users
5. **Audit Logging**: Log authentication events for security

## Support

For issues or questions, refer to:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Express.js Documentation](https://expressjs.com/)
- [React Router Documentation](https://reactrouter.com/)

