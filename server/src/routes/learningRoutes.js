const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const {
  generateLearningPath,
  getLearningPath,
  getLearningPaths,
  getNextLearningItem,
} = require('../controllers/learningController');

const router = express.Router();

// Generate a new learning path from an assessment result
router.post('/generate', protect, generateLearningPath);

// Get the next recommended learning item
router.get('/next', protect, getNextLearningItem);

// Get all learning paths for the authenticated student (history)
router.get('/history', protect, getLearningPaths);

// Get the most recent active learning path
router.get('/', protect, getLearningPath);

module.exports = router;