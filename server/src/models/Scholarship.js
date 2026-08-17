const mongoose = require('mongoose');

const { Schema } = mongoose;

const scholarshipSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    eligibleGrades: { type: [String], required: true, default: [] },
    eligibility: { type: String, default: '', trim: true },
    applicationDeadline: { type: Date, required: true },
    applicationLink: { type: String, default: '', trim: true },
    provider: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

scholarshipSchema.index({ isActive: 1, eligibleGrades: 1, applicationDeadline: 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
