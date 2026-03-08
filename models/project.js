
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Web Development",
        "App Development",
        "UI/UX Design",
        "Graphic Design",
        "Content Writing",
        "Video Editing",
        "Data Science",
        "Other",
      ],
      required: true,
    },

    skillsRequired: [
      {
        type: String,
      },
    ],

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    selectedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);