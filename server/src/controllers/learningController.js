const learningService = require('../services/learningService');

function handleError(res, error, defaultMessage) {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || defaultMessage,
  });
}

async function generateLearningPath(req, res) {
  try {
    const resultId = req.body?.resultId;

    const learningPath = await learningService.generateLearningPath({
      resultId,
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      learningPath,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Failed to generate learning path'
    );
  }
}

async function getLearningPath(req, res) {
  try {
    const learningPath = await learningService.getLearningPath(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      learningPath,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Failed to retrieve learning path'
    );
  }
}

// Returns all learning paths for the authenticated student.
async function getLearningPaths(req, res) {
  try {
    const learningPaths = await learningService.getLearningPaths(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      learningPaths,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Failed to retrieve learning path history'
    );
  }
}

async function getNextLearningItem(req, res) {
  try {
    const item = await learningService.getNextLearningItem(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Failed to retrieve next learning item'
    );
  }
}

module.exports = {
  generateLearningPath,
  getLearningPath,
  getLearningPaths,
  getNextLearningItem,
};