const { getUserProgress: getUserProgressService, getTopicProgress: getTopicProgressService } = require('../services/progressService');

function handleError(res, error) {
  return res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Progress request failed' });
}

function getUserProgress(req, res) {
  return getUserProgressService(req.user._id)
    .then(({ summary, progress }) => res.status(200).json({ success: true, summary, progress }))
    .catch((error) => handleError(res, error));
}

function getTopicProgress(req, res) {
  return getTopicProgressService({ userId: req.user._id, topic: req.params.topic })
    .then((progress) => res.status(200).json({ success: true, topic: req.params.topic, progress }))
    .catch((error) => handleError(res, error));
}

module.exports = { getUserProgress, getTopicProgress };
