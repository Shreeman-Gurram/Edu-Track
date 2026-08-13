const OpenAI = require('openai');
const User = require('../models/User');
const { getOwnedResult, conceptPerformance } = require('./learningService');

function error(message, statusCode) { const e = new Error(message); e.statusCode = statusCode; return e; }
function parseJson(content) { try { return JSON.parse(content.replace(/^```json\s*|\s*```$/g, '')); } catch (_) { throw error('AI returned a malformed response', 502); } }
async function contextFor({ userId, resultId, topic, concept }) {
  const [user, result] = await Promise.all([User.findById(userId).select('grade'), getOwnedResult(resultId, userId)]);
  if (!user) throw error('User not found', 401);
  const concepts = conceptPerformance(result);
  const selected = concepts.find((entry) => entry.concept.toLowerCase() === String(concept || '').toLowerCase()) || concepts.find((entry) => entry.topic.toLowerCase() === String(topic || '').toLowerCase());
  if (!selected) throw error('The requested topic or concept is not present in this result', 400);
  return { grade: user.grade || result.assessment.grade, subject: result.assessment.subject, topic: topic || selected.topic, concept: concept || selected.concept, performance: selected.percentage, level: selected.level, weakConcepts: result.weakConcepts, recentMistakes: selected.total - selected.correct };
}
async function ask(messages) {
  if (!process.env.AI_API_KEY) throw error('AI service is not configured', 503);
  try {
    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    const response = await client.chat.completions.create({ model: process.env.AI_MODEL || 'gpt-4.1-mini', messages, response_format: { type: 'json_object' }, temperature: 0.4 });
    return parseJson(response.choices[0] && response.choices[0].message.content || '');
  } catch (e) { if (e.statusCode) throw e; throw error('AI service could not complete the request', 502); }
}
function instructions(context) { return `Student context: grade ${context.grade}, subject ${context.subject}, topic ${context.topic}, concept ${context.concept}, performance ${context.performance}%, adaptive level ${context.level}, recent mistakes ${context.recentMistakes}, weak concepts ${context.weakConcepts.join(', ')}. Adapt exactly to this backend-determined level. Never mention private data.`; }
async function generateExplanation({ userId, resultId, topic, concept, studentQuestion }) {
  if (!studentQuestion || !String(studentQuestion).trim()) throw error('studentQuestion is required', 400);
  const context = await contextFor({ userId, resultId, topic, concept });
  const data = await ask([{ role: 'system', content: `You are a supportive tutor. ${instructions(context)} Return JSON only with explanation (string), example (string), keyPoints (array of strings), practicePrompt (string). For beginner use simple language, analogy and steps; basic use worked example; practice concise moderate examples; advanced deeper explanation.` }, { role: 'user', content: String(studentQuestion).trim() }]);
  if (!data.explanation || !data.example || !Array.isArray(data.keyPoints) || !data.practicePrompt) throw error('AI returned an incomplete explanation', 502);
  return data;
}
async function generatePractice({ userId, resultId, topic, concept, count }) {
  const requested = Number(count || 3);
  if (!Number.isInteger(requested) || requested < 1 || requested > 10) throw error('count must be an integer between 1 and 10', 400);
  const context = await contextFor({ userId, resultId, topic, concept });
  const data = await ask([{ role: 'system', content: `You create multiple-choice educational practice. ${instructions(context)} Return JSON only as {"questions":[{"questionText":"","options":["","","",""],"correctAnswer":"","explanation":"","difficulty":"easy|medium|hard"}]}. Produce exactly ${requested} questions, with correctAnswer matching one option.` }, { role: 'user', content: 'Create the practice questions now.' }]);
  if (!Array.isArray(data.questions) || data.questions.length !== requested || data.questions.some((q) => !q.questionText || !Array.isArray(q.options) || !q.options.includes(q.correctAnswer))) throw error('AI returned malformed practice questions', 502);
  return data.questions;
}
module.exports = { generateExplanation, generatePractice };
