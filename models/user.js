
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "client"],
      required: true,
    },

    // 🔹 Common Fields
    bio: {
      type: String,
      default: "",
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    // 🔹 Student Fields
    college: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    portfolioLinks: [
      {
        type: String,
      },
    ],

    // 🔹 Client Fields
    companyName: {
      type: String,
      default: "",
    },

    companyDescription: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);