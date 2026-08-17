const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getScholarships } = require('../controllers/scholarshipController');

const router = express.Router();

router.get('/', protect, getScholarships);

module.exports = router;
