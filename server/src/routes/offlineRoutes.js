const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getLearningPackage, syncOfflineActivity } = require('../controllers/offlineController');

const router = express.Router();
router.get('/package', protect, getLearningPackage);
router.post('/sync', protect, syncOfflineActivity);
module.exports = router;
