import mockData from '../mockData/mock-HSC-subject-recommendation.json'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function generateCourseRecommendation({ prompt, model = 'gpt-4.1-nano', maxTokens = 2000, useMockData = false }) {
  if (useMockData) {
    await new Promise(r => setTimeout(r, 400))
    return mockData.response || []
  }

  try {
    const res = await fetch(`${API_BASE_URL}/ai-agent/course-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model, maxTokens })
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    const data = await res.json()
    // Expecting { response: [...] }
    return data?.response || []
  } catch (err) {
    console.warn('Course recommendation API failed, using mock:', err?.message)
    await new Promise(r => setTimeout(r, 300))
    return mockData.response || []
  }
}
