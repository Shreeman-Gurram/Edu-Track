const { getScholarshipsForUser } = require('../services/scholarshipService');

async function getScholarships(req, res) {
  try {
    const scholarships = await getScholarshipsForUser(req.user._id);
    return res.status(200).json({ success: true, scholarships });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get scholarships',
    });
  }
}

module.exports = { getScholarships };
