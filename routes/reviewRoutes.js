
const express = require("express");
const Review = require("../models/Review");
const Project = require("../models/project");
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* ========================================
   CREATE REVIEW
======================================== */
router.post("/", protect, async (req, res) => {
  try {
    const { projectId, rating, comment } = req.body;

    const project = await Project.findById(projectId);

    if (!project || project.status !== "completed") {
      return res.status(400).json({
        message: "Project must be completed to review",
      });
    }

    // Determine reviewee
    let reviewee;

    if (req.user.role === "client") {
      reviewee = project.selectedStudent;
    } else {
      reviewee = project.client;
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      project: projectId,
      reviewer: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this project",
      });
    }

    const review = await Review.create({
      project: projectId,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment,
    });

    // Update user average rating
    const reviews = await Review.find({ reviewee });

    const avg =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    await User.findByIdAndUpdate(reviewee, {
      averageRating: avg.toFixed(1),
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;