const mongoose = require('mongoose');

const { Schema } = mongoose;

const optionSchema = new Schema({
  text: { type: String, required: true },
  value: { type: String },
});

const questionSchema = new Schema(
  {
    questionText: { type: String, required: true, trim: true },
    grade: { type: String },
    subject: { type: String },
    topic: { type: String },
    concept: { type: String },
    options: { type: [optionSchema], default: [] },
    correctAnswer: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
