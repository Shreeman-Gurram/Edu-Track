const buildAdaptiveExplanationPrompt = ({ studentGrade, subject, topic, weakConcept, attempts, pastMistakes }) => {
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

const buildPracticeQuestionsPrompt = ({ studentGrade, subject, topic, weakConcept, count = 3 }) => {
  return `
Generate ${count} multiple-choice questions for a Grade ${studentGrade || 6} student on: "${weakConcept}" in ${subject || 'General Studies'}.
Keep questions and options concise.
`;
};

const buildGeneralQuestionPrompt = ({ question, grade = 6 }) => {
  return `
You are a friendly AI Tutor for Grade ${grade} level.
Question: "${question}"

Instructions:
1. Answer: Clear and direct explanation (2-3 sentences).
2. Visual Diagrams: If the user asks for a diagram, flowchart, or visual explanation, generate a simple ASCII art flowchart (5-8 lines max) as string elements in "visualDiagram". If no diagram is requested, return [].
3. Do NOT include unescaped quote marks (") inside array strings.
`;
};

const buildAdaptiveTutorPrompt = ({ grade, subject, topic, concept, score, priority, trend }) => {
  let levelInstruction;

  if (score < 40) {
    levelInstruction = `The student's score is very low (${score}%). Start from fundamentals. Use simple, everyday language. Explain step-by-step. Explain the core idea first. Give one simple example. Do NOT assume strong prerequisite knowledge.`;
  } else if (score < 60) {
    levelInstruction = `The student's score is moderate-low (${score}%). Explain the concept clearly. Focus on likely mistakes students make. Give a worked example. Give simple practice questions.`;
  } else if (score < 80) {
    levelInstruction = `The student's score is moderate-high (${score}%). Give a concise explanation. Focus on common mistakes. Give a moderate-difficulty example. Give slightly harder practice questions.`;
  } else {
    levelInstruction = `The student's score is high (${score}%). Keep the explanation concise. Focus on deeper understanding and edge cases. Give a more challenging example. Suggest harder practice questions.`;
  }

  const trendNote = trend === 'declining'
    ? 'The student\'s performance is declining — reinforce core understanding.'
    : trend === 'improving'
      ? 'The student is improving — build on their momentum.'
      : '';

  return `
You are a personalized AI tutor for a Grade ${grade || 10} student.
Subject: ${subject || 'General Studies'}
Topic: ${topic || 'General Topic'}
Concept: ${concept}
Current Score: ${score}%
Priority: ${priority || 'medium'}
Trend: ${(trend || 'first_attempt').replace(/_/g, ' ')}

${levelInstruction}
${trendNote}

Provide:
1. "explanation": A brief, personalized explanation of "${concept}" adapted to the student's level (2-4 sentences max).
2. "example": An object with "question" (a worked example problem) and "solution" (the step-by-step solution).
3. "practice": An array of exactly 2 practice questions. Each must have "question", "answer", and "explanation" fields. Include the full answer and a short explanation for each.

Keep everything concise and focused. This is a learning section, not a full lesson.
`;
};

module.exports = {
  buildAdaptiveExplanationPrompt,
  buildPracticeQuestionsPrompt,
  buildGeneralQuestionPrompt,
  buildAdaptiveTutorPrompt
};