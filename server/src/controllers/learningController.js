const learningService = require('../services/learningService');
function respond(res, promise, key) { return promise.then((data) => res.json({ success: true, [key]: data })).catch((e) => res.status(e.statusCode || 500).json({ success: false, message: e.message || 'Learning path request failed' })); }
function generateLearningPath(req, res) { return respond(res, learningService.generateLearningPath({ resultId: (req.body || {}).resultId, userId: req.user._id }), 'learningPath'); }
function getLearningPath(req, res) { return respond(res, learningService.getLearningPath(req.user._id), 'learningPath'); }
function getNextLearningItem(req, res) { return respond(res, learningService.getNextLearningItem(req.user._id), 'item'); }
module.exports = { generateLearningPath, getLearningPath, getNextLearningItem };
