const mongoose = require('mongoose');

const { Schema } = mongoose;

const answerSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  selected: { type: String },
  correct: { type: Boolean },
});

const resultSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    answers: { type: [answerSchema], default: [] },
    topicPerformance: { type: Schema.Types.Mixed, default: {} },
    difficultyPerformance: { type: Schema.Types.Mixed, default: {} },
    weakConcepts: { type: [String], default: [] },
    offlineActivityId: { type: String, trim: true, sparse: true, unique: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Results are always retrieved in a student's timeline order.
resultSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('Result', resultSchema);
