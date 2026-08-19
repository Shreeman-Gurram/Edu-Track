const { 
  generateAdaptiveExplanation, 
  generatePracticeQuestions, 
  askGeneralQuestion,
  generateAdaptiveTutorContent 
} = require('../services/aiService.js');
const User = require('../models/User.js');
const LearningPath = require('../models/LearningPath.js');

const handleGetExplanation = async (req, res) => {
  try {
    const { studentGrade, subject, topic, weakConcept, attempts, pastMistakes } = req.body;

    if (!weakConcept) {
      return res.status(400).json({ success: false, error: "Property 'weakConcept' is required." });
    }

    const explanation = await generateAdaptiveExplanation({
      studentGrade,
      subject,
      topic,
      weakConcept,
      attempts,
      pastMistakes
    });

    return res.status(200).json({ success: true, data: explanation });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const handleGeneratePractice = async (req, res) => {
  try {
    const { studentGrade, subject, topic, weakConcept, count } = req.body;

    if (!weakConcept) {
      return res.status(400).json({ success: false, error: "Property 'weakConcept' is required." });
    }

    const questions = await generatePracticeQuestions({
      studentGrade,
      subject,
      topic,
      weakConcept,
      count
    });

    return res.status(200).json({ success: true, data: questions });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const handleAskQuestion = async (req, res) => {
  try {
    const { question, grade } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: "Property 'question' is required." });
    }

    const response = await askGeneralQuestion({ question, grade });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const handleAdaptiveTutor = async (req, res) => {
  try {
    const { concept, topic, subject } = req.body;

    if (!concept) {
      return res.status(400).json({ success: false, error: "Property 'concept' is required." });
    }

    const userId = req.user._id;

    // Fetch student's grade from the User model
    const user = await User.findById(userId);
    const grade = user ? user.grade : '';

    // Find the student's performance for this concept from their LearningPaths
    let score = null;
    let priority = null;
    let trend = null;

    const learningPaths = await LearningPath.find({ user: userId, status: 'active' })
      .sort({ createdAt: -1 });

    for (const path of learningPaths) {
      const matchingItem = (path.items || []).find(
        (item) => item.concept === concept || item.topic === concept
      );

      if (matchingItem) {
        score = Math.round(matchingItem.latestScore || 0);
        priority = matchingItem.priority || 'medium';
        trend = matchingItem.trend || 'first_attempt';
        break;
      }
    }

    // If no performance data exists, return a flag
    if (score === null) {
      return res.status(200).json({
        success: true,
        noPerformance: true,
        data: {
          explanation: `Let's get started with ${concept}. This is a foundational concept worth understanding well.`,
          example: {
            question: `What is the basic idea behind ${concept}?`,
            solution: 'Start by reviewing the concept description above, then try to explain it in your own words.'
          },
          practice: [
            {
              question: `In your own words, what does ${concept} mean?`,
              answer: 'Think about the definition and try to relate it to something familiar.',
              explanation: 'Understanding definitions is the first step to mastery.'
            },
            {
              question: `Why is ${concept} important in ${subject || 'this subject'}?`,
              answer: 'Consider how this concept connects to other topics you have studied.',
              explanation: 'Understanding the importance helps with long-term retention.'
            }
          ]
        }
      });
    }

    const tutorContent = await generateAdaptiveTutorContent({
      grade,
      subject: subject || '',
      topic: topic || '',
      concept,
      score,
      priority,
      trend
    });

    return res.status(200).json({
      success: true,
      noPerformance: false,
      score,
      priority,
      trend,
      data: tutorContent
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  handleGetExplanation,
  handleGeneratePractice,
  handleAskQuestion,
  handleAdaptiveTutor
};