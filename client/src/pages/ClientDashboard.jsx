
import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/clientDashboard.css";
import ApplicantsModal from "../components/ApplicantsModal";
import ReviewForm from "../components/ReviewForm";
import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewProjectId, setReviewProjectId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const res = await API.get("/projects/client");
      setProjects(res.data);
    } catch (error) {
      alert("Error fetching projects");
    }
  };

  const markAsCompleted = async (projectId) => {
    try {
      await API.put(`/projects/${projectId}/complete`);
      alert("Project marked as completed");
      fetchMyProjects();
    } catch (error) {
      alert("Error completing project");
    }
  };

  const cancelProject = async (projectId) => {
    try {
      await API.put(`/projects/${projectId}/status`, {
        status: "cancelled",
      });
      alert("Project cancelled");
      fetchMyProjects();
    } catch (error) {
      alert("Error cancelling project");
    }
  };

  return (
    <div className="client-dashboard">
      <div className="client-header">
        <h2>💼 My Projects</h2>
        <button
          className="post-btn"
          onClick={() => navigate("/post-project")}
        >
          + Post New Project
        </button>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.title}</h3>

            <span className={`status-badge ${project.status}`}>
              {project.status.toUpperCase()}
            </span>

            <p>{project.description}</p>
            <p><strong>Budget:</strong> ₹{project.budget}</p>

            {/* OPEN */}
            {project.status === "open" && (
              <>
                <button
                  className="view-btn"
                  onClick={() => setSelectedProject(project)}
                >
                  View Applicants
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => cancelProject(project._id)}
                >
                  Cancel Project
                </button>
              </>
            )}

            {/* IN PROGRESS */}
            {project.status === "in-progress" && (
              <button
                className="complete-btn"
                onClick={() => {
                  if (window.confirm("Mark this project as completed?")) {
                    markAsCompleted(project._id);
                  }
                }}
              >
                Mark as Completed
              </button>
            )}

            {/* COMPLETED */}
            {project.status === "completed" && (
              <>
                <p className="completed-text">✅ Project Finished</p>

                <button
                  className="review-btn"
                  onClick={() => setReviewProjectId(project._id)}
                >
                  Leave Review
                </button>
              </>
            )}

            {/* CANCELLED */}
            {project.status === "cancelled" && (
              <p className="cancelled-text">❌ Project Cancelled</p>
            )}
          </div>
        ))}
      </div>

      {selectedProject && (
        <ApplicantsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {reviewProjectId && (
        <ReviewForm
          projectId={reviewProjectId}
          onClose={() => {
            setReviewProjectId(null);
            fetchMyProjects();
          }}
        />
      )}
    </div>
  );
}

export default ClientDashboard;