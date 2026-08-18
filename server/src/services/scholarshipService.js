const Scholarship = require('../models/Scholarship');
const User = require('../models/User');

async function getScholarshipsForUser(userId) {
  const user = await User.findById(userId).select('grade');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const grade = String(user.grade || '').trim();
  if (!grade) return [];

  return Scholarship.find({
    isActive: true,
    eligibleGrades: grade,
  }).sort({ applicationDeadline: 1, title: 1 });
}

module.exports = { getScholarshipsForUser };
