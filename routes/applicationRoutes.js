
const express = require("express");
const Application = require("../models/Application");
const Project = require("../models/project");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
   1️⃣ STUDENT APPLY TO A PROJECT
===================================================== */
router.post(
  "/:projectId",
  protect,
  authorize("student"),
  async (req, res) => {
    try {
      const { proposal } = req.body;

      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.status !== "open") {
        return res.status(400).json({
          message: "Project is not open for applications",
        });
      }

      const alreadyApplied = await Application.findOne({
        project: req.params.projectId,
        student: req.user._id,
      });

      if (alreadyApplied) {
        return res.status(400).json({
          message: "You already applied to this project",
        });
      }

      const application = await Application.create({
        project: project._id,
        student: req.user._id,
        proposal,
        status: "pending",
      });

      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   2️⃣ CLIENT VIEW PROJECT APPLICATIONS
===================================================== */
router.get(
  "/project/:projectId",
  protect,
  authorize("client"),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const applications = await Application.find({
        project: req.params.projectId,
      })
        .populate("student", "name email skills")
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   3️⃣ CLIENT SELECT A STUDENT (ACCEPT)
===================================================== */
router.put(
  "/:applicationId/select",
  protect,
  authorize("client"),
  async (req, res) => {
    try {
      const application = await Application.findById(
        req.params.applicationId
      ).populate("project");

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const project = application.project;

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (project.status !== "open") {
        return res.status(400).json({
          message: "Project is no longer open",
        });
      }

      // Accept selected application
      application.status = "accepted";
      await application.save();

      // Update project status
      project.status = "in-progress";
      await project.save();

      // Reject all other applications
      await Application.updateMany(
        {
          project: project._id,
          _id: { $ne: application._id },
        },
        { status: "rejected" }
      );

      res.json({ message: "Student selected successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   4️⃣ CLIENT REJECT APPLICATION
===================================================== */
router.put(
  "/:applicationId/reject",
  protect,
  authorize("client"),
  async (req, res) => {
    try {
      const application = await Application.findById(
        req.params.applicationId
      ).populate("project");

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const project = application.project;

      if (project.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      application.status = "rejected";
      await application.save();

      res.json({ message: "Application rejected" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   5️⃣ STUDENT VIEW THEIR APPLICATIONS
===================================================== */
router.get(
  "/my",
  protect,
  authorize("student"),
  async (req, res) => {
    try {
      const applications = await Application.find({
        student: req.user._id,
      })
        .populate("project", "title budget status")
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;