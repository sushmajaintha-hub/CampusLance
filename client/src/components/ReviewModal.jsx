
import { useState } from "react";
import API from "../services/api";

function ReviewModal({ project, studentId, onClose }) {

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {

    try {

      await API.post("/reviews", {
        projectId: project._id,
        revieweeId: studentId,
        rating,
        comment,
      });

      alert("Review submitted");

      onClose();

    } catch (error) {
      alert("Error submitting review");
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <h3>Leave Review</h3>

        <label>Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="5">5 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="3">3 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="1">1 ⭐</option>
        </select>

        <textarea
          placeholder="Write review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={submitReview}>
          Submit Review
        </button>

        <button onClick={onClose}>
          Cancel
        </button>

      </div>
    </div>
  );
}

export default ReviewModal;