const mongoose = require('mongoose');

const { Schema } = mongoose;

const itemSchema = new Schema({
  topic: { type: String, required: true },
  concept: { type: String },

  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },

  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'low',
  },

  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
  },

  recommendedAction: {
    type: String,
  },

  latestScore: {
  type: Number,
  default: 0,
},

previousScore: {
  type: Number,
  default: null,
},

trend: {
  type: String,
  enum: ['first_attempt', 'improving', 'declining', 'unchanged'],
  default: 'first_attempt',
},
});

const learningPathSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [itemSchema], default: [] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningPath', learningPathSchema);
