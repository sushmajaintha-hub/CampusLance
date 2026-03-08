
const express = require("express");
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================
   GET USER PROFILE BY ID
========================================= */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================
   UPDATE OWN PROFILE
========================================= */
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bio = req.body.bio || user.bio;
    user.college = req.body.college || user.college;
    user.skills = req.body.skills || user.skills;
    user.portfolioLinks = req.body.portfolioLinks || user.portfolioLinks;
    user.companyName = req.body.companyName || user.companyName;
    user.companyDescription =
      req.body.companyDescription || user.companyDescription;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;