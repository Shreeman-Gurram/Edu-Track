const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const {
  generateLearningPath,
  getLearningPath,
  getNextLearningItem,
} = require('../controllers/learningController');

const router = express.Router();

// Generate/update learning path from an assessment result
router.post('/generate', protect, generateLearningPath);

// Get the next recommended learning item
router.get('/next', protect, getNextLearningItem);

// Get the current learning path
router.get('/', protect, getLearningPath);

module.exports = router;