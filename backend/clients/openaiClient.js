import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let openaiClientInstance;

export function getOpenAIClient() {
  if (!openaiClientInstance) {

    if(!process.env.OPENAI_API_KEY || !process.env.OPENAI_BASE_URL) {
        throw new Error('OPENAI_API_KEY or OPENAI_BASE_URL is not set');
    }
    
    openaiClientInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL,
    });
  }
  return openaiClientInstance;
}

export default getOpenAIClient();
