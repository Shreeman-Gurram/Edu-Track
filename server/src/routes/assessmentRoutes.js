const express = require('express');

const {
  getAssessments,
  getAssessmentById,
  submitAssessment,
  createQuestion,
  getQuestions,
  createAssessment,
  getAdminAssessments,
  getSubjectCatalog,
} = require('../controllers/assessmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/questions', protect, adminOnly, createQuestion);
router.get('/questions', protect, adminOnly, getQuestions);
router.post('/', protect, adminOnly, createAssessment);
router.get('/admin', protect, adminOnly, getAdminAssessments);

// Subject catalog — must be declared before /:id
router.get('/subjects', protect, getSubjectCatalog);

router.get('/', protect, getAssessments);
router.get('/:id', protect, getAssessmentById);
router.post('/:id/submit', protect, submitAssessment);

module.exports = router;
