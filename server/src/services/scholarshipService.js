const Scholarship = require('../models/Scholarship');

async function getEligibleScholarships(userGrade) {
  const grade = String(userGrade || '').trim();

  if (!grade) {
    const error = new Error('Your account does not have a grade set');
    error.statusCode = 400;
    throw error;
  }

  return Scholarship.find({
    isActive: true,
    eligibleGrades: grade,
  })
    .select('title description eligibleGrades eligibility applicationDeadline applicationLink provider')
    .sort({ applicationDeadline: 1, createdAt: -1 });
}

module.exports = { getEligibleScholarships };
