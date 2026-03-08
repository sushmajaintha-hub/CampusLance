
import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/applicantsModal.css";
import { useNavigate } from "react-router-dom";

function ApplicantsModal({ project, onClose }) {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [project]);

  const fetchApplications = async () => {
    try {
      const res = await API.get(`/applications/project/${project._id}`);
      setApplications(res.data);
    } catch (error) {
      alert("Error fetching applications");
    }
  };

  /* ==============================
     SELECT STUDENT
  ============================== */
  const handleSelect = async (applicationId) => {
    try {
      await API.put(`/applications/${applicationId}/select`);
      alert("Student selected successfully");
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Error selecting student");
    }
  };

  /* ==============================
     REJECT STUDENT
  ============================== */
  const handleReject = async (applicationId) => {
    try {
      await API.put(`/applications/${applicationId}/reject`);
      alert("Application rejected");
      fetchApplications();
    } catch (error) {
      alert("Error rejecting application");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h3>Applicants for {project.title}</h3>

        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="application-card">

              {/* STUDENT NAME (Clickable) */}
              <p>
                <strong>Student:</strong>{" "}
                <span
                  className="student-link"
                  onClick={() =>
                    navigate(`/profile/${app.student?._id}`)
                  }
                >
                  {app.student?.name}
                </span>
              </p>

              <p>
                <strong>Email:</strong> {app.student?.email}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {app.student?.skills?.join(", ") || "N/A"}
              </p>

              <p>
                <strong>Proposal:</strong> {app.proposal}
              </p>

              {/* STATUS */}
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-${app.status}`}>
                  {app.status.toUpperCase()}
                </span>
              </p>

              {/* ACTION BUTTONS */}
              {project.status === "open" && app.status === "pending" && (
                <div className="action-buttons">

                  <button
                    className="select-btn"
                    onClick={() => handleSelect(app._id)}
                  >
                    Select
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(app._id)}
                  >
                    Reject
                  </button>

                </div>
              )}

              {/* ACCEPTED */}
              {app.status === "accepted" && (
                <p className="accepted-msg">
                  ✅ Selected for this project
                </p>
              )}

              {/* REJECTED */}
              {app.status === "rejected" && (
                <p className="rejected-msg">
                  ❌ Application rejected
                </p>
              )}

            </div>
          ))
        )}

        <button onClick={onClose} className="close-btn">
          Close
        </button>

      </div>
    </div>
  );
}

export default ApplicantsModal;