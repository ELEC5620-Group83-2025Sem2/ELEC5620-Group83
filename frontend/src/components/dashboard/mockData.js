// Mock data for Student Dashboard
// This will be replaced with actual API calls

export const studentData = {
  name: 'John Smith',
  email: 'john.smith@school.edu.au',
  studentId: 'STU2025001',
  avatar: '👨‍🎓'
}

export const enrolledClasses = [
  {
    id: 1,
    code: 'MATH-ADV',
    name: 'Mathematics Advanced',
    teacher: 'Dr. Sarah Johnson',
    color: '#667eea',
    progress: 75,
    nextClass: 'Tomorrow, 9:00 AM',
    assignments: 2,
    grade: 'A'
  },
  {
    id: 2,
    code: 'ENG-ADV',
    name: 'English Advanced',
    teacher: 'Mr. Michael Chen',
    color: '#f56565',
    progress: 68,
    nextClass: 'Today, 2:00 PM',
    assignments: 1,
    grade: 'B+'
  },
  {
    id: 3,
    code: 'PHYS',
    name: 'Physics',
    teacher: 'Dr. Emily Wilson',
    color: '#48bb78',
    progress: 82,
    nextClass: 'Friday, 10:30 AM',
    assignments: 0,
    grade: 'A+'
  },
  {
    id: 4,
    code: 'CHEM',
    name: 'Chemistry',
    teacher: 'Ms. Lisa Anderson',
    color: '#ed8936',
    progress: 71,
    nextClass: 'Thursday, 1:00 PM',
    assignments: 3,
    grade: 'A-'
  }
]

export const upcomingAssignments = [
  {
    id: 1,
    title: 'Calculus Problem Set 5',
    class: 'Mathematics Advanced',
    dueDate: '2025-10-18',
    dueTime: '11:59 PM',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Essay: Shakespeare Analysis',
    class: 'English Advanced',
    dueDate: '2025-10-20',
    dueTime: '11:59 PM',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Lab Report: Thermodynamics',
    class: 'Physics',
    dueDate: '2025-10-22',
    dueTime: '11:59 PM',
    status: 'pending',
    priority: 'low'
  }
]

export const recentGrades = [
  { assignment: 'Algebra Quiz 3', class: 'MATH-ADV', score: 95, maxScore: 100, grade: 'A' },
  { assignment: 'Poetry Analysis', class: 'ENG-ADV', score: 88, maxScore: 100, grade: 'B+' },
  { assignment: 'Newton\'s Laws Test', class: 'PHYS', score: 98, maxScore: 100, grade: 'A+' },
  { assignment: 'Organic Chemistry Quiz', class: 'CHEM', score: 92, maxScore: 100, grade: 'A' }
]

export const studyPlanSuggestions = [
  {
    id: 1,
    subject: 'Mathematics',
    topic: 'Integration Techniques',
    reason: 'Based on your recent quiz performance',
    duration: '2 hours',
    priority: 'high'
  },
  {
    id: 2,
    subject: 'English',
    topic: 'Literary Devices Review',
    reason: 'Upcoming essay due soon',
    duration: '1.5 hours',
    priority: 'medium'
  },
  {
    id: 3,
    subject: 'Physics',
    topic: 'Practice Problems - Momentum',
    reason: 'Strengthen your strongest subject',
    duration: '1 hour',
    priority: 'low'
  }
]

export const careerRecommendations = [
  {
    id: 1,
    career: 'Data Scientist',
    match: 95,
    reason: 'Excellent performance in Mathematics and strong analytical skills',
    averageSalary: '$120,000 - $180,000',
    growthRate: 'Very High'
  },
  {
    id: 2,
    career: 'Software Engineer',
    match: 92,
    reason: 'Strong problem-solving abilities and technical aptitude',
    averageSalary: '$100,000 - $160,000',
    growthRate: 'High'
  },
  {
    id: 3,
    career: 'Research Scientist',
    match: 88,
    reason: 'Outstanding performance in Physics and Chemistry',
    averageSalary: '$90,000 - $140,000',
    growthRate: 'Moderate'
  }
]

// Helper function
export const getDaysUntilDue = (dueDate) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays < 0) return 'Overdue'
  return `${diffDays} days left`
}

