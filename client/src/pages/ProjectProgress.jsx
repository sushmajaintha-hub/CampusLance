
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function ProjectProgress() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      alert("Error loading project");
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>{project.title}</h2>

      <p>
        <strong>Description:</strong> {project.description}
      </p>

      <p>
        <strong>Budget:</strong> ${project.budget}
      </p>

      <p>
        <strong>Status:</strong> {project.status}
      </p>

      {project.selectedStudent && (
        <p>
          <strong>Selected Student:</strong>{" "}
          {project.selectedStudent.name}
        </p>
      )}
    </div>
  );
}

export default ProjectProgress;