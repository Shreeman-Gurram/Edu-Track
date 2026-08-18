require('dotenv').config();

const mongoose = require('mongoose');
const Scholarship = require('../models/Scholarship');

// MVP catalogue records. Administrators can update these records directly in MongoDB.
const scholarships = [
  {
    title: 'Grade 9 Academic Foundations Grant',
    description: 'Tuition-support opportunity for Grade 9 students building strong academic foundations.',
    eligibleGrades: ['9'],
    eligibility: 'Grade 9 students with consistent school attendance and demonstrated financial need.',
    applicationDeadline: new Date('2026-10-15'),
    provider: 'Edu-Track Student Support Fund',
    isActive: true,
  },
  {
    title: 'Emerging Science Learners Award',
    description: 'Recognition and learning-material support for students showing interest in science.',
    eligibleGrades: ['9', '10'],
    eligibility: 'Grade 9 or 10 students with strong science participation and teacher recommendation.',
    applicationDeadline: new Date('2026-11-10'),
    provider: 'Edu-Track STEM Initiative',
    isActive: true,
  },
  {
    title: 'Grade 10 Board Readiness Scholarship',
    description: 'Academic support for Grade 10 students preparing for board examinations.',
    eligibleGrades: ['10'],
    eligibility: 'Grade 10 students meeting academic and school verification requirements.',
    applicationDeadline: new Date('2026-10-31'),
    provider: 'Edu-Track Academic Advancement Fund',
    isActive: true,
  },
  {
    title: 'Mathematics Achievement Support',
    description: 'Learning-resource support for students pursuing mathematics with commitment.',
    eligibleGrades: ['10', '11'],
    eligibility: 'Grade 10 or 11 students demonstrating progress in mathematics and regular attendance.',
    applicationDeadline: new Date('2026-11-25'),
    provider: 'Edu-Track Quantitative Learning Fund',
    isActive: true,
  },
  {
    title: 'Higher Secondary Merit Scholarship',
    description: 'Merit-based support for Grade 11 students beginning higher secondary study.',
    eligibleGrades: ['11'],
    eligibility: 'Grade 11 students meeting academic merit and school verification requirements.',
    applicationDeadline: new Date('2026-12-05'),
    provider: 'Edu-Track Higher Secondary Fund',
    isActive: true,
  },
  {
    title: 'Career Exploration Scholarship',
    description: 'Support for students actively exploring higher-education and career pathways.',
    eligibleGrades: ['11', '12'],
    eligibility: 'Grade 11 or 12 students with a completed career-interest statement and school recommendation.',
    applicationDeadline: new Date('2026-12-15'),
    provider: 'Edu-Track Future Pathways Fund',
    isActive: true,
  },
  {
    title: 'Grade 12 University Transition Award',
    description: 'Application and learning support for Grade 12 students preparing for university.',
    eligibleGrades: ['12'],
    eligibility: 'Grade 12 students with verified academic progress and a higher-education plan.',
    applicationDeadline: new Date('2027-01-10'),
    provider: 'Edu-Track University Access Fund',
    isActive: true,
  },
  {
    title: 'Senior STEM Excellence Scholarship',
    description: 'Academic support for senior secondary students committed to STEM learning.',
    eligibleGrades: ['11', '12'],
    eligibility: 'Grade 11 or 12 students with STEM coursework, sustained performance, and school verification.',
    applicationDeadline: new Date('2027-01-20'),
    provider: 'Edu-Track STEM Excellence Fund',
    isActive: true,
  },
];

async function seedScholarships() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log('Connected to MongoDB');

    let inserted = 0;
    let updated = 0;

    for (const scholarship of scholarships) {
      const result = await Scholarship.updateOne(
        { title: scholarship.title },
        { $set: scholarship },
        { upsert: true }
      );

      if (result.upsertedCount) inserted += 1;
      else if (result.modifiedCount) updated += 1;
    }

    console.log(`Scholarship seeding completed. Inserted: ${inserted}; updated: ${updated}; total seed records: ${scholarships.length}.`);
  } catch (error) {
    console.error('Failed to seed scholarships:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

seedScholarships();
