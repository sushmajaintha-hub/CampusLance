
const express = require("express");
const Project = require("../models/project");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
   CREATE PROJECT (Client Only)
===================================================== */
router.post("/", protect, authorize("client"), async (req, res) => {
  try {
    const { title, description, budget, skillsRequired, category } =
      req.body;

    const project = await Project.create({
      title,
      description,
      budget,
      skillsRequired,
      category, // 🔥 added
      client: req.user._id,
      status: "open",
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   GET ALL PROJECTS (Search + Filter + Skill Match)
===================================================== */
router.get("/", protect, async (req, res) => {
  try {
    const { search, category, minBudget, maxBudget } = req.query;

    let query = {};

    // 🔍 Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // 📂 Filter by category
    if (category) {
      query.category = category;
    }

    // 💰 Budget filtering
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    let projects = await Project.find(query)
      .populate("client", "name")
      .sort({ createdAt: -1 });

    // 👩‍🎓 If Student → show only OPEN projects + match %
    if (req.user.role === "student") {
      projects = projects.filter(
        (project) => project.status === "open"
      );

      const studentSkills = req.user.skills || [];

      const projectsWithMatch = projects.map((project) => {
        const requiredSkills = project.skillsRequired || [];

        const matchedSkills = requiredSkills.filter((skill) =>
          studentSkills.includes(skill)
        );

        const matchPercent =
          requiredSkills.length === 0
            ? 0
            : Math.round(
                (matchedSkills.length / requiredSkills.length) * 100
              );

        return {
          ...project.toObject(),
          matchPercent,
        };
      });

      // Sort by match %
      projectsWithMatch.sort((a, b) => b.matchPercent - a.matchPercent);

      return res.json(projectsWithMatch);
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   GET CLIENT PROJECTS
===================================================== */
router.get("/client", protect, authorize("client"), async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user._id })
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE PROJECT STATUS
===================================================== */
router.put(
  "/:id/status",
  protect,
  authorize("client"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "open",
        "in-progress",
        "completed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      project.status = status;
      await project.save();

      res.json({ message: "Project status updated", project });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   MARK PROJECT AS COMPLETED
===================================================== */
router.put(
  "/:id/complete",
  protect,
  authorize("client"),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (project.status !== "in-progress") {
        return res.status(400).json({
          message: "Project must be in-progress to complete",
        });
      }

      project.status = "completed";
      await project.save();

      res.json({ message: "Project marked as completed" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);
//router.get("/:id", getProjectById);

module.exports = router;
/* =====================================================
   SEARCH PROJECTS
===================================================== */
router.get("/search", protect, async (req, res) => {
  try {

    const { skill, minBudget, maxBudget } = req.query;

    let filter = { status: "open" };

    if (skill) {
      filter.skillsRequired = { $regex: skill, $options: "i" };
    }

    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    const projects = await Project.find(filter)
      .populate("client", "name")
      .sort({ createdAt: -1 });

    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});