const { getEligibleScholarships } = require('../services/scholarshipService');

async function getScholarships(req, res) {
  try {
    const scholarships = await getEligibleScholarships(req.user.grade);
    return res.status(200).json({ success: true, scholarships });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Unable to load scholarships',
    });
  }
}

module.exports = { getScholarships };
