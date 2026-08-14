const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getUserProgress, getTopicProgress } = require('../controllers/progressController');

const router = express.Router();

router.get('/', protect, getUserProgress);
router.get('/:topic', protect, getTopicProgress);

module.exports = router;
