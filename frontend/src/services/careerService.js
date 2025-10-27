import mockCareerData from '../mock_data/career-response.json'

export async function generateCareerPathway({ prompt, model = 'gpt-4.1-nano', maxTokens = 2000, useMockData = true }) {
  // For development/testing: use mock data if requested or if API fails
  if (useMockData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockCareerData.response?.[0]
  }

  try {
    const response = await fetch('http://localhost:3000/api/ai-agent/career-pathway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model, maxTokens })
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    // Unwrap to first element according to backend contract
    return data?.response?.[0]
  } catch (error) {
    console.warn('API call failed, falling back to mock data:', error.message)
    // Fall back to mock data on error
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockCareerData.response?.[0]
  }
}


