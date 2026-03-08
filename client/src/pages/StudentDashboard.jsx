
import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/studentDashboard.css";
import ProposalModal from "../components/ProposalModal";
import ReviewForm from "../components/ReviewForm";

function StudentDashboard() {
  const [projects, setProjects] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [reviewProjectId, setReviewProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchMyApplications();
  }, []);

  /* ===============================
     FETCH PROJECTS WITH FILTERS
  =============================== */
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects", {
        params: {
          search,
          category,
          minBudget,
          maxBudget,
        },
      });

      setProjects(res.data);
    } catch (error) {
      alert("Error fetching projects");
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await API.get("/applications/my");
      setMyApplications(res.data);
    } catch (error) {
      alert("Error fetching applications");
    }
  };

  const handleApply = async (projectId, proposal) => {
    try {
      await API.post(`/applications/${projectId}`, { proposal });
      alert("Application submitted!");
      setSelectedProject(null);
      fetchMyApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Error applying");
    }
  };

  const getStatusClass = (status) => {
    if (status === "accepted") return "status-badge status-accepted";
    if (status === "rejected") return "status-badge status-rejected";
    return "status-badge status-pending";
  };

  const filteredApplications = myApplications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const inProgressProjects = myApplications.filter(
    (app) =>
      app.status === "accepted" &&
      app.project?.status === "in-progress"
  );

  const completedProjects = myApplications.filter(
    (app) =>
      app.status === "accepted" &&
      app.project?.status === "completed"
  );

  return (
    <div className="dashboard-container">
      <h2 className="section-title">🎯 Recommended Projects</h2>

      {/* 🔍 SEARCH + FILTER SECTION */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App">Mobile App</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Design">Design</option>
        </select>

        <input
          type="number"
          placeholder="Min Budget"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
          className="budget-input"
        />

        <input
          type="number"
          placeholder="Max Budget"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          className="budget-input"
        />

        <button className="apply-btn" onClick={fetchProjects}>
          Apply Filters
        </button>
      </div>

      <div className="project-grid">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((project) => {
            const alreadyApplied = myApplications.some(
              (app) => app.project?._id === project._id
            );

            return (
              <div key={project._id} className="project-card">
                <div className="project-title">{project.title}</div>
                <div className="project-desc">{project.description}</div>
                <div className="budget">₹ {project.budget}</div>

                {project.category && (
                  <div className="category">
                    Category: {project.category}
                  </div>
                )}

                {project.matchPercent !== undefined && (
                  <div className="match">
                    🔥 Match: {project.matchPercent}%
                  </div>
                )}

                {project.skillsRequired && (
                  <div className="skills">
                    Skills: {project.skillsRequired.join(", ")}
                  </div>
                )}

                <button
                  className="apply-btn"
                  disabled={alreadyApplied}
                  onClick={() => setSelectedProject(project)}
                >
                  {alreadyApplied ? "Already Applied" : "Apply"}
                </button>
              </div>
            );
          })
        )}
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* IN PROGRESS */}
      <h2 className="section-title">🚀 In Progress</h2>
      <div className="project-grid">
        {inProgressProjects.length === 0 ? (
          <p>No active projects yet.</p>
        ) : (
          inProgressProjects.map((app) => (
            <div key={app._id} className="project-card">
              <div className="project-title">
                {app.project?.title}
              </div>
              <div className="budget">
                ₹ {app.project?.budget}
              </div>
              <span className="status-badge status-accepted">
                IN PROGRESS
              </span>
            </div>
          ))
        )}
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* COMPLETED */}
      <h2 className="section-title">✅ Completed Projects</h2>
      <div className="project-grid">
        {completedProjects.length === 0 ? (
          <p>No completed projects yet.</p>
        ) : (
          completedProjects.map((app) => (
            <div key={app._id} className="project-card">
              <div className="project-title">
                {app.project?.title}
              </div>

              <span className="status-badge status-completed">
                COMPLETED
              </span>

              <button
                className="review-btn"
                onClick={() =>
                  setReviewProjectId(app.project?._id)
                }
              >
                Leave Review
              </button>
            </div>
          ))
        )}
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* MY APPLICATIONS */}
      <h2 className="section-title">📌 My Applications</h2>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter-dropdown"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>

      <div className="project-grid">
        {filteredApplications.map((app) => (
          <div key={app._id} className="project-card">
            <div className="project-title">
              {app.project?.title || "Project Deleted"}
            </div>
            <div className="project-desc">{app.proposal}</div>

            <span className={getStatusClass(app.status)}>
              {app.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ProposalModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSubmit={(proposal) =>
            handleApply(selectedProject._id, proposal)
          }
        />
      )}

      {reviewProjectId && (
        <ReviewForm
          projectId={reviewProjectId}
          onClose={() => {
            setReviewProjectId(null);
            fetchMyApplications();
          }}
        />
      )}
    </div>
  );
}

export default StudentDashboard;