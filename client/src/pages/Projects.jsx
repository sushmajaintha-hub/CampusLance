
import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/projects.css";
import ProjectSearch from "../components/ProjectSearch";

function Projects() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {

      const res = await API.get("/projects");

      const openProjects = res.data.filter(
        (project) => project.status === "open"
      );

      setProjects(openProjects);

    } catch (error) {
      alert("Error fetching projects");
    }
  };

  // 🔎 SEARCH PROJECTS
  const searchProjects = async (filters) => {

    try {

      const params = new URLSearchParams(filters).toString();

      const res = await API.get(`/projects/search?${params}`);

      setProjects(res.data);

    } catch (error) {
      alert("Search failed");
    }

  };

  // 💳 PAYMENT FUNCTION
  const payProject = async (projectId) => {

    try {

      await API.post(`/payment/${projectId}/pay`);

      alert("Payment successful");

      fetchProjects();

    } catch (error) {

      alert("Payment failed");

    }

  };

  return (
    <div className="projects-container">

      <h2>Available Projects</h2>

      {/* SEARCH COMPONENT */}
      <ProjectSearch onSearch={searchProjects} />

      <div className="project-grid">

        {projects.length === 0 ? (
          <p>No projects available</p>
        ) : (

          projects.map((project) => (

            <div key={project._id} className="project-card">

              <h3>{project.title}</h3>

              <p>{project.description}</p>

              <p>
                <strong>Budget:</strong> ₹{project.budget}
              </p>

              {project.skillsRequired && (
                <p>
                  <strong>Skills:</strong>{" "}
                  {project.skillsRequired.join(", ")}
                </p>
              )}

              {/* PAYMENT BUTTON */}
              {project.paymentStatus !== "paid" && (
                <button
                  onClick={() => payProject(project._id)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 15px",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                >
                  Pay Student
                </button>
              )}

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Projects;