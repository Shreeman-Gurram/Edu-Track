const mongoose = require('mongoose');

const { Schema } = mongoose;

const itemSchema = new Schema({
  topic: { type: String, required: true },
  concept: { type: String },
  priority: { type: Number, default: 1 },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
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
