const mongoose = require('mongoose');

const { Schema } = mongoose;

const assessmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    grade: { type: String },
    subject: { type: String },
    topic: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
