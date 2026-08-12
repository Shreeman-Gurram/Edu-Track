const mongoose = require('mongoose');

const { Schema } = mongoose;

const progressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String },
    topic: { type: String },
    concept: { type: String },
    score: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 },
    masteryLevel: { type: String },
  },
  { timestamps: { createdAt: false, updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Progress', progressSchema);
