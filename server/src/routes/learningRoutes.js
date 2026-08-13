const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { generateLearningPath, getLearningPath, getNextLearningItem } = require('../controllers/learningController');
const router = express.Router();
router.post('/generate', protect, generateLearningPath);
router.get('/next', protect, getNextLearningItem);
router.get('/', protect, getLearningPath);
module.exports = router;
