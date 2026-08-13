const mongoose = require('mongoose');

const { Schema } = mongoose;

const itemSchema = new Schema({
  topic: { type: String, required: true },
  concept: { type: String },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'low' },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  recommendedAction: { type: String },
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
