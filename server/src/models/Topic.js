const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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

    description: {
      type: String,
      default: ""
    },

    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
      }
    ],

    nextTopics: [
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

module.exports = mongoose.model("Topic", topicSchema);