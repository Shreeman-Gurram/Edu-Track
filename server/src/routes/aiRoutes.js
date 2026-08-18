const { Router } = require('express');
const { 
  handleGetExplanation, 
  handleGeneratePractice, 
  handleAskQuestion 
} = require('../controllers/aiController.js');

const router = Router();

router.post('/explain', handleGetExplanation);
router.post('/generate-practice', handleGeneratePractice);
router.post('/ask', handleAskQuestion);

module.exports = router;