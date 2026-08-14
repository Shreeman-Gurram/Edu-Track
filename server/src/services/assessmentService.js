const mongoose = require('mongoose');

require('../models/Question');
const Assessment = require('../models/Assessment');
const Result = require('../models/Result');
const User = require('../models/User');
const Question = require('../models/Question');
const { updateProgressFromResult } = require('./progressService');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toPercentage(correct, total) {
  if (!total) {
    return 0;
  }

  return Number(((correct / total) * 100).toFixed(2));
}

function normalizeAnswer(value) {
  return String(value || '').trim().toUpperCase();
}

function formatAssessmentListItem(assessment) {
  return {
    id: assessment._id.toString(),
    title: assessment.title,
    grade: assessment.grade,
    subject: assessment.subject,
    topic: assessment.topic,
    questionCount: Array.isArray(assessment.questions) ? assessment.questions.length : 0,
    createdAt: assessment.createdAt,
  };
}

function formatQuestionForStudent(question) {
  return {
    id: question._id.toString(),
    questionText: question.questionText,
    grade: question.grade,
    subject: question.subject,
    topic: question.topic,
    concept: question.concept,
    options: question.options,
    difficulty: question.difficulty,
  };
}

function buildTopicPerformance(questions, answerLookup) {
  const topicStats = {};

  questions.forEach((question) => {
    const topicKey = (question.topic || 'General').trim();

    if (!topicStats[topicKey]) {
      topicStats[topicKey] = { correct: 0, total: 0 };
    }

    topicStats[topicKey].total += 1;

    const submitted = answerLookup.get(question._id.toString());
    const isCorrect = normalizeAnswer(submitted) === normalizeAnswer(question.correctAnswer);

    if (isCorrect) {
      topicStats[topicKey].correct += 1;
    }
  });

  const topicPerformance = {};

  Object.keys(topicStats).forEach((topicKey) => {
    topicPerformance[topicKey] = {
      correct: topicStats[topicKey].correct,
      total: topicStats[topicKey].total,
      percentage: toPercentage(topicStats[topicKey].correct, topicStats[topicKey].total),
    };
  });

  return topicPerformance;
}

function buildWeakConcepts(questions, answerLookup) {
  const conceptStats = {};

  questions.forEach((question) => {
    const conceptKey = (question.concept || question.topic || 'General').trim();

    if (!conceptStats[conceptKey]) {
      conceptStats[conceptKey] = { correct: 0, total: 0 };
    }

    conceptStats[conceptKey].total += 1;

    const submitted = answerLookup.get(question._id.toString());
    const isCorrect = normalizeAnswer(submitted) === normalizeAnswer(question.correctAnswer);

    if (isCorrect) {
      conceptStats[conceptKey].correct += 1;
    }
  });

  return Object.keys(conceptStats).filter((conceptKey) => {
    const percentage = toPercentage(conceptStats[conceptKey].correct, conceptStats[conceptKey].total);
    return percentage < 60;
  });
}

async function getAssessments({ userId, role }) {
  let filter = {};

  if (role === 'student') {
    const user = await User.findById(userId);

    if (!user) {
      throw createError('User no longer exists', 401);
    }

    if (user.grade) {
      filter = { grade: user.grade };
    }
  }

  const assessments = await Assessment.find(filter)
    .select('title grade subject topic questions createdAt')
    .sort({ createdAt: -1 });

  return assessments.map(formatAssessmentListItem);
}

async function getAssessmentById({ assessmentId, userId, role }) {
  if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
    throw createError('Invalid assessment ID', 400);
  }

  const assessment = await Assessment.findById(assessmentId).populate({
    path: 'questions',
    select: '-correctAnswer',
  });

  if (!assessment) {
    throw createError('Assessment not found', 404);
  }

  if (role === 'student') {
    const user = await User.findById(userId);

    if (!user) {
      throw createError('User no longer exists', 401);
    }

    if (user.grade && assessment.grade && user.grade !== assessment.grade) {
      throw createError('You are not allowed to access this assessment', 403);
    }
  }

  return {
    id: assessment._id.toString(),
    title: assessment.title,
    grade: assessment.grade,
    subject: assessment.subject,
    topic: assessment.topic,
    createdAt: assessment.createdAt,
    questions: (assessment.questions || []).map(formatQuestionForStudent),
  };
}

async function submitAssessment({ assessmentId, answers, userId, role, offlineActivityId, completedAt }) {
  if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
    throw createError('Invalid assessment ID', 400);
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    throw createError('Answers are required', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createError('User no longer exists', 401);
  }

  const assessment = await Assessment.findById(assessmentId).populate({
    path: 'questions',
    select: 'questionText topic concept correctAnswer options difficulty grade subject',
  });

  if (!assessment) {
    throw createError('Assessment not found', 404);
  }

  if (role === 'student' && user.grade && assessment.grade && user.grade !== assessment.grade) {
    throw createError('You are not allowed to submit this assessment', 403);
  }

  const questions = assessment.questions || [];
  if (!questions.length) {
    throw createError('Assessment has no questions', 400);
  }

  const missingQuestionDoc = questions.some((question) => !question || !question._id);
  if (missingQuestionDoc) {
    throw createError('One or more questions were not found', 404);
  }

  const assessmentQuestionIdSet = new Set(questions.map((question) => question._id.toString()));
  const submittedQuestionIdSet = new Set();
  const answerLookup = new Map();

  answers.forEach((item) => {
    if (!item || !item.questionId) {
      throw createError('Each answer must include questionId', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(item.questionId)) {
      throw createError('One or more question IDs are invalid', 400);
    }

    if (submittedQuestionIdSet.has(item.questionId)) {
      throw createError('Duplicate question IDs are not allowed', 400);
    }

    if (typeof item.answer !== 'string' || !item.answer.trim()) {
      throw createError('Each answer must include a non-empty answer value', 400);
    }

    submittedQuestionIdSet.add(item.questionId);
    answerLookup.set(item.questionId, item.answer);
  });

  const hasInvalidQuestionId = [...submittedQuestionIdSet].some(
    (questionId) => !assessmentQuestionIdSet.has(questionId)
  );

  if (hasInvalidQuestionId) {
    throw createError('One or more submitted questions do not belong to this assessment', 400);
  }

  if (submittedQuestionIdSet.size !== assessmentQuestionIdSet.size) {
    throw createError('Missing answers for one or more questions', 400);
  }

  let score = 0;
  const answerDetails = questions.map((question) => {
    const questionId = question._id.toString();
    const selectedAnswer = answerLookup.get(questionId);
    const isCorrect = normalizeAnswer(selectedAnswer) === normalizeAnswer(question.correctAnswer);

    if (isCorrect) {
      score += 1;
    }

    return {
      question: question._id,
      selected: selectedAnswer,
      correct: isCorrect,
    };
  });

  const totalQuestions = questions.length;
  const percentage = toPercentage(score, totalQuestions);
  const topicPerformance = buildTopicPerformance(questions, answerLookup);
  const weakConcepts = buildWeakConcepts(questions, answerLookup);

  const savedResult = await Result.create({
    user: user._id,
    assessment: assessment._id,
    score,
    totalQuestions,
    answers: answerDetails,
    topicPerformance,
    weakConcepts,
    offlineActivityId,
    completedAt: completedAt || undefined,
  });

  await updateProgressFromResult(savedResult);

  return {
    id: savedResult._id.toString(),
    score,
    totalQuestions,
    percentage,
    topicPerformance,
    weakConcepts,
    completedAt: savedResult.completedAt,
  };
}

function normalizeOptions(options) {
  if (!Array.isArray(options) || options.length < 2) {
    throw createError('At least two options are required', 400);
  }
  return options.map((option) => {
    if (typeof option === 'string' && option.trim()) return { text: option.trim(), value: option.trim() };
    if (option && typeof option.text === 'string' && option.text.trim()) {
      return { text: option.text.trim(), value: (option.value || option.text).trim() };
    }
    throw createError('Each option must be a non-empty string or option object', 400);
  });
}

async function createQuestion(payload) {
  const fields = ['questionText', 'grade', 'subject', 'topic', 'concept', 'correctAnswer', 'difficulty'];
  fields.forEach((field) => { if (!payload[field] || !String(payload[field]).trim()) throw createError(`${field} is required`, 400); });
  if (!['easy', 'medium', 'hard'].includes(payload.difficulty)) throw createError('Difficulty must be easy, medium, or hard', 400);
  const options = normalizeOptions(payload.options);
  const correctAnswer = String(payload.correctAnswer).trim();
  if (!options.some((option) => normalizeAnswer(option.value) === normalizeAnswer(correctAnswer) || normalizeAnswer(option.text) === normalizeAnswer(correctAnswer))) {
    throw createError('correctAnswer must belong to options', 400);
  }
  return Question.create({ ...payload, questionText: payload.questionText.trim(), options, correctAnswer });
}

async function getQuestions(filters) {
  const filter = {};
  ['grade', 'subject', 'topic', 'concept', 'difficulty'].forEach((key) => { if (filters[key]) filter[key] = filters[key]; });
  return Question.find(filter).sort({ createdAt: -1 });
}

async function createAssessment(payload) {
  const { title, grade, subject, topic, questions } = payload;
  if (!title || !grade || !subject || !Array.isArray(questions) || !questions.length) throw createError('title, grade, subject, and questions are required', 400);
  if (questions.some((id) => !mongoose.Types.ObjectId.isValid(id))) throw createError('One or more question IDs are invalid', 400);
  const uniqueIds = [...new Set(questions.map(String))];
  if (uniqueIds.length !== questions.length) throw createError('Duplicate question IDs are not allowed', 400);
  const found = await Question.countDocuments({ _id: { $in: uniqueIds } });
  if (found !== uniqueIds.length) throw createError('One or more questions were not found', 404);
  return Assessment.create({ title: title.trim(), grade: String(grade).trim(), subject: subject.trim(), topic: (topic || '').trim(), questions: uniqueIds });
}

async function getAdminAssessments() {
  return Assessment.find().populate({ path: 'questions', select: 'questionText grade subject topic concept difficulty options' }).sort({ createdAt: -1 });
}

module.exports = {
  getAssessments,
  getAssessmentById,
  submitAssessment,
  createQuestion,
  getQuestions,
  createAssessment,
  getAdminAssessments,
};
