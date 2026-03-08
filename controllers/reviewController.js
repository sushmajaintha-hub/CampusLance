
const Review = require("../models/Review");
const User = require("../models/user");
const Project = require("../models/project");

/* =====================================
   CREATE REVIEW
===================================== */
exports.createReview = async (req, res) => {
  try {

    const { rating, comment, projectId, revieweeId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (project.status !== "completed") {
      return res.status(400).json({
        message: "Project must be completed before review",
      });
    }

    const alreadyReviewed = await Review.findOne({
      project: projectId,
      reviewer: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this project",
      });
    }

    const review = await Review.create({
      project: projectId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment,
    });

    /* UPDATE USER RATING */

    const reviews = await Review.find({ reviewee: revieweeId });

    const avg =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      averageRating: avg,
      numReviews: reviews.length,
    });

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};