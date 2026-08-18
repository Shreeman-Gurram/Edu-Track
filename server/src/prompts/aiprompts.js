export const buildAdaptiveExplanationPrompt = ({ studentGrade, subject, topic, weakConcept, attempts, pastMistakes }) => {
  const isRetry = attempts > 1;

  return `
You are a clear AI Tutor for Grade ${studentGrade || 6} students.
Subject: ${subject || 'General Studies'}
Topic: ${topic || 'General Topic'}
Weak Concept: ${weakConcept}
Previous Attempts: ${attempts || 1}
Past Mistakes: ${JSON.stringify(pastMistakes || [])}

Instruction:
${isRetry 
  ? "The student is struggling after multiple attempts. Use simple everyday language." 
  : "Provide a clear, engaging explanation in 2-3 short sentences."
}

Include a clean ASCII diagram or flowchart of 5-8 lines max as string elements in "visualDiagram". Do not use unescaped double quotes inside diagram text.
`;
};

export const buildPracticeQuestionsPrompt = ({ studentGrade, subject, topic, weakConcept, count = 3 }) => {
  return `
Generate ${count} multiple-choice questions for a Grade ${studentGrade || 6} student on: "${weakConcept}" in ${subject || 'General Studies'}.
Keep questions and options concise.
`;
};

export const buildGeneralQuestionPrompt = ({ question, grade = 6 }) => {
  return `
You are a friendly AI Tutor for Grade ${grade} level.
Question: "${question}"

Instructions:
1. Answer: Clear and direct explanation (2-3 sentences).
2. Visual Diagrams: If the user asks for a diagram, flowchart, or visual explanation, generate a simple ASCII art flowchart (5-8 lines max) as string elements in "visualDiagram". If no diagram is requested, return [].
3. Do NOT include unescaped quote marks (") inside array strings.
`;
};