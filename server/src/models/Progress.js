const mongoose = require('mongoose');

const { Schema } = mongoose;

const progressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    concept: { type: String, required: true, trim: true },
    score: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 },
    masteryLevel: { type: String, enum: ['weak', 'needs_practice', 'strong'], required: true },
  },
  { timestamps: { createdAt: false, updatedAt: 'updatedAt' } }
);

progressSchema.index({ user: 1, subject: 1, topic: 1, concept: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
