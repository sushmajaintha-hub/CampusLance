
import { useState } from "react";
import "../styles/proposalModal.css";

function ProposalModal({ project, onClose, onSubmit }) {
  const [proposal, setProposal] = useState("");

  const handleSubmit = () => {
    if (!proposal.trim()) return alert("Proposal cannot be empty");
    onSubmit(proposal);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Apply for: {project.title}</h3>

        <textarea
          placeholder="Write a strong proposal..."
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
        />

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Proposal
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProposalModal;