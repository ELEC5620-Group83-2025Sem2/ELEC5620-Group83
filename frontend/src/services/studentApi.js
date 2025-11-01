import authService from './authService.js'

// Use relative API path; base URL is handled by authService (API_BASE_URL)
const API_URL = '/student'

class StudentAPI {
  // Announcements
  async getAnnouncements() {
    const response = await authService.authenticatedRequest(`${API_URL}/announcements`)
    return response
  }
}

// Export a singleton instance
const studentApi = new StudentAPI()
export default studentApi

