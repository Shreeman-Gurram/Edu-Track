const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { explanation, practice } = require('../controllers/aiController');
const router = express.Router();
router.post('/explanation', protect, explanation);
router.post('/practice', protect, practice);
module.exports = router;
