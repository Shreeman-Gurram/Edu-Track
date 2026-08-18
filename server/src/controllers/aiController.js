const { 
  generateAdaptiveExplanation, 
  generatePracticeQuestions, 
  askGeneralQuestion 
} = require('../services/aiService.js');

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

module.exports = {
  handleGetExplanation,
  handleGeneratePractice,
  handleAskQuestion
};