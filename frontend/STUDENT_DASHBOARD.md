# Student Dashboard Documentation

This document describes the student dashboard (home page after login) for HSC Power.

## Overview

The student dashboard is a comprehensive, Canvas-inspired learning management interface designed for HSC students. It provides quick access to all essential features including classes, assignments, grades, and AI-powered recommendations.

## Access

- **Route**: `/student/dashboard`
- **File**: `src/pages/StudentDashboard.jsx`
- **Styles**: `src/pages/StudentDashboard.css`
- **Access**: Students are redirected here after successful login

## Layout

### Sidebar Navigation (Left)
- **Fixed sidebar** with the following sections:
  - 📊 Dashboard (overview)
  - 📚 My Classes
  - 📈 Grades
  - 📝 Assignments
  - 🤖 AI Study Planner
  - 🎯 Career Path
  - ⚙️ Settings

### Top Bar (Header)
- Page title (changes based on active section)
- Notification bell with badge
- User profile dropdown with:
  - Name, email, student ID
  - Settings link
  - Logout button

### Main Content Area
Content changes based on the selected navigation item.

## Features

### 1. Dashboard Overview
**Purpose**: Quick snapshot of student's academic status

**Components**:
- **Welcome Section**: Personalized greeting
- **Quick Stats Cards**:
  - Number of enrolled classes
  - Pending assignments count
  - Overall average grade
  - Completion rate percentage

- **My Classes Preview**: Shows 2 most recent classes with:
  - Class name, code, and teacher
  - Current grade
  - Progress bar
  - Next class time
  - Pending assignments count

- **Upcoming Assignments**: List of assignments with:
  - Assignment title
  - Class name
  - Due date with countdown
  - Priority indicator (high/medium/low)

- **Recent Grades Table**: Shows recent assignment grades with:
  - Assignment name
  - Class code
  - Score and max score
  - Letter grade

### 2. My Classes
**Purpose**: Detailed view of all enrolled classes

**Features**:
- Grid layout of class cards
- Each card shows:
  - Class icon with color theme
  - Class name and code
  - Teacher name
  - Current grade
  - Progress bar (% complete)
  - Next class time
  - Number of pending assignments
  - "Go to Class" action button

### 3. Grades
**Purpose**: Comprehensive grade tracking and performance overview

**Components**:
- **Overall Performance Card**:
  - Large circular display showing overall grade
  - Overall GPA

- **Grades by Subject**: List showing grade for each enrolled class

- **All Grades Table**: Detailed table with:
  - Assignment name
  - Class
  - Score/max score
  - Letter grade
  - Date

### 4. Assignments
**Purpose**: View and manage all assignments

**Features**:
- Detailed assignment cards showing:
  - Assignment title and class
  - Priority badge (high/medium/low)
  - Due date and time
  - Days remaining countdown
  - Current status
  - "View Assignment" action button

### 5. AI Study Planner 🤖
**Purpose**: AI-powered personalized study recommendations

**Features**:
- **Study Suggestions**: Cards with:
  - Subject and topic
  - Reason for recommendation (based on performance/deadlines)
  - Suggested duration
  - Priority level
  - "Add to Schedule" action

- **Study Schedule Placeholder**: 
  - Area for personalized study schedule
  - "Generate Study Plan" button

**AI Logic** (to be implemented):
- Analyzes recent quiz/test performance
- Considers upcoming assignment deadlines
- Suggests topics for review based on weak areas
- Recommends practice time for strong subjects

### 6. Career Recommendations 🎯
**Purpose**: AI-driven career path suggestions based on academic performance

**Features**:
- **Career Cards** with:
  - Match percentage (circular progress indicator)
  - Career title
  - Reason for recommendation
  - Salary range
  - Job growth rate
  - "Learn More" action button

- **Career Resources**:
  - Career Guides
  - University Pathways
  - Industry Insights

**AI Logic** (to be implemented):
- Analyzes performance across all subjects
- Identifies strengths and interests
- Matches to career paths
- Provides data-driven recommendations

### 7. Settings
**Purpose**: Manage profile and preferences

**Features**:
- **Profile Settings**:
  - Edit name and email
  - View student ID (read-only)
  - Save changes

- **Preferences**:
  - Email notifications toggle
  - AI recommendations toggle

- **Security**:
  - Change password option

## Mock Data

Currently using mock data for demonstration. The following data is hardcoded:

```javascript
- studentData: Student profile information
- enrolledClasses: Array of 4 classes with details
- upcomingAssignments: Array of 3 assignments
- recentGrades: Array of 4 recent grades
- studyPlanSuggestions: Array of 3 AI suggestions
- careerRecommendations: Array of 3 career matches
```

## Design Features

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Sidebar**: Dark (#1a202c)
- **Background**: Light gray (#f7fafc)
- **Cards**: White with subtle shadows

### Class Color Coding
Each class has a unique color used for:
- Border accent
- Grade badges
- Progress bars
- Action buttons

### Priority Indicators
- **High**: Red (#f56565)
- **Medium**: Orange (#ed8936)
- **Low**: Green (#48bb78)

### Responsive Design
- **Desktop**: Full sidebar with labels
- **Tablet**: Optimized grid layouts
- **Mobile**: Collapsed sidebar (icons only), single column layouts

## Interactions

### Navigation
- Click sidebar items to switch between sections
- Active section highlighted in sidebar
- Page title updates automatically

### User Menu
- Click profile button to show/hide dropdown
- Dropdown shows user info and actions
- Click outside to close

### Action Buttons
- Each card has contextual action buttons
- Hover effects for better UX
- Color-coded by importance

## Backend Integration (TODO)

### API Endpoints Needed

1. **Student Profile**
   - `GET /api/student/profile` - Get student information

2. **Classes**
   - `GET /api/student/classes` - Get enrolled classes
   - `GET /api/student/classes/:id` - Get class details

3. **Assignments**
   - `GET /api/student/assignments` - Get all assignments
   - `GET /api/student/assignments/upcoming` - Get upcoming assignments

4. **Grades**
   - `GET /api/student/grades` - Get all grades
   - `GET /api/student/grades/recent` - Get recent grades
   - `GET /api/student/grades/summary` - Get overall GPA and averages

5. **AI Features**
   - `GET /api/ai/study-planner` - Get personalized study recommendations
   - `POST /api/ai/study-planner/schedule` - Generate study schedule
   - `GET /api/ai/career-recommendations` - Get career path suggestions

6. **Settings**
   - `PUT /api/student/profile` - Update profile
   - `PUT /api/student/preferences` - Update preferences
   - `POST /api/student/password/change` - Change password

7. **Authentication**
   - `POST /api/auth/logout` - Logout user

### State Management Considerations

For production, consider implementing:
- Context API or Redux for global state
- JWT token management
- Protected routes with authentication guards
- Loading states for API calls
- Error handling and user feedback
- Optimistic updates for better UX

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Color contrast meets WCAG standards
- Screen reader friendly labels
- Focus indicators on interactive elements

## Performance Optimizations

Future improvements:
- Lazy load dashboard sections
- Virtualize long lists (assignments, grades)
- Memoize expensive calculations
- Implement infinite scroll for large datasets
- Cache frequently accessed data

## Testing Considerations

Key areas to test:
- Navigation between sections
- Responsive layout on different screen sizes
- User menu interactions
- Data rendering with various data sets
- Loading and error states
- Authentication flow (login → dashboard → logout)

## Usage

1. **Login**: Student logs in via `/login/student`
2. **Redirect**: Successful login redirects to `/student/dashboard`
3. **Navigation**: Use sidebar to switch between sections
4. **Logout**: Click profile → Logout to return to login page

## Notes

- All data is currently mock data for demonstration
- AI features show sample recommendations
- Backend integration required for full functionality
- Designed to be similar to Canvas LMS for familiarity
- Mobile-responsive design ensures accessibility on all devices

