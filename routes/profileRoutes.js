
const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateProfile,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

/* GET PROFILE */
router.get("/:id", protect, getUserProfile);

/* UPDATE PROFILE */
router.put("/", protect, updateProfile);

module.exports = router;