const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};

// Helper function to make authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Get student dashboard overview data
 */
export const getDashboardData = async () => {
  return authFetch(`${API_BASE_URL}/student/dashboard`);
};

/**
 * Get all enrolled classes
 */
export const getStudentClasses = async () => {
  return authFetch(`${API_BASE_URL}/student/classes`);
};

/**
 * Get details for a specific class
 */
export const getClassDetail = async (classId) => {
  return authFetch(`${API_BASE_URL}/student/classes/${classId}`);
};

/**
 * Get all assignments
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {boolean} params.upcoming - Only get upcoming assignments
 */
export const getStudentAssignments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/student/assignments${queryString ? `?${queryString}` : ''}`;
  return authFetch(url);
};

/**
 * Get details for a specific assignment
 */
export const getAssignmentDetail = async (assignmentId) => {
  return authFetch(`${API_BASE_URL}/student/assignments/${assignmentId}`);
};

/**
 * Submit an assignment
 */
export const submitAssignment = async (assignmentId, data) => {
  return authFetch(`${API_BASE_URL}/student/assignments/${assignmentId}/submit`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get all grades
 * @param {Object} params - Query parameters
 * @param {string} params.classId - Filter by class
 */
export const getStudentGrades = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/student/grades${queryString ? `?${queryString}` : ''}`;
  return authFetch(url);
};

/**
 * Get grades summary (overall average and per-class averages)
 */
export const getGradesSummary = async () => {
  return authFetch(`${API_BASE_URL}/student/grades/summary`);
};

/**
 * Generate AI study plan
 */
export const generateStudyPlan = async (data) => {
  return authFetch(`${API_BASE_URL}/student/study-plan/generate`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Save study plan preferences
 */
export const saveStudyPlanPreferences = async (preferences) => {
  return authFetch(`${API_BASE_URL}/student/study-plan/preferences`, {
    method: 'POST',
    body: JSON.stringify({ preferences }),
  });
};

/**
 * Get study plan preferences
 */
export const getStudyPlanPreferences = async () => {
  return authFetch(`${API_BASE_URL}/student/study-plan/preferences`);
};

/**
 * Get all HSC subjects
 * @param {Object} params - Query parameters
 * @param {string} params.category - Filter by category
 * @param {string} params.units - Filter by units
 * @param {string} params.difficulty - Filter by difficulty
 * @param {string} params.sortBy - Sort by field
 */
export const getHSCSubjects = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/student/hsc-subjects${queryString ? `?${queryString}` : ''}`;
  return authFetch(url);
};

/**
 * Get HSC subject details
 */
export const getHSCSubjectDetail = async (subjectId) => {
  return authFetch(`${API_BASE_URL}/student/hsc-subjects/${subjectId}`);
};

/**
 * Save HSC study plan
 */
export const saveHSCStudyPlan = async (data) => {
  return authFetch(`${API_BASE_URL}/student/hsc-study-plan`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get HSC study plan
 */
export const getHSCStudyPlan = async () => {
  return authFetch(`${API_BASE_URL}/student/hsc-study-plan`);
};

/**
 * Get weekly report data
 */
export const getWeeklyReport = async () => {
  return authFetch(`${API_BASE_URL}/student/weekly-report`);
};

/**
 * Review Incorrect Questions
 */
export const getReviewQuestions = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/student/review/questions${queryString ? `?${queryString}` : ''}`;
  return authFetch(url);
};

export const updateReviewQuestion = async (id, { isCorrect }) => {
  return authFetch(`${API_BASE_URL}/student/review/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ isCorrect })
  });
};

export const getReviewStats = async () => {
  return authFetch(`${API_BASE_URL}/student/review/stats`);
};

