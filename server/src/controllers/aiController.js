const aiService = require('../services/aiService');
function explanation(req, res) { return aiService.generateExplanation({ ...(req.body || {}), userId: req.user._id }).then((data) => res.json({ success: true, ...data })).catch((e) => res.status(e.statusCode || 500).json({ success: false, message: e.message || 'AI explanation failed' })); }
function practice(req, res) { return aiService.generatePractice({ ...(req.body || {}), userId: req.user._id }).then((questions) => res.json({ success: true, questions })).catch((e) => res.status(e.statusCode || 500).json({ success: false, message: e.message || 'AI practice generation failed' })); }
module.exports = { explanation, practice };
