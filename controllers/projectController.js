
const Project = require("../models/project");

// =========================
// Create Project
// =========================
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      category,
      skillsRequired,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      budget,
      category,
      skillsRequired,
      client: req.user._id, // from protect middleware
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project" });
  }
};

// =========================
// Get All Projects
// =========================
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// =========================
// Mark Project Completed
// =========================
const markCompleted = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.status = "completed";
    await project.save();

    res.json({ message: "Project marked as completed" });
  } catch (error) {
    res.status(500).json({ message: "Error updating project" });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  markCompleted,
};
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name")
      .populate("selectedStudent", "name");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};