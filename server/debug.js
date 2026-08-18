import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

console.log("1. Environment Key Check:", process.env.GEMINI_API_KEY ? "KEY EXISTS" : "KEY MISSING!");

if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: Please add GEMINI_API_KEY to your .env file!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

console.log("2. Sending test request to Gemini API...");

try {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: 'Hi',
  });
  console.log("3. API Success! Response received:\n", response.text);
} catch (error) {
  console.error("3. API Failed! Full Error Details:\n", error);
}