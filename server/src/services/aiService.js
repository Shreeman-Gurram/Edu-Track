import { GoogleGenAI } from '@google/genai';
import { 
  buildAdaptiveExplanationPrompt, 
  buildPracticeQuestionsPrompt, 
  buildGeneralQuestionPrompt 
} from '../prompts/aiPrompts.js';

const responseCache = new Map();

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from environment variables.');
  }
  return new GoogleGenAI({ apiKey });
};

// Strict JSON schemas for Gemini Structured Outputs
const generalQuestionSchema = {
  type: 'OBJECT',
  properties: {
    question: { type: 'STRING' },
    answer: { type: 'STRING' },
    visualDiagram: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    example: { type: 'STRING' },
    tip: { type: 'STRING' }
  },
  required: ['question', 'answer', 'visualDiagram', 'example', 'tip']
};

const adaptiveExplanationSchema = {
  type: 'OBJECT',
  properties: {
    concept: { type: 'STRING' },
    explanation: { type: 'STRING' },
    visualDiagram: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    analogy: { type: 'STRING' },
    keyTakeaways: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    encouragingNote: { type: 'STRING' }
  },
  required: ['concept', 'explanation', 'visualDiagram', 'analogy', 'keyTakeaways', 'encouragingNote']
};

const practiceQuestionsSchema = {
  type: 'OBJECT',
  properties: {
    questions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          question: { type: 'STRING' },
          options: {
            type: 'ARRAY',
            items: { type: 'STRING' }
          },
          correctAnswer: { type: 'STRING' },
          explanation: { type: 'STRING' }
        },
        required: ['id', 'question', 'options', 'correctAnswer', 'explanation']
      }
    }
  },
  required: ['questions']
};

// Robust parser with string cleanup for ASCII control characters
const parseJsonResponse = (text) => {
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Remove control characters that might invalidate raw strings
    cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    return JSON.parse(cleaned);
  }
};

const callModelWithSchema = async (prompt, responseSchema) => {
  const ai = getAiClient();
  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.2,
          maxOutputTokens: 2048, // Prevents truncation mid-diagram
        },
      });
      return parseJsonResponse(response.text);
    } catch (error) {
      if (attempts >= maxAttempts) throw error;
      console.warn(`[Attempt ${attempts} retrying due to API latency/format error...]`);
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
};

export const generateAdaptiveExplanation = async (studentData) => {
  try {
    const prompt = buildAdaptiveExplanationPrompt(studentData);
    return await callModelWithSchema(prompt, adaptiveExplanationSchema);
  } catch (error) {
    console.error('Error generating AI explanation:', error.message);
    return {
      concept: studentData.weakConcept,
      explanation: `Let's break down ${studentData.weakConcept} step by step.`,
      visualDiagram: ["[ Input ] --> [ Process ] --> [ Output ]"],
      analogy: "Think of it like sharing a chocolate bar equally.",
      keyTakeaways: ["Step 1", "Step 2"],
      encouragingNote: "Keep going!"
    };
  }
};

export const generatePracticeQuestions = async (questionParams) => {
  try {
    const prompt = buildPracticeQuestionsPrompt(questionParams);
    return await callModelWithSchema(prompt, practiceQuestionsSchema);
  } catch (error) {
    console.error('Error generating practice questions:', error.message);
    return {
      questions: [
        {
          id: "fallback_1",
          question: `What is the core idea of ${questionParams.weakConcept}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: "Fallback question generated due to service error."
        }
      ]
    };
  }
};

export const askGeneralQuestion = async ({ question, grade }) => {
  const cacheKey = `${question.trim().toLowerCase()}_${grade}`;
  
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }

  try {
    const prompt = buildGeneralQuestionPrompt({ question, grade });
    const result = await callModelWithSchema(prompt, generalQuestionSchema);
    responseCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error answering question:', error.message);
    return {
      question,
      answer: "The AI service encountered a temporary network issue. Please try asking your question again.",
      visualDiagram: [],
      example: "N/A",
      tip: "Please re-run your request."
    };
  }
};