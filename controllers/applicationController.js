
const Application = require("../models/Application");
const Project = require("../models/project");

/* =====================================================
   APPLY TO PROJECT (Student)
===================================================== */
exports.applyToProject = async (req, res) => {
  try {
    const { proposal } = req.body;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status !== "open") {
      return res.status(400).json({
        message: "This project is not accepting applications",
      });
    }

    const alreadyApplied = await Application.findOne({
      project: projectId,
      student: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You already applied to this project",
      });
    }

    const application = await Application.create({
      project: projectId,
      student: req.user._id,
      proposal,
      status: "pending",
    });

    res.status(201).json(application);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   GET MY APPLICATIONS (Student)
===================================================== */
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user._id,
    })
      .populate("project")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   GET APPLICATIONS FOR A PROJECT (Client)
===================================================== */
exports.getProjectApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      project: req.params.projectId,
    }).populate("student", "name email skills");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   SELECT STUDENT (Client)
===================================================== */
exports.selectStudent = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const project = await Project.findById(application.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.status !== "open") {
      return res.status(400).json({
        message: "Student already selected for this project",
      });
    }

    // Accept selected application
    application.status = "accepted";
    await application.save();

    // Reject other applications
    await Application.updateMany(
      {
        project: application.project,
        _id: { $ne: application._id },
      },
      { status: "rejected" }
    );

    // Update project
    project.status = "in-progress";
    project.selectedStudent = application.student;
    await project.save();

    res.json({
      message: "Student selected successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};