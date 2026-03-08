
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      setUser(res.data);
    } catch (error) {
      alert("Error loading profile");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>{user.name}</h2>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Bio:</strong> {user.bio}</p>

      {user.role === "student" && (
        <>
          <p><strong>College:</strong> {user.college}</p>
          <p><strong>Skills:</strong> {user.skills?.join(", ")}</p>
          <p><strong>Portfolio:</strong></p>
          <ul>
            {user.portfolioLinks?.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {user.role === "client" && (
        <>
          <p><strong>Company:</strong> {user.companyName}</p>
          <p><strong>Description:</strong> {user.companyDescription}</p>
        </>
      )}

      <p>
        ⭐ {user.averageRating} ({user.numReviews} reviews)
      </p>
    </div>
  );
}

export default Profile;