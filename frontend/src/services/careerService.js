import mockData from '../mockData/mock-career-pathway-res.json'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';


export async function generateCareerPathway({ prompt, model = 'gpt-4.1-nano', maxTokens = 2000, useMockData = false }) {
  if (useMockData) {
    return mockData.response?.[0]
  }

  try {
    const res = await fetch(`${API_BASE_URL}/ai-agent/career-pathway`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model, maxTokens })
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    const data = await res.json()
    return data?.response?.[0]
  } catch (err) {
    console.warn('Career API failed, using mock:', err?.message)
    await new Promise(r => setTimeout(r, 300))
    return mockData.response?.[0]
  }
}


