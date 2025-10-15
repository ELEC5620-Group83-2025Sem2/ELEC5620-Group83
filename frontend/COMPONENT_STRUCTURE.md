# Component Structure

This document describes the refactored component structure for the HSC Power frontend.

## File Organization

```
frontend/src/
├── components/
│   └── dashboard/
│       ├── mockData.js              # Shared mock data and helper functions
│       ├── DashboardOverview.jsx    # Main dashboard overview tab
│       ├── ClassesView.jsx          # My Classes tab
│       ├── GradesView.jsx           # Grades tab
│       ├── AssignmentsView.jsx      # Assignments tab
│       ├── StudyPlannerView.jsx     # AI Study Planner tab
│       ├── CareerView.jsx           # Career Recommendations tab
│       └── SettingsView.jsx         # Settings tab
├── pages/
│   ├── Landing.jsx                  # Landing page
│   ├── Landing.css
│   ├── StudentLogin.jsx             # Student login
│   ├── StudentRegister.jsx          # Student registration
│   ├── TeacherLogin.jsx             # Teacher login
│   ├── AccountRecovery.jsx          # Account recovery
│   ├── Auth.css                     # Shared auth styles
│   ├── StudentDashboard.jsx         # Dashboard container/layout
│   └── StudentDashboard.css         # Dashboard styles
├── App.jsx                          # Main app with routing
├── App.css
├── main.jsx
└── index.css
```

## Dashboard Components

### Main Container
**File**: `pages/StudentDashboard.jsx`

**Responsibilities**:
- Layout structure (sidebar + main content)
- Navigation state management
- User menu and header
- Routing between different views
- Imports and renders child components

**Key Features**:
- Fixed sidebar navigation
- Top header with notifications and user menu
- Dynamic content area based on active tab
- Page title updates based on current view

### Child Components

#### 1. DashboardOverview.jsx
**Purpose**: Main dashboard overview (default view)

**Data Required**:
- `studentData` - Student profile info
- `enrolledClasses` - List of classes
- `upcomingAssignments` - Pending assignments
- `recentGrades` - Recent grade entries

**Features**:
- Quick stats cards
- Class preview (first 2 classes)
- Upcoming assignments list
- Recent grades table
- "View All" links to other sections

#### 2. ClassesView.jsx
**Purpose**: Full list of enrolled classes

**Data Required**:
- `enrolledClasses` - Array of class objects

**Features**:
- Grid layout of detailed class cards
- Shows progress, grade, teacher, next class
- Color-coded by class
- "Go to Class" action buttons

#### 3. GradesView.jsx
**Purpose**: Comprehensive grade tracking

**Data Required**:
- `enrolledClasses` - For subject grades
- `recentGrades` - All grade entries

**Features**:
- Overall GPA display
- Grades by subject
- Detailed grades table

#### 4. AssignmentsView.jsx
**Purpose**: View and manage assignments

**Data Required**:
- `upcomingAssignments` - List of assignments

**Features**:
- Detailed assignment cards
- Due date countdowns
- Priority indicators
- Status tracking

#### 5. StudyPlannerView.jsx
**Purpose**: AI-powered study recommendations

**Data Required**:
- `studyPlanSuggestions` - AI-generated study suggestions

**Features**:
- Personalized study suggestions
- Priority-based recommendations
- Study schedule placeholder
- "Add to Schedule" actions

#### 6. CareerView.jsx
**Purpose**: AI career path recommendations

**Data Required**:
- `careerRecommendations` - Career matches

**Features**:
- Career cards with match percentages
- Salary and growth information
- Career resources section
- "Learn More" actions

#### 7. SettingsView.jsx
**Purpose**: User settings and preferences

**Data Required**:
- `studentData` - For profile editing

**Features**:
- Profile settings form
- Notification preferences
- Password change option

## Mock Data

**File**: `components/dashboard/mockData.js`

**Exports**:
- `studentData` - Student profile object
- `enrolledClasses` - Array of class objects
- `upcomingAssignments` - Array of assignment objects
- `recentGrades` - Array of grade objects
- `studyPlanSuggestions` - Array of study suggestions
- `careerRecommendations` - Array of career matches
- `getDaysUntilDue()` - Helper function for date calculations

**Why Separate?**:
- Centralized data management
- Easy to replace with API calls
- Reusable across components
- Consistent data structure

## Benefits of This Structure

### 1. Modularity
- Each view is a separate, focused component
- Easy to understand and maintain
- Single responsibility principle

### 2. Reusability
- Components can be reused or extended
- Mock data is centralized and shareable
- Helper functions are accessible to all components

### 3. Maintainability
- Easy to find and edit specific features
- Changes to one view don't affect others
- Clear separation of concerns

### 4. Scalability
- Easy to add new tabs/views
- Simple to add new features to existing views
- Ready for backend integration

### 5. Testability
- Each component can be tested independently
- Mock data makes testing easier
- Props are clearly defined

## Data Flow

```
StudentDashboard.jsx (Container)
    ↓
    ├── Imports mockData
    ├── Manages activeTab state
    ├── Renders sidebar & header
    └── Passes data to child components via props
        ↓
        Child Components (Views)
        ├── DashboardOverview
        ├── ClassesView
        ├── GradesView
        ├── AssignmentsView
        ├── StudyPlannerView
        ├── CareerView
        └── SettingsView
```

## Props Interface

### DashboardOverview
```javascript
{
  studentData: Object,
  enrolledClasses: Array,
  upcomingAssignments: Array,
  recentGrades: Array,
  onTabChange: Function
}
```

### ClassesView
```javascript
{
  enrolledClasses: Array
}
```

### GradesView
```javascript
{
  enrolledClasses: Array,
  recentGrades: Array
}
```

### AssignmentsView
```javascript
{
  upcomingAssignments: Array
}
```

### StudyPlannerView
```javascript
{
  studyPlanSuggestions: Array
}
```

### CareerView
```javascript
{
  careerRecommendations: Array
}
```

### SettingsView
```javascript
{
  studentData: Object
}
```

## Future Enhancements

### Backend Integration
When connecting to the backend:
1. Replace mockData imports with API calls
2. Add loading states to each component
3. Implement error handling
4. Add data fetching hooks (useEffect)

### State Management
Consider adding:
- Context API for global state
- Redux for complex state management
- React Query for data fetching

### Additional Features
- Add PropTypes or TypeScript for type safety
- Implement lazy loading for better performance
- Add animations between view transitions
- Create shared UI components library

## Adding a New View

1. Create new component in `components/dashboard/`
2. Import in `StudentDashboard.jsx`
3. Add case to `renderContent()` switch
4. Add navigation button to sidebar
5. Add title to `getPageTitle()`
6. Pass necessary props

Example:
```javascript
// 1. Create NotificationsView.jsx
// 2. Import
import NotificationsView from '../components/dashboard/NotificationsView'

// 3. Add case
case 'notifications':
  return <NotificationsView notifications={notifications} />

// 4. Add button
<button className="nav-item" onClick={() => setActiveTab('notifications')}>
  <span className="nav-icon">🔔</span>
  <span className="nav-label">Notifications</span>
</button>

// 5. Add title
notifications: 'Notifications'
```

## Styling

All dashboard components share the same CSS file:
- **File**: `pages/StudentDashboard.css`
- **Scope**: All dashboard-related styles
- **Convention**: BEM-like naming for classes

To add component-specific styles, add classes to the existing CSS file following the established patterns.

