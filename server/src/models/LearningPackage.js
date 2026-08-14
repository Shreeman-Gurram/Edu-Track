const mongoose = require('mongoose');

const { Schema } = mongoose;

const learningPackageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    topics: { type: [String], default: [] },
    lessons: { type: [Schema.Types.Mixed], default: [] },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    version: { type: Number, default: 1, min: 1 },
    pathSignature: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningPackage', learningPackageSchema);
