# Teacher Portal Documentation

This document describes the comprehensive teacher portal implementation for HSC Power.

## Overview

The teacher portal is a full-featured teaching management system that allows teachers to manage classes, create and grade assignments, track student progress, and leverage AI-powered tools for enhanced teaching efficiency.

## Access

- **Route**: `/teacher/dashboard`
- **Protection**: Protected by `ProtectedRoute` component with `requiredRole="teacher"`
- **Login**: Teachers access the portal through `/login/teacher`
- **Redirect**: Unauthorized access redirects to `/login/teacher`

## Architecture

### Component Structure

```
frontend/src/
├── pages/
│   ├── TeacherDashboard.jsx        # Main container with routing
│   └── TeacherDashboard.css        # Comprehensive styles
├── components/
│   └── teacher/
│       ├── teacherMockData.js      # Mock data and AI skeletons
│       ├── DashboardOverview.jsx   # Home view
│       ├── MyClassesView.jsx       # Classes list
│       ├── ClassDetailView.jsx     # Class management
│       ├── AssignmentsView.jsx     # Assignments list
│       ├── CreateAssignmentView.jsx # Assignment creation
│       ├── GradeAssignmentView.jsx  # Grading interface
│       ├── StudentsView.jsx        # Student management
│       ├── AnalyticsView.jsx       # Performance analytics
│       ├── AnnouncementsView.jsx   # Announcements
│       └── SettingsView.jsx        # Settings
```

## Features

### 1. Dashboard Overview
**Component**: `DashboardOverview.jsx`

**Features**:
- Welcome section with teacher name
- Quick stats (students, pending grading, classes today, avg performance)
- Today's classes with schedule
- Recent activity feed
- Quick action buttons
- Classes overview grid

**Props**:
- `onTabChange`: Function to switch tabs
- `onClassClick`: Function to view class details
- `onCreateAssignment`: Function to create new assignment

### 2. My Classes
**Component**: `MyClassesView.jsx`

**Features**:
- Grid display of all teacher's classes
- Class cards showing:
  - Name, code, period
  - Student count and average grade
  - Schedule preview
  - Upcoming assignments and pending grading count
- Click to view class details

**Props**:
- `onClassClick`: Function to navigate to class detail

### 3. Class Detail View
**Component**: `ClassDetailView.jsx`

**Features**:
- Comprehensive class management with tabs:
  - **Overview**: Course description, schedule, quick stats
  - **Student Roster**: Grid of enrolled students with stats
  - **Assignments**: Class-specific assignments list
  - **Gradebook**: Grade spreadsheet (placeholder)
  - **Announcements**: Class announcements
  - **Analytics**: Performance trends and grade distribution

**Props**:
- `classId`: ID of the class to display
- `onBack`: Function to return to classes list
- `onCreateAssignment`: Function to create assignment for this class

### 4. Assignments View
**Component**: `AssignmentsView.jsx`

**Features**:
- Comprehensive assignment management
- Filter by status (draft, published, grading needed, graded)
- Filter by class
- Assignment cards with:
  - Title, description, class
  - Due date and points
  - Submission statistics with progress bars
  - Grading progress
  - Action buttons (View, Edit, Grade, Publish)

**Props**:
- `onAssignmentClick`: View assignment details
- `onCreateAssignment`: Create new assignment
- `onGradeAssignment`: Open grading interface

### 5. Create Assignment View
**Component**: `CreateAssignmentView.jsx`

**Features**:
- Full assignment creation form
- Basic information (title, description, class, type, due date, points)
- Assignment types (homework, quiz, test, project)
- Quiz builder for questions and multiple choice options
- **AI-Powered Tools** (Skeletons):
  - Generate Assignment: Create complete assignment with AI
  - Generate Rubric: AI-powered grading criteria
  - Suggest Questions: Get AI-generated question ideas
- File attachments support
- Save as draft or publish

**Props**:
- `assignmentId`: ID if editing existing assignment
- `classId`: Pre-selected class ID
- `onBack`: Function to return to assignments list

**AI Functions**:
- `generateAssignment()`: Mock AI generation (2.5s delay)
- `generateRubric()`: Mock rubric generation (2s delay)
- `suggestQuestions()`: Mock question suggestions (1.5s delay)

### 6. Grade Assignment View
**Component**: `GradeAssignmentView.jsx`

**Features**:
- Split view: submissions list + grading panel
- Submission list with status (graded/pending)
- Detailed submission view with content and attachments
- **AI Auto-Grading** (Skeleton):
  - "Auto-Grade with AI" button
  - AI analyzes submission and suggests grade
  - Breakdown by criteria with scores and feedback
  - Overall feedback and suggested comments
  - Confidence score display
  - Accept AI grade or modify manually
- Manual grading form with grade input and feedback
- Save & Next functionality

**Props**:
- `assignmentId`: Assignment to grade
- `onBack`: Return to assignments list

**AI Function**:
- `autoGradeSubmission()`: Mock auto-grading (1.5s delay)
- Returns: suggested grade, confidence, breakdown, feedback

### 7. Students View
**Component**: `StudentsView.jsx`

**Features**:
- Search students by name or email
- Filter by class
- Student cards showing:
  - Name, email, student ID
  - Overall grade and attendance
  - Enrolled classes (color-coded tags)
  - Recent activity
- Student detail modal with:
  - Profile header with avatar
  - Stats (grade, attendance, class count)
  - Enrolled classes list
  - Recent activity
  - Notes section (editable)

### 8. Analytics View
**Component**: `AnalyticsView.jsx`

**Features**:
- Class selector dropdown
- Overall statistics cards
- Grade distribution chart
- Performance trends (4-week view)
- **AI-Powered Insights** (Skeleton):
  - "Generate AI Insights" button
  - Overall performance analysis
  - At-risk students identification with:
    - Risk level (high/medium/low)
    - Concerns list
    - Recommendations for intervention
  - Topic difficulty analysis
  - Suggested interventions with priorities
  - Class strengths
  - Comparative benchmarks (vs school, state, last year)

**AI Function**:
- `analyzeClassPerformance()`: Mock AI analysis (2s delay)
- Returns: comprehensive performance insights

### 9. Announcements View
**Component**: `AnnouncementsView.jsx`

**Features**:
- Create announcement form with:
  - Title and message
  - Target (specific class or all classes)
  - Schedule for later (optional)
- Posted announcements list showing:
  - Title and message
  - Target class
  - Posted date
  - View statistics (who viewed)
  - Edit and delete buttons
- View progress bar
- Tips for effective announcements

### 10. Settings View
**Component**: `SettingsView.jsx`

**Features**:
- Profile settings:
  - Edit name, email, bio
  - View teacher ID (read-only)
  - Subjects display
- Notification preferences:
  - New submission notifications
  - Grade posted confirmations
  - Announcement notifications
  - Push notifications
- Teaching preferences:
  - AI assistance toggle
  - Auto-publish grades
  - Late submission acceptance
- Security:
  - Last login display
  - Change password button
- Account management section

## Mock Data Structure

### `teacherMockData.js`

**Exports**:
- `teacherData`: Teacher profile
- `teacherClasses`: Array of 4 classes with full details
- `allAssignments`: 5 assignments across classes
- `studentsList`: 5 students with grades and attendance
- `recentActivity`: Activity feed items
- `classAnalytics`: Performance data per class
- `announcements`: Posted announcements
- `submissions`: Student submissions for grading

**Helper Functions**:
- `getSubmissionStats(assignmentId)`
- `calculateClassAverage(classId)`
- `getClassById(classId)`
- `getClassAssignments(classId)`
- `getClassStudents(classId)`
- `getTotalStudents()`
- `getPendingGradingCount()`
- `getTodayClasses()`
- `getOverallPerformance()`

**AI Skeleton Functions** (All return Promises with mock delays):
- `autoGradeSubmission(submission, rubric)` - 1.5s delay
- `generateRubric(assignmentDetails)` - 2s delay
- `generateAssignment(params)` - 2.5s delay
- `analyzeClassPerformance(classId)` - 2s delay
- `suggestQuestions(context)` - 1.5s delay

## AI Feature Implementation

All AI features are implemented as **skeleton functions** ready for backend integration:

### 1. Auto-Grading
**Location**: `teacherMockData.js` → `autoGradeSubmission()`

**Mock Response Structure**:
```javascript
{
  success: true,
  suggestedGrade: 85,
  maxPoints: 100,
  confidence: 0.92,
  breakdown: [
    { criterion: string, score: number, maxScore: number, feedback: string }
  ],
  overallFeedback: string,
  suggestedComments: [string]
}
```

**Backend Integration Point**:
```javascript
// TODO: Replace with actual API call
const response = await fetch('/api/ai/grade', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ submission, rubric })
})
return await response.json()
```

### 2. Rubric Generation
**Location**: `teacherMockData.js` → `generateRubric()`

**Mock Response Structure**:
```javascript
{
  success: true,
  rubric: {
    totalPoints: 100,
    criteria: [
      {
        id: string,
        name: string,
        description: string,
        points: number,
        levels: [{ level: string, points: string, description: string }]
      }
    ]
  },
  rationale: string
}
```

**Backend Integration Point**: `/api/ai/generate-rubric`

### 3. Assignment Generation
**Location**: `teacherMockData.js` → `generateAssignment()`

**Parameters**:
- `subject`: Subject area
- `topic`: Specific topic
- `difficulty`: Difficulty level
- `type`: Assignment type (quiz, homework, etc.)
- `questionCount`: Number of questions

**Backend Integration Point**: `/api/ai/generate-assignment`

### 4. Performance Analysis
**Location**: `teacherMockData.js` → `analyzeClassPerformance()`

**Returns**: Comprehensive class analysis with:
- Overall performance summary
- At-risk students list with interventions
- Topic difficulty breakdown
- Suggested interventions
- Class strengths
- Comparative benchmarks

**Backend Integration Point**: `/api/ai/analyze-performance`

### 5. Question Suggestions
**Location**: `teacherMockData.js` → `suggestQuestions()`

**Backend Integration Point**: `/api/ai/suggest-questions`

## Styling

**File**: `TeacherDashboard.css`

The CSS file imports `StudentDashboard.css` for base styles and extends with teacher-specific components:

**Key Sections**:
- Dashboard overview styles
- Classes view with color-coded cards
- Class detail tabs and content
- Assignments filtering and cards
- Assignment creation form with AI tools
- Grading interface with AI results panel
- Students grid and detail modal
- Analytics with charts and AI insights
- Announcements composer and list
- Settings forms

**Design System**:
- Primary color: Purple gradient (#667eea to #764ba2)
- Success: #48bb78
- Warning: #ed8936
- Error: #f56565
- Gray scale: #f7fafc to #1a202c

**Responsive Breakpoints**:
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## Backend API Endpoints Needed

### Authentication
- `POST /api/auth/login` - Teacher login (already exists)
- `POST /api/auth/logout` - Logout

### Classes
- `GET /api/teacher/classes` - Get all teacher's classes
- `GET /api/teacher/classes/:id` - Get class details
- `GET /api/teacher/classes/:id/students` - Get class roster
- `GET /api/teacher/classes/:id/analytics` - Get class analytics

### Assignments
- `GET /api/teacher/assignments` - Get all assignments
- `GET /api/teacher/assignments/:id` - Get assignment details
- `POST /api/teacher/assignments` - Create assignment
- `PUT /api/teacher/assignments/:id` - Update assignment
- `DELETE /api/teacher/assignments/:id` - Delete assignment
- `POST /api/teacher/assignments/:id/publish` - Publish assignment

### Grading
- `GET /api/teacher/assignments/:id/submissions` - Get submissions
- `PUT /api/teacher/submissions/:id/grade` - Save grade

### Students
- `GET /api/teacher/students` - Get all students
- `GET /api/teacher/students/:id` - Get student details
- `PUT /api/teacher/students/:id/notes` - Save student notes

### Announcements
- `GET /api/teacher/announcements` - Get announcements
- `POST /api/teacher/announcements` - Create announcement
- `PUT /api/teacher/announcements/:id` - Update announcement
- `DELETE /api/teacher/announcements/:id` - Delete announcement

### AI Features
- `POST /api/ai/grade` - Auto-grade submission
- `POST /api/ai/generate-rubric` - Generate rubric
- `POST /api/ai/generate-assignment` - Generate assignment
- `POST /api/ai/analyze-performance` - Analyze class performance
- `POST /api/ai/suggest-questions` - Suggest questions

### Profile
- `GET /api/teacher/profile` - Get teacher profile
- `PUT /api/teacher/profile` - Update profile
- `PUT /api/teacher/preferences` - Update preferences
- `POST /api/teacher/password/change` - Change password

## Navigation Flow

```
Login (/login/teacher)
  ↓
Dashboard (/teacher/dashboard)
  ├── Overview (default)
  ├── My Classes
  │   └── Class Detail
  │       ├── Overview
  │       ├── Roster
  │       ├── Assignments
  │       ├── Gradebook
  │       ├── Announcements
  │       └── Analytics
  ├── Assignments
  │   ├── Create/Edit Assignment
  │   └── Grade Assignment
  ├── Students
  │   └── Student Detail Modal
  ├── Analytics
  │   └── AI Insights Panel
  ├── Announcements
  └── Settings
```

## State Management

Currently using React's `useState` for local state. For production, consider:

- **Context API**: For global teacher data
- **React Query**: For API data fetching and caching
- **Redux**: If complex state management needed

## Testing Checklist

- [ ] Teacher login redirects to dashboard
- [ ] All navigation tabs work correctly
- [ ] Mock data displays properly
- [ ] Class detail tabs switch correctly
- [ ] Assignment creation form validates input
- [ ] AI skeleton buttons show loading states
- [ ] Grading interface switches between submissions
- [ ] Student search and filtering works
- [ ] Analytics class selector updates data
- [ ] Announcements can be created
- [ ] Settings form saves changes
- [ ] Protected route blocks non-teachers
- [ ] Logout clears session and redirects
- [ ] Responsive design on mobile devices
- [ ] No console errors

## Development Notes

### Adding New Features

1. **New View Component**:
   - Create component in `components/teacher/`
   - Add to `TeacherDashboard.jsx` imports
   - Add case in `renderContent()` switch
   - Add navigation button in sidebar
   - Add title in `getPageTitle()`
   - Add styles in `TeacherDashboard.css`

2. **New AI Feature**:
   - Create skeleton function in `teacherMockData.js`
   - Add JSDoc with TODO comment
   - Return mock data with appropriate delay
   - Create UI component with loading state
   - Document backend endpoint needed

### Known Limitations

- **Mock Data**: All data is currently hardcoded
- **Authentication**: Basic token storage, no refresh logic
- **File Uploads**: UI only, no actual file handling
- **Real-time Updates**: No websocket connections
- **Gradebook**: Placeholder only, needs full implementation

### Future Enhancements

- [ ] Bulk grading interface
- [ ] Export grades to CSV
- [ ] Calendar integration
- [ ] Parent communication portal
- [ ] Advanced analytics dashboard
- [ ] Assignment templates library
- [ ] Peer review assignments
- [ ] Video feedback for submissions
- [ ] Integration with learning management systems
- [ ] Mobile app version

## Troubleshooting

### Common Issues

1. **Dashboard not loading**
   - Check if teacher is authenticated
   - Verify role in localStorage: `localStorage.getItem('user')`
   - Check console for errors

2. **AI features not working**
   - These are skeleton functions with mock delays
   - Check browser console for errors
   - Verify function is being called

3. **Styles not applying**
   - Ensure CSS import in TeacherDashboard.jsx
   - Check if StudentDashboard.css exists (imported)
   - Clear browser cache

4. **Protected route redirect loop**
   - Verify auth token exists
   - Check role matches 'teacher'
   - Ensure ProtectedRoute component is correct

## Contributing

When adding features to the teacher portal:

1. Follow existing component structure
2. Use mock data from `teacherMockData.js`
3. Add AI features as skeleton functions
4. Include JSDoc comments with TODO markers
5. Update this documentation
6. Test responsive design
7. Check accessibility (keyboard navigation, ARIA labels)

## Related Documentation

- `frontend/AUTH_PAGES.md` - Authentication system
- `frontend/STUDENT_DASHBOARD.md` - Student portal reference
- `frontend/COMPONENT_STRUCTURE.md` - Component architecture
- `frontend/PROTECTED_ROUTE_EXAMPLE.md` - Route protection

---

**Version**: 1.0.0  
**Last Updated**: October 27, 2025  
**Maintained by**: ELEC5620 Group 83

