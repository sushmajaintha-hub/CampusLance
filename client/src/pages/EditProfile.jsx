
import { useState, useEffect } from "react";
import API from "../services/api";

function EditProfile() {
  const [formData, setFormData] = useState({
    bio: "",
    college: "",
    skills: "",
    portfolioLinks: "",
    companyName: "",
    companyDescription: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await API.get("/users/profile");
    const user = res.data;

    setFormData({
      bio: user.bio || "",
      college: user.college || "",
      skills: user.skills?.join(", ") || "",
      portfolioLinks: user.portfolioLinks?.join(", ") || "",
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/users/profile", {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
        portfolioLinks: formData.portfolioLinks
          .split(",")
          .map((s) => s.trim()),
      });

      alert("Profile updated successfully");
    } catch (error) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
        />

        <input
          type="text"
          name="college"
          placeholder="College"
          value={formData.college}
          onChange={handleChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
        />

        <input
          type="text"
          name="portfolioLinks"
          placeholder="Portfolio Links (comma separated)"
          value={formData.portfolioLinks}
          onChange={handleChange}
        />

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
        />

        <textarea
          name="companyDescription"
          placeholder="Company Description"
          value={formData.companyDescription}
          onChange={handleChange}
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;