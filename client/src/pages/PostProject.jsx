
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/postProject.css";

function PostProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    skillsRequired: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", {
        ...formData,
        skillsRequired: formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
      });

      alert("Project posted successfully!");
      navigate("/client-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Error posting project");
    }
  };

  return (
    <div className="post-project-container">
      <h2>🚀 Post New Project</h2>

      <form onSubmit={handleSubmit} className="post-project-form">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget (₹)"
          value={formData.budget}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option>Web Development</option>
          <option>App Development</option>
          <option>UI/UX Design</option>
          <option>Graphic Design</option>
          <option>Content Writing</option>
          <option>Video Editing</option>
          <option>Data Science</option>
          <option>Other</option>
        </select>

        <input
          type="text"
          name="skillsRequired"
          placeholder="Required Skills (comma separated)"
          value={formData.skillsRequired}
          onChange={handleChange}
        />

        <button type="submit">Post Project</button>
      </form>
    </div>
  );
}

export default PostProject;