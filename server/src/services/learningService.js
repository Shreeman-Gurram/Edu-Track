const mongoose = require('mongoose');
const Result = require('../models/Result');
const LearningPath = require('../models/LearningPath');

function error(message, statusCode) {
  const e = new Error(message);
  e.statusCode = statusCode;
  return e;
}

function levelFor(percentage) {
  if (percentage < 40) return 'beginner';
  if (percentage < 60) return 'needs_improvement';
  if (percentage < 80) return 'practice';
  return 'strong';
}

function priorityFor(percentage, trend) {
  // A decline gets higher priority even if the latest score
  // is not technically in the weak range.
  if (trend === 'declining') return 'high';

  if (percentage < 60) return 'high';
  if (percentage < 80) return 'medium';

  return 'low';
}

function actionFor(percentage, trend) {
  if (trend === 'declining') {
    return 'Review the concept and practice again';
  }

  if (trend === 'improving') {
    if (percentage >= 80) {
      return 'Continue with challenge questions and move to the next concept';
    }

    return 'Continue targeted practice to strengthen the improvement';
  }

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

function getTrend(previousPercentage, latestPercentage) {
  if (previousPercentage === null) {
    return 'first_attempt';
  }

  if (latestPercentage > previousPercentage) {
    return 'improving';
  }

  if (latestPercentage < previousPercentage) {
    return 'declining';
  }

  return 'unchanged';
}

async function getOwnedResult(resultId, userId) {
  if (!mongoose.Types.ObjectId.isValid(resultId)) {
    throw error('Invalid result ID', 400);
  }

  const result = await Result.findOne({
    _id: resultId,
    user: userId,
  })
    .populate('assessment', 'grade subject topic')
    .populate(
      'answers.question',
      'topic concept difficulty'
    );

  if (!result) {
    throw error('Result not found', 404);
  }

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

  return Object.entries(stats).map(([concept, value]) => {
    const percentage =
      (value.correct / value.total) * 100;

    return {
      ...value,
      concept,
      percentage: Number(percentage.toFixed(2)),
      level: levelFor(percentage),
    };
  });
}

/*
 * Get the student's previous performance for each concept.
 *
 * The current/latest result is excluded.
 * Results are checked from newest to oldest.
 * The first occurrence of a concept is the previous
 * performance we compare against.
 */
async function getPreviousConceptPerformance({
  userId,
  latestResultId,
}) {
  const previousResults = await Result.find({
    user: userId,
    _id: { $ne: latestResultId },
  })
    .sort({ completedAt: -1, createdAt: -1 })
    .populate(
      'assessment',
      'subject topic'
    )
    .populate(
      'answers.question',
      'subject topic concept difficulty'
    );

  const previousPerformance = {};

  for (const result of previousResults) {
    const performances = conceptPerformance(result);

    for (const item of performances) {
      const subject =
        result.assessment?.subject || 'General';

      const key =
        `${subject}::${item.topic}::${item.concept}`;

      if (!previousPerformance[key]) {
        previousPerformance[key] = {
          percentage: item.percentage,
          resultId: result._id,
        };
      }
    }
  }

  return previousPerformance;
}

async function buildAdaptiveItems(result, previousPerformance) {
  const latestPerformance = conceptPerformance(result);

  return latestPerformance
    .map((item) => {
      const subject =
        result.assessment?.subject || 'General';

      const key =
        `${subject}::${item.topic}::${item.concept}`;

      const previous =
        previousPerformance[key];

      const previousPercentage = previous
        ? previous.percentage
        : null;

      const trend = getTrend(
        previousPercentage,
        item.percentage
      );

      return {
        topic: item.topic,
        concept: item.concept,
        difficulty: item.difficulty,

        // Latest performance is the main factor.
        priority: priorityFor(
          item.percentage,
          trend
        ),

        status: 'not_started',

        recommendedAction: actionFor(
          item.percentage,
          trend
        ),

        // These fields make the adaptive decision
        // visible to the frontend.
        latestScore: item.percentage,
        previousScore: previousPercentage,
        trend,
      };
    })
    .sort((a, b) => {
      const priorityRank = {
        high: 1,
        medium: 2,
        low: 3,
      };

      return (
        priorityRank[a.priority] -
        priorityRank[b.priority]
      );
    });
}

function adaptLearningItems(previousItems, newItems) {
  const previousMap = new Map(
    previousItems.map((item) => [
      `${item.topic}::${item.concept}`,
      item,
    ])
  );

  return newItems.map((newItem) => {
    const key =
      `${newItem.topic}::${newItem.concept}`;

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

async function generateLearningPath({
  resultId,
  userId,
}) {
  const result = await getOwnedResult(
    resultId,
    userId
  );

  // Get the student's previous assessment history.
  const previousPerformance =
    await getPreviousConceptPerformance({
      userId,
      latestResultId: result._id,
    });

  // Use the latest assessment + previous performance
  // to determine whether the student is improving
  // or declining.
  const newItems = await buildAdaptiveItems(
    result,
    previousPerformance
  );

  const existingPath =
    await getLearningPath(userId);

  const items = existingPath
    ? adaptLearningItems(
        existingPath.items || [],
        newItems
      )
    : newItems;

  const learningPath =
    await LearningPath.findOneAndUpdate(
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
  return LearningPath.findOne({
    user: userId,
    status: 'active',
  });
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
    (a, b) =>
      getPriorityRank(a.priority) -
      getPriorityRank(b.priority)
  )[0];
}

module.exports = {
  generateLearningPath,
  getLearningPath,
  getNextLearningItem,
  getOwnedResult,
  conceptPerformance,
  levelFor,
  priorityFor,
  actionFor,
  adaptLearningItems,
  getTrend,
};