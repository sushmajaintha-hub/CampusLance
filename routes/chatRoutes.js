
const express = require("express");
const Chat = require("../models/Chat");
const Project = require("../models/project");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
   SEND MESSAGE
===================================================== */
router.post("/:projectId", protect, async (req, res) => {
  try {

    const { message } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const chat = await Chat.create({
      project: req.params.projectId,
      sender: req.user._id,
      message,
    });

    res.status(201).json(chat);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


/* =====================================================
   GET PROJECT CHAT
===================================================== */
router.get("/:projectId", protect, async (req, res) => {
  try {

    const chats = await Chat.find({
      project: req.params.projectId,
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(chats);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;