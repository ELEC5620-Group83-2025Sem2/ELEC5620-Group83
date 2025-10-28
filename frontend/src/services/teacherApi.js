import authService from './authService.js'

// Use relative API path; base URL is handled by authService (API_BASE_URL)
const API_URL = '/teacher'

class TeacherAPI {
  // Classes
  async getClasses() {
    const response = await authService.authenticatedRequest(`${API_URL}/classes`)
    return response
  }

  async getClassById(classId) {
    const response = await authService.authenticatedRequest(`${API_URL}/classes/${classId}`)
    return response
  }

  async createClass(classData) {
    const response = await authService.authenticatedRequest(`${API_URL}/classes`, {
      method: 'POST',
      body: JSON.stringify(classData)
    })
    return response
  }

  async updateClass(classId, classData) {
    const response = await authService.authenticatedRequest(`${API_URL}/classes/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(classData)
    })
    return response
  }

  async deleteClass(classId) {
    const response = await authService.authenticatedRequest(`${API_URL}/classes/${classId}`, {
      method: 'DELETE'
    })
    return response
  }

  async enrollStudent(classId, studentId) {
    const response = await authService.authenticatedRequest(`${API_URL}/classes/${classId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ studentId })
    })
    return response
  }

  async removeStudent(classId, studentId) {
    const response = await authService.authenticatedRequest(`${API_URL}/classes/${classId}/students/${studentId}`, {
      method: 'DELETE'
    })
    return response
  }

  // Assignments
  async getAssignments() {
    const response = await authService.authenticatedRequest(`${API_URL}/assignments`)
    return response
  }

  async getAssignmentById(assignmentId) {
    const response = await authService.authenticatedRequest(`${API_URL}/assignments/${assignmentId}`)
    return response
  }

  async createAssignment(assignmentData) {
    const response = await authService.authenticatedRequest(`${API_URL}/assignments`, {
      method: 'POST',
      body: JSON.stringify(assignmentData)
    })
    return response
  }

  async updateAssignment(assignmentId, assignmentData) {
    const response = await authService.authenticatedRequest(`${API_URL}/assignments/${assignmentId}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData)
    })
    return response
  }

  async deleteAssignment(assignmentId) {
    const response = await authService.authenticatedRequest(`${API_URL}/assignments/${assignmentId}`, {
      method: 'DELETE'
    })
    return response
  }

  async getAssignmentSubmissions(assignmentId) {
    const response = await authService.authenticatedRequest(`${API_URL}/assignments/${assignmentId}/submissions`)
    return response
  }

  async gradeSubmission(assignmentId, submissionId, gradeData) {
    const response = await authService.authenticatedRequest(`${API_URL}/assignments/${assignmentId}/submissions/${submissionId}/grade`, {
      method: 'PUT',
      body: JSON.stringify(gradeData)
    })
    return response
  }

  // Students
  async getStudents() {
    const response = await authService.authenticatedRequest(`${API_URL}/students`)
    return response
  }

  async getStudentProfile(studentId) {
    const response = await authService.authenticatedRequest(`${API_URL}/students/${studentId}`)
    return response
  }

  async updateStudentProfile(studentId, profileData) {
    const response = await authService.authenticatedRequest(`${API_URL}/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
    return response
  }

  // Announcements
  async getAnnouncements() {
    const response = await authService.authenticatedRequest(`${API_URL}/announcements`)
    return response
  }

  async getAnnouncementById(announcementId) {
    const response = await authService.authenticatedRequest(`${API_URL}/announcements/${announcementId}`)
    return response
  }

  async createAnnouncement(announcementData) {
    const response = await authService.authenticatedRequest(`${API_URL}/announcements`, {
      method: 'POST',
      body: JSON.stringify(announcementData)
    })
    return response
  }

  async updateAnnouncement(announcementId, announcementData) {
    const response = await authService.authenticatedRequest(`${API_URL}/announcements/${announcementId}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData)
    })
    return response
  }

  async deleteAnnouncement(announcementId) {
    const response = await authService.authenticatedRequest(`${API_URL}/announcements/${announcementId}`, {
      method: 'DELETE'
    })
    return response
  }
}

const teacherApi = new TeacherAPI()
export default teacherApi

