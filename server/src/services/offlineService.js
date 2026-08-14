const mongoose = require('mongoose');
const LearningPackage = require('../models/LearningPackage');
const LearningPath = require('../models/LearningPath');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { submitAssessment } = require('./assessmentService');

function createError(message, statusCode) { const error = new Error(message); error.statusCode = statusCode; return error; }

function selectedItems(path) {
  return (path && path.items ? path.items : [])
    .filter((item) => item.status !== 'completed')
    .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]))
    .slice(0, 10);
}

function signature(items) {
  return items.map((item) => `${item.topic}|${item.concept}|${item.priority}|${item.status}`).join('~');
}

function formatQuestion(question) {
  return {
    questionId: question._id.toString(),
    questionText: question.questionText,
    options: question.options,
    topic: question.topic,
    concept: question.concept,
    difficulty: question.difficulty,
  };
}

function formatPackage(learningPackage) {
  return {
    id: learningPackage._id.toString(),
    version: learningPackage.version,
    title: learningPackage.title,
    topics: learningPackage.topics,
    lessons: learningPackage.lessons,
    questions: (learningPackage.questions || []).map(formatQuestion),
  };
}

async function getLearningPackage(userId) {
  const path = await LearningPath.findOne({ user: userId, status: 'active' });
  const items = selectedItems(path);
  const pathSignature = signature(items);
  let learningPackage = await LearningPackage.findOne({ user: userId }).populate({ path: 'questions', select: '-correctAnswer' });

  if (learningPackage && learningPackage.pathSignature === pathSignature) return formatPackage(learningPackage);

  const clauses = items.map((item) => ({ topic: item.topic, concept: item.concept }));
  const questions = clauses.length ? await Question.find({ $or: clauses }).select('-correctAnswer').limit(50) : [];
  const topics = [...new Set(items.map((item) => item.topic))];
  const lessons = items.map((item) => ({ topic: item.topic, concept: item.concept, priority: item.priority, recommendedAction: item.recommendedAction }));
  const update = {
    title: 'My Learning Package', topics, lessons, questions: questions.map((question) => question._id), pathSignature,
  };
  learningPackage = await LearningPackage.findOneAndUpdate(
    { user: userId },
    learningPackage ? { $set: update, $inc: { version: 1 } } : { $set: update, $setOnInsert: { user: userId, version: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate({ path: 'questions', select: '-correctAnswer' });
  return formatPackage(learningPackage);
}

function validateActivity(activity) {
  if (!activity || !activity.activityId || !String(activity.activityId).trim()) throw createError('Each activity requires activityId', 400);
  if (activity.type !== 'quiz_submission') throw createError('Only quiz_submission activities are supported', 400);
  if (!activity.assessmentId || !mongoose.Types.ObjectId.isValid(activity.assessmentId)) throw createError('Invalid assessment ID', 400);
  if (!Array.isArray(activity.answers) || !activity.answers.length) throw createError('Activity answers are required', 400);
  if (activity.completedAt && Number.isNaN(new Date(activity.completedAt).getTime())) throw createError('Invalid completedAt value', 400);
}

async function syncOfflineActivity({ userId, packageVersion, activities }) {
  if (!Number.isInteger(packageVersion) || packageVersion < 1) throw createError('packageVersion must be a positive integer', 400);
  if (!Array.isArray(activities) || !activities.length) throw createError('activities must be a non-empty array', 400);
  const currentPackage = await LearningPackage.findOne({ user: userId }).select('version');
  const synced = [];
  const failed = [];
  const receivedIds = new Set();

  for (const activity of activities) {
    const activityId = activity && activity.activityId;
    try {
      validateActivity(activity);
      if (receivedIds.has(activityId)) throw createError('Duplicate activityId in sync request', 400);
      receivedIds.add(activityId);
      const existing = await Result.findOne({ offlineActivityId: activityId, user: userId }).select('_id');
      if (existing) { synced.push({ activityId, status: 'already_synced', resultId: existing._id.toString() }); continue; }
      const result = await submitAssessment({ assessmentId: activity.assessmentId, answers: activity.answers, userId, role: 'student', offlineActivityId: activityId, completedAt: activity.completedAt ? new Date(activity.completedAt) : undefined });
      synced.push({ activityId, status: 'synced', resultId: result.id });
    } catch (error) {
      if (error && error.code === 11000) {
        const existing = await Result.findOne({ offlineActivityId: activityId, user: userId }).select('_id');
        if (existing) { synced.push({ activityId, status: 'already_synced', resultId: existing._id.toString() }); continue; }
      }
      failed.push({ activityId: activityId || null, status: 'failed', message: error.message || 'Unable to sync activity' });
    }
  }
  return { synced, failed, currentVersion: currentPackage ? currentPackage.version : null, packageOutdated: Boolean(currentPackage && packageVersion < currentPackage.version) };
}

module.exports = { getLearningPackage, syncOfflineActivity };
