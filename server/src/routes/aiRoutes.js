const { Router } = require('express');
const { 
  handleGetExplanation, 
  handleGeneratePractice, 
  handleAskQuestion,
  handleAdaptiveTutor 
} = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = Router();

router.post('/explain', handleGetExplanation);
router.post('/generate-practice', handleGeneratePractice);
router.post('/ask', handleAskQuestion);
router.post('/adaptive-tutor', protect, handleAdaptiveTutor);

module.exports = router;