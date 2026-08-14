const mongoose = require('mongoose');
const Result = require('../models/Result');
const LearningPath = require('../models/LearningPath');

function error(message, statusCode) { const e = new Error(message); e.statusCode = statusCode; return e; }
function levelFor(percentage) {
  if (percentage < 40) return 'beginner';
  if (percentage < 60) return 'needs_improvement';
  if (percentage < 80) return 'practice';
  return 'strong';
}
function priorityFor(percentage) {
  if (percentage < 60) return 'high';
  if (percentage < 80) return 'medium';
  return 'low';
}

function actionFor(percentage) {
  if (percentage < 40) {
    return 'Relearn the concept and practice basic questions';
  }

  if (percentage < 60) {
    return 'Review the concept and complete targeted practice';
  }

  if (percentage < 80) {
    return 'Complete additional practice questions';
  }

  return 'Move to the next concept and try challenge questions';
}

async function getOwnedResult(resultId, userId) {
  if (!mongoose.Types.ObjectId.isValid(resultId)) throw error('Invalid result ID', 400);
  const result = await Result.findOne({ _id: resultId, user: userId }).populate('assessment', 'grade subject topic').populate('answers.question', 'topic concept difficulty');
  if (!result) throw error('Result not found', 404);
  return result;
}

function conceptPerformance(result) {
  const stats = {};

  const assessmentTopic =
    result.assessment?.topic || 'General';

  result.answers.forEach((answer) => {
    const question = answer.question;

    if (!question) return;

    const concept =
      question.concept ||
      question.topic ||
      'General';

    if (!stats[concept]) {
      stats[concept] = {
        topic: question.topic || assessmentTopic,
        correct: 0,
        total: 0,
        difficulty: question.difficulty || 'medium',
      };
    }

    stats[concept].total += 1;

    if (answer.correct) {
      stats[concept].correct += 1;
    }
  });

  return Object.entries(stats).map(([concept, value]) => ({
    ...value,
    concept,
    percentage: Number(
      ((value.correct / value.total) * 100).toFixed(2)
    ),
    level: levelFor(
      (value.correct / value.total) * 100
    ),
  }));
}

function buildItems(result) {
  return conceptPerformance(result)
    .sort((a, b) => a.percentage - b.percentage)
    .map((item) => ({
      topic: item.topic,
      concept: item.concept,
      priority: priorityFor(item.percentage),
      status: 'not_started',
      recommendedAction: actionFor(item.percentage),
    }));
}

function adaptLearningItems(previousItems, newItems) {
  const previousMap = new Map(
    previousItems.map((item) => [
      `${item.topic}::${item.concept}`,
      item,
    ])
  );

  return newItems.map((newItem) => {
    const key = `${newItem.topic}::${newItem.concept}`;
    const previousItem = previousMap.get(key);

    if (!previousItem) {
      return newItem;
    }

    return {
      ...newItem,
      status: previousItem.status,
    };
  });
}

async function generateLearningPath({ resultId, userId }) {
  const result = await getOwnedResult(resultId, userId);
  const newItems = buildItems(result);
  const existingPath = await getLearningPath(userId);
  const items = existingPath
    ? adaptLearningItems(existingPath.items || [], newItems)
    : newItems;
  const learningPath = await LearningPath.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        items,
        status: 'active',
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
  return learningPath;
}

async function getLearningPath(userId) {
  return LearningPath.findOne({ user: userId, status: 'active' });
}

function getPriorityRank(priority) {
  if (priority === 'high') return 1;
  if (priority === 'medium') return 2;
  return 3;
}

async function getNextLearningItem(userId) {
  const path = await getLearningPath(userId);
  if (!path || !path.items.length) {
    return null;
  }
  const incompleteItems = path.items.filter(
    (item) => item.status !== 'completed'
  );
  if (!incompleteItems.length) {
    return null;
  }
  return [...incompleteItems].sort(
    (a, b) => getPriorityRank(a.priority) - getPriorityRank(b.priority)
  )[0];
}

module.exports = { generateLearningPath, getLearningPath, getNextLearningItem, getOwnedResult, conceptPerformance, levelFor, priorityFor, actionFor, adaptLearningItems };
