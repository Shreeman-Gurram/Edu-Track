const mongoose = require("mongoose");

const learningPathSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
      }
    ],

    currentTopic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      default: null
    },

    completedTopics: [
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

module.exports = mongoose.model("LearningPath", learningPathSchema);