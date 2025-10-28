<!-- f31a9be9-2794-4258-adb3-d848174c8e69 1a3b8c7c-1a63-4a51-aa4c-7d0c0835c2d2 -->
# Teacher Portal Implementation Plan

## Overview

Build a full-featured teacher portal following the established student dashboard architecture, with teaching-specific features and AI-powered tool placeholders.

## File Structure

```
frontend/src/
├── pages/
│   ├── TeacherDashboard.jsx          (Main container)
│   └── TeacherDashboard.css          (All teacher portal styles)
├── components/
│   └── teacher/
│       ├── teacherMockData.js        (Mock data for development)
│       ├── DashboardOverview.jsx     (Teacher home view)
│       ├── MyClassesView.jsx         (List of classes)
│       ├── ClassDetailView.jsx       (Individual class management)
│       ├── AssignmentsView.jsx       (All assignments across classes)
│       ├── CreateAssignmentView.jsx  (Create/edit with AI generation)
│       ├── GradeAssignmentView.jsx   (Grade submissions with AI auto-grade)
│       ├── StudentsView.jsx          (Student progress tracking)
│       ├── AnalyticsView.jsx         (Class performance with AI insights)
│       ├── AnnouncementsView.jsx     (Class announcements)
│       └── SettingsView.jsx          (Teacher profile settings)
└── App.jsx                            (Add teacher route)
```

## 1. Core Dashboard Container

**File**: `frontend/src/pages/TeacherDashboard.jsx`

Similar to `StudentDashboard.jsx` structure:

- Fixed sidebar with navigation (Dashboard, My Classes, Assignments, Students, Analytics, Announcements, Settings)
- Top header with notifications and user profile dropdown
- Dynamic content area rendering child components
- State management for active tab, selected class/assignment
- Logout functionality

**File**: `frontend/src/pages/TeacherDashboard.css`

Comprehensive styles for all teacher portal components, following the student dashboard CSS patterns.

## 2. Mock Data

**File**: `frontend/src/components/teacher/teacherMockData.js`

Export mock data:

- `teacherData`: Profile info (name, email, teacher ID, subjects)
- `teacherClasses`: Array of classes (class name, code, students count, schedule, color theme)
- `allAssignments`: Assignments across all classes (with submission stats)
- `studentsList`: Students across all classes (with grades, progress)
- `recentActivity`: Recent submissions, grades posted
- `classAnalytics`: Performance data per class
- Helper functions (e.g., `getSubmissionStats()`, `calculateClassAverage()`)

## 3. View Components

### DashboardOverview.jsx

- Welcome section with teacher name
- Quick stats cards (total students, pending submissions, classes today, avg class performance)
- Recent activity feed (new submissions, student questions)
- Upcoming classes schedule
- Quick actions (create assignment, post announcement)

### MyClassesView.jsx

- Grid of class cards showing:
        - Class name, code, period
        - Student count
        - Average grade
        - Upcoming assignments
        - Quick action buttons (view, create assignment, take attendance)
- Click handler to open ClassDetailView

### ClassDetailView.jsx

Detailed class management with tabs:

- **Overview**: Class info, schedule, student roster
- **Assignments**: Class-specific assignments with submission rates
- **Gradebook**: Spreadsheet-style grade view
- **Materials**: Course resources/files
- **Announcements**: Class-specific announcements
- **Analytics**: Class performance trends (AI insights placeholder)

### AssignmentsView.jsx

All assignments across classes:

- Filterable by class, status (draft, published, grading needed, graded)
- Assignment cards showing title, class, due date, submissions count
- Status indicators (e.g., "12/30 submitted", "5 pending grading")
- Actions: View submissions, Edit, Grade, Duplicate

### CreateAssignmentView.jsx

Assignment creation/editing form:

- Basic info (title, description, due date, points)
- Assignment type selector (homework, quiz, test, project)
- Quiz builder (add multiple choice, short answer questions)
- File attachments
- **AI Generation Section** (skeleton):
        - "Generate Assignment" button with subject/topic inputs
        - "Generate Rubric" button → placeholder modal
        - "Suggest Questions" based on curriculum
        - Mock AI response structure in comments

### GradeAssignmentView.jsx

Grade submissions interface:

- List of student submissions with status
- Side-by-side view: submission content + grading panel
- Rubric-based grading (if rubric exists)
- Comments/feedback section
- **AI Auto-Grade Section** (skeleton):
        - "Auto-Grade with AI" button for each submission
        - Shows confidence score and suggested grade
        - Teacher can accept/modify AI suggestion
        - Mock AI grading function returning dummy data

### StudentsView.jsx

Student management and tracking:

- Searchable/filterable student list
- Student cards showing: name, classes, overall grade, attendance
- Click to view detailed student profile:
        - All classes with this teacher
        - Grade history
        - Assignment completion rate
        - Attendance record
        - Notes section

### AnalyticsView.jsx

Class performance analytics:

- Overall statistics (class averages, grade distribution)
- Per-class performance breakdown
- Assignment performance trends
- **AI Insights Section** (skeleton):
        - "Generate Insights" button
        - Placeholder cards showing:
                - At-risk students identification
                - Topic difficulty analysis
                - Suggested interventions
                - Comparative performance trends
        - Mock AI analysis function

### AnnouncementsView.jsx

Announcement management:

- Create new announcement (title, message, target class/all classes)
- List of posted announcements with edit/delete
- Schedule announcement for future
- View who has seen the announcement

### SettingsView.jsx

Teacher profile and preferences:

- Edit name, email, bio
- Notification preferences
- Teaching preferences
- Change password

## 4. Routing and Protection

**File**: `frontend/src/App.jsx`

Update imports and routes:

```javascript
import TeacherDashboard from './pages/TeacherDashboard'
import ProtectedRoute from './components/ProtectedRoute'

// Add route:
<Route 
  path="/teacher/dashboard" 
  element={
    <ProtectedRoute requiredRole="teacher" redirectTo="/login/teacher">
      <TeacherDashboard />
    </ProtectedRoute>
  } 
/>
```

**File**: `frontend/src/pages/TeacherLogin.jsx`

Update line 42-43 to navigate to teacher dashboard:

```javascript
// Change from:
alert('Login successful! Teacher dashboard coming soon.')
// navigate('/teacher/dashboard') - uncomment when teacher dashboard is ready

// To:
navigate('/teacher/dashboard')
```

## 5. AI Feature Implementation Strategy

All AI features will be implemented as **skeleton functions** with:

1. **Clear function signatures** with JSDoc comments
2. **Mock return data** showing expected structure
3. **TODO comments** indicating backend integration needed
4. **UI placeholders** with "AI Powered" badges
5. **Loading states** prepared for actual API calls

Example skeleton pattern:

```javascript
/**
 * AI-powered automatic grading
 * TODO: Connect to backend AI service
 * @param {Object} submission - Student submission data
 * @param {Object} rubric - Grading rubric
 * @returns {Promise<Object>} AI grading result
 */
async function autoGradeSubmission(submission, rubric) {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/ai/grade', { ... })
  
  // Mock response for now
  return {
    suggestedGrade: 85,
    confidence: 0.92,
    breakdown: [
      { criterion: 'Content', score: 9, maxScore: 10, feedback: 'Well researched' },
      { criterion: 'Structure', score: 8, maxScore: 10, feedback: 'Good organization' }
    ],
    overallFeedback: 'Strong submission demonstrating understanding of key concepts.'
  }
}
```

## 6. Design Consistency

Follow existing patterns:

- Use same color scheme (purple gradient #667eea to #764ba2)
- Sidebar navigation style matching student dashboard
- Card-based layouts with hover effects
- Responsive design (mobile, tablet, desktop breakpoints)
- Consistent button styles and icons

## Key Differences from Student Portal

1. **Perspective shift**: Teacher manages multiple classes and students
2. **Creation capabilities**: Create assignments, quizzes, announcements
3. **Grading interface**: Submission review and grading tools
4. **Analytics focus**: Class-level and student-level performance tracking
5. **AI tools**: Generative (create content) vs. Recommendations (for students)

## Testing Checklist

After implementation, verify:

- [ ] Teacher login redirects to dashboard
- [ ] All navigation tabs work
- [ ] Mock data displays correctly
- [ ] Responsive design works on mobile
- [ ] Protected route blocks non-teachers
- [ ] AI skeleton buttons show placeholder responses
- [ ] User menu and logout function
- [ ] No console errors

## Documentation

Create `frontend/TEACHER_PORTAL.md` documenting:

- Portal features and sections
- AI feature skeletons and integration points
- Mock data structure
- Backend API endpoints needed
- Component architecture

### To-dos

- [ ] Add protected teacher routes in src/App.jsx using ProtectedRoute
- [ ] Create TeacherDashboard.jsx layout and TeacherDashboard.css
- [ ] Implement src/services/teacherApi.js with JWT-authenticated calls
- [ ] Build ClassesView and ClassDetail with tabs (Overview/Roster/Assignments/Announcements)
- [ ] Build AssignmentList and AssignmentBuilder (basic fields + resources)
- [ ] Implement GradingView with submissions table and score editor
- [ ] Implement RosterView with join code and remove student
- [ ] Implement AnnouncementsView with composer and list
- [ ] Add loading/empty/error states across all teacher views
- [ ] Smoke-test auth/role redirects and 401/403 handling