const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    eligibleGrades: {
      type: [{ type: String, trim: true }],
      required: true,
      validate: {
        validator: (grades) => grades.length > 0,
        message: 'At least one eligible grade is required',
      },
    },
    eligibility: { type: String, required: true, trim: true },
    applicationDeadline: { type: Date, required: true },
    applicationLink: { type: String, trim: true, default: '' },
    provider: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);
