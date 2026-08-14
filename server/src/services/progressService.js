const Progress = require('../models/Progress');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function masteryFor(percentage) {
  if (percentage < 60) return 'weak';
  if (percentage < 80) return 'needs_practice';
  return 'strong';
}

function toPercentage(correct, total) {
  return total ? Number(((correct / total) * 100).toFixed(2)) : 0;
}

function buildConceptPerformances(result) {
  const performances = new Map();
  const fallbackTopic = result.assessment && result.assessment.topic ? result.assessment.topic : 'General';

  (result.answers || []).forEach((answer) => {
    const question = answer.question;
    const topic = (question && question.topic) || fallbackTopic;
    const concept = (question && (question.concept || question.topic)) || topic;
    const subject = (question && question.subject) || (result.assessment && result.assessment.subject) || 'General';
    const key = `${subject}::${topic}::${concept}`;
    const current = performances.get(key) || { subject, topic, concept, correct: 0, total: 0 };
    current.total += 1;
    if (answer.correct) current.correct += 1;
    performances.set(key, current);
  });

  // A legacy/incomplete result may not have populated answer questions. Its saved
  // topic performance can still produce a topic-level progress record.
  if (!performances.size) {
    Object.entries(result.topicPerformance || {}).forEach(([topic, performance]) => {
      const subject = (result.assessment && result.assessment.subject) || 'General';
      performances.set(`${subject}::${topic}::${topic}`, {
        subject,
        topic,
        concept: topic,
        correct: Number(performance.correct) || 0,
        total: Number(performance.total) || 0,
      });
    });
  }

  return [...performances.values()].map((item) => ({
    ...item,
    percentage: toPercentage(item.correct, item.total),
  }));
}

async function updateProgressFromResult(result) {
  if (!result || !result.user) throw createError('A completed result is required to update progress', 400);

  const populatedResult = await result.populate([
    { path: 'assessment', select: 'subject topic' },
    { path: 'answers.question', select: 'subject topic concept' },
  ]);
  const performances = buildConceptPerformances(populatedResult);

  await Promise.all(performances.map((item) => Progress.findOneAndUpdate(
    { user: populatedResult.user, subject: item.subject, topic: item.topic, concept: item.concept },
    {
      $set: {
        score: item.percentage,
        completionPercentage: item.percentage,
        masteryLevel: masteryFor(item.percentage),
      },
      $setOnInsert: { user: populatedResult.user, subject: item.subject, topic: item.topic, concept: item.concept },
    },
    { new: true, upsert: true, runValidators: true }
  )));

  return performances;
}

function formatProgress(record) {
  return {
    subject: record.subject,
    topic: record.topic,
    concept: record.concept,
    score: record.score,
    completionPercentage: record.completionPercentage,
    masteryLevel: record.masteryLevel,
    updatedAt: record.updatedAt,
  };
}

function buildSummary(records) {
  const topicStats = new Map();
  records.forEach((record) => {
    const key = `${record.subject}::${record.topic}`;
    const current = topicStats.get(key) || { total: 0, count: 0 };
    current.total += record.completionPercentage;
    current.count += 1;
    topicStats.set(key, current);
  });
  const topicLevels = [...topicStats.values()].map((topic) => masteryFor(topic.total / topic.count));
  const overallPercentage = records.length
    ? Number((records.reduce((total, record) => total + record.completionPercentage, 0) / records.length).toFixed(2))
    : 0;
  return {
    overallPercentage,
    strongTopics: topicLevels.filter((level) => level === 'strong').length,
    weakTopics: topicLevels.filter((level) => level === 'weak').length,
    totalTopics: topicLevels.length,
  };
}

async function getUserProgress(userId) {
  const records = await Progress.find({ user: userId }).sort({ subject: 1, topic: 1, concept: 1 });
  return { summary: buildSummary(records), progress: records.map(formatProgress) };
}

async function getTopicProgress({ userId, topic }) {
  const normalizedTopic = String(topic || '').trim();
  if (!normalizedTopic) throw createError('Topic is required', 400);
  const records = await Progress.find({ user: userId, topic: normalizedTopic }).sort({ concept: 1 });
  return records.map(formatProgress);
}

module.exports = { updateProgressFromResult, getUserProgress, getTopicProgress, masteryFor };
