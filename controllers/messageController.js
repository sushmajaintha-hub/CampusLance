
const Message = require("../models/Message");

/* =========================================
   SEND MESSAGE
========================================= */
exports.sendMessage = async (req, res) => {
  try {
    const { projectId, receiverId, message } = req.body;

    const newMessage = await Message.create({
      project: projectId,
      sender: req.user._id,
      receiver: receiverId,
      message,
    });

    res.status(201).json(newMessage);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================
   GET PROJECT CHAT
========================================= */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      project: req.params.projectId,
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};