require('dotenv').config();

const mongoose = require('mongoose');
const Scholarship = require('../models/Scholarship');

const scholarships = [
  {
    title: 'National Learning Scholarship',
    description: 'Financial support for students with strong academic commitment.',
    eligibleGrades: ['7', '8', '9'],
    eligibility: 'Students meeting the provider criteria.',
    applicationDeadline: new Date('2026-09-30'),
    applicationLink: 'https://example.com/national-learning-scholarship',
    provider: 'National Education Foundation',
    isActive: true,
  },
  {
    title: 'Young Innovators Science Competition',
    description: 'A science competition and mentorship opportunity for middle-school students.',
    eligibleGrades: ['7', '8'],
    eligibility: 'Submit an original science project.',
    applicationDeadline: new Date('2026-10-15'),
    applicationLink: 'https://example.com/young-innovators',
    provider: 'Future Science Forum',
    isActive: true,
  },
  {
    title: 'STEM Achievement Grant',
    description: 'A grant for students pursuing mathematics and science learning.',
    eligibleGrades: ['9', '10'],
    eligibility: 'Students with consistent STEM participation.',
    applicationDeadline: new Date('2026-11-10'),
    applicationLink: 'https://example.com/stem-achievement-grant',
    provider: 'STEM Reach',
    isActive: true,
  },
  {
    title: 'Senior Scholars Opportunity',
    description: 'Scholarship support for higher-secondary students preparing for further study.',
    eligibleGrades: ['10', '11', '12'],
    eligibility: 'Students meeting academic and application requirements.',
    applicationDeadline: new Date('2026-12-01'),
    applicationLink: 'https://example.com/senior-scholars',
    provider: 'Student Futures Trust',
    isActive: true,
  },
  {
    title: 'Community Leadership Scholarship',
    description: 'Recognition for students demonstrating service and leadership.',
    eligibleGrades: ['8', '9', '10', '11'],
    eligibility: 'Documented community or school leadership activity.',
    applicationDeadline: new Date('2027-01-15'),
    applicationLink: 'https://example.com/community-leadership',
    provider: 'Community Leaders Network',
    isActive: true,
  },
];

async function seedScholarships() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not defined');

  await mongoose.connect(process.env.MONGODB_URI);
  for (const scholarship of scholarships) {
    await Scholarship.updateOne(
      { title: scholarship.title },
      { $set: scholarship },
      { upsert: true }
    );
  }
  await mongoose.disconnect();
  console.log(`Seeded ${scholarships.length} scholarships`);
}

seedScholarships().catch(async (error) => {
  console.error('Failed to seed scholarships:', error);
  await mongoose.disconnect();
  process.exit(1);
});
