const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true
    },

    options: {
      type: [String],
      required: true
    },

    correctAnswer: {
      type: Number,
      required: true
    },

    grade: {
      type: Number,
      required: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Question", questionSchema);