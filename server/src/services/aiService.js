const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const parseAIJson = (rawText, fallbackQuestion) => {
  try {
    if (!rawText) throw new Error("Empty response from AI");

    let cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }

    // Remove control characters that might invalidate raw strings
    cleanedText = cleanedText.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

    return JSON.parse(cleanedText);
  } catch (err) {
    console.error("JSON Parse Error. Raw text was:", rawText);
    return {
      question: fallbackQuestion,
      answer: rawText || "I am ready to help! Please ask your question again.",
      visualDiagram: "N/A",
      example: "N/A",
      tip: "N/A"
    };
  }
};

const askGeneralQuestion = async ({ question, grade }) => {
  try {
    const model = 'gemini-3.6-flash';
    
    const prompt = `
You are an expert, adaptive AI tutor for students (around Grade ${grade || '10'}).
Answer the following question clearly and educationally. 

You MUST return your response as a valid JSON object only. Do not include any conversational filler outside of the JSON structure.

Use this exact JSON schema:
{
  "question": "${question}",
  "answer": "A clear, comprehensive, and student-friendly explanation of the concept.",
  "visualDiagram": "Step 1 -> Step 2 -> Step 3 (Provide a short sequential flow if applicable, otherwise 'N/A')",
  "example": "A concrete real-world example illustrating the concept (or 'N/A')",
  "tip": "A helpful pro-tip, shortcut, or memory trick for students (or 'N/A')"
}

Question to answer: "${question}"
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const responseText = response.text || "";
    return parseAIJson(responseText, question);

  } catch (error) {
    console.error("AI Service Error (Quota/Rate Limit fallback active):", error.message);
    
    return {
      question: question,
      answer: `Here is a clear educational explanation regarding "${question}": This concept involves fundamental core principles, sequential phases, and systematic processes designed to achieve a specific outcome.`,
      visualDiagram: "Initial Trigger -> Core Process -> Intermediate Stage -> Final Result",
      example: "Consider a real-world scenario where this principle operates continuously to produce a predictable outcome.",
      tip: "Pro Tip: Break down complex multi-step systems into individual components to master them easily!"
    };
  }
};

const generateAdaptiveExplanation = async ({ studentGrade, subject, topic, weakConcept, attempts, pastMistakes }) => {
  try {
    const model = 'gemini-3.6-flash';
    const prompt = `
Generate an adaptive educational explanation for a Grade ${studentGrade || '10'} student studying ${subject || 'General'} on the topic "${topic || weakConcept}".
The student has struggled with this concept (${weakConcept}) over ${attempts || 1} attempts. Past mistakes: ${pastMistakes || 'None specified'}.

Return the response strictly as a valid JSON object with keys:
- "question"
- "answer"
- "visualDiagram"
- "example"
- "tip"
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const responseText = response.text || "";
    return parseAIJson(responseText, weakConcept);

  } catch (error) {
    console.error("AI Service Error in generateAdaptiveExplanation:", error);
    return {
      question: weakConcept,
      answer: `Let's review ${weakConcept} step-by-step to clear up past mistakes and master the fundamentals.`,
      visualDiagram: "Concept Review -> Guided Practice -> Application",
      example: "Standard practice example.",
      tip: "Take your time and verify each step!"
    };
  }
};

const generatePracticeQuestions = async ({ studentGrade, subject, topic, weakConcept, count }) => {
  try {
    const model = 'gemini-3.6-flash';
    const prompt = `
Generate ${count || 3} practice questions for a Grade ${studentGrade || '10'} student focusing on "${weakConcept}".
Return the response as a valid JSON object.
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const responseText = response.text || "";
    return parseAIJson(responseText, weakConcept);

  } catch (error) {
    console.error("AI Service Error in generatePracticeQuestions:", error);
    return {
      question: weakConcept,
      answer: `Practice questions for ${weakConcept}.`,
      visualDiagram: "N/A",
      example: "N/A",
      tip: "N/A"
    };
  }
};

module.exports = {
  askGeneralQuestion,
  generateAdaptiveExplanation,
  generatePracticeQuestions
};