# Authentication Pages Documentation

This document describes the authentication pages created for HSC Power.

## Pages Created

### 1. Landing Page (`/`)
- **File**: `src/pages/Landing.jsx`
- **Features**:
  - Modern, professional landing page with hero section
  - Navigation with quick access to student/teacher login
  - Feature showcase highlighting platform capabilities
  - "How It Works" section explaining the student registration process
  - Call-to-action sections
  - Comprehensive footer with links

### 2. Student Login (`/login/student`)
- **File**: `src/pages/StudentLogin.jsx`
- **Features**:
  - Email and password authentication
  - "Remember me" checkbox
  - Link to password recovery
  - Link to student registration
  - Switch to teacher login option

### 3. Student Registration (`/register/student`)
- **File**: `src/pages/StudentRegister.jsx`
- **Features**:
  - Full registration form with first name, last name, email
  - **Class code requirement** - students must enter a class code provided by their teacher
  - Password creation with confirmation
  - Automatic class assignment based on class code
  - Form validation (password matching, minimum length, class code validation)
  - Link to login page

### 4. Teacher Login (`/login/teacher`)
- **File**: `src/pages/TeacherLogin.jsx`
- **Features**:
  - Email and password authentication
  - "Remember me" checkbox
  - Link to password recovery
  - Information box explaining that teacher accounts are created by administrators
  - Switch to student login option
  - **Note**: No registration option - teachers are registered through admin console

### 5. Account Recovery (`/recover`)
- **File**: `src/pages/AccountRecovery.jsx`
- **Features**:
  - Account type selector (student or teacher)
  - Three-step recovery process:
    1. Enter email address
    2. Verify code sent to email
    3. Set new password
  - Visual step indicator showing progress
  - Resend verification code option
  - Back to login links

## Styling

All authentication pages share a common stylesheet:
- **File**: `src/pages/Auth.css`
- **Design**: Modern, clean UI with gradient accents
- **Responsive**: Works on mobile, tablet, and desktop
- **Colors**: Purple gradient theme (#667eea to #764ba2)

Landing page has its own stylesheet:
- **File**: `src/pages/Landing.css`

## Routes

All routes are configured in `src/App.jsx`:

```javascript
/ - Landing page
/login/student - Student login
/login/teacher - Teacher login
/register/student - Student registration (requires class code)
/recover - Account recovery for both students and teachers
```

## Key Features

### Class Code System
- Students **must** provide a class code during registration
- Class codes are provided by teachers
- Students are automatically assigned to classes based on the code
- Validation ensures class code is at least 6 characters

### Teacher Account Management
- Teachers **cannot** self-register
- Teacher accounts are created through an admin console
- Clear messaging on login page explains this
- Teachers only have login and recovery options

### Security Features
- Password minimum length (8 characters)
- Password confirmation during registration
- Email verification for account recovery
- Form validation on all inputs

## Backend Integration

Currently, all forms include placeholder TODO comments for backend integration:
- Student login: Connect to `/api/auth/student/login`
- Student registration: Connect to `/api/auth/student/register`
- Teacher login: Connect to `/api/auth/teacher/login`
- Account recovery: Connect to `/api/auth/recovery/*`

Each form currently shows an alert message indicating backend connection is pending.

## Technologies Used

- React 19.2.0
- React Router DOM (for navigation)
- Modern CSS with gradients and animations
- Responsive design with mobile-first approach

## Running the Application

```bash
cd frontend
npm install
npm run dev
```

The application will start on `http://localhost:5173` (Vite default port).

## Next Steps

1. Implement backend API endpoints for authentication
2. Add JWT token management
3. Create protected routes for student/teacher dashboards
4. Implement actual email verification system
5. Add session management and persistent login

