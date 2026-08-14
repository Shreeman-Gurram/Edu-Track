const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true
    },

    score: {
      type: Number,
      required: true
    },

    totalMarks: {
      type: Number,
      required: true
    },

    topicPerformance: [
      {
        topic: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Topic",
          required: true
        },

        correct: {
          type: Number,
          default: 0
        },

        total: {
          type: Number,
          default: 0
        },

        percentage: {
          type: Number,
          default: 0
        }
      }
    ],

    weakTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Result", resultSchema);