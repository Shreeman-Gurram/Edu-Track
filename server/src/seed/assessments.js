require('dotenv').config();

const mongoose = require('mongoose');
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');

async function seedAssessments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    const questions = await Question.find({})
      .select('_id subject topic grade')
      .sort({ createdAt: 1 });

    if (!questions.length) {
      console.log('No questions found in MongoDB.');
      await mongoose.disconnect();
      return;
    }

    // Group questions by subject + topic
    const groups = {};

    questions.forEach((question) => {
      const subject = (question.subject || 'General').trim();
      const topic = (question.topic || 'General').trim();

      const key = `${subject}::${topic}`;

      if (!groups[key]) {
        groups[key] = {
          subject,
          topic,
          grade: question.grade || '10',
          questionIds: [],
        };
      }

      groups[key].questionIds.push(question._id);
    });

    let created = 0;
    let updated = 0;

    for (const group of Object.values(groups)) {
      const title = `${group.subject} - ${group.topic}`;

      const existingAssessment = await Assessment.findOne({
        subject: group.subject,
        topic: group.topic,
      });

      if (existingAssessment) {
        existingAssessment.title = title;
        existingAssessment.grade = group.grade;
        existingAssessment.questions = group.questionIds;

        await existingAssessment.save();

        updated++;

        console.log(`Updated: ${title}`);
      } else {
        await Assessment.create({
          title,
          grade: group.grade,
          subject: group.subject,
          topic: group.topic,
          questions: group.questionIds,
        });

        created++;

        console.log(`Created: ${title}`);
      }
    }

    console.log('');
    console.log('================================');
    console.log('Assessment seeding completed');
    console.log('================================');
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
    console.log(`Total assessments: ${created + updated}`);

    await mongoose.disconnect();

    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Failed to seed assessments:', error);
    process.exit(1);
  }
}

seedAssessments();