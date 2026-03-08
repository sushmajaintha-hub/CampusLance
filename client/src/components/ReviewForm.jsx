
import { useState } from "react";
import API from "../services/api";

function ReviewForm({ projectId, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/reviews", {
        projectId,
        rating,
        comment,
      });

      alert("Review submitted successfully");
      onClose();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Error submitting review"
      );
    }
  };

  return (
    <div className="review-box">
      <h4>Leave a Review</h4>

      <form onSubmit={handleSubmit}>
        <label>Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Average</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Very Bad</option>
        </select>

        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit">Submit Review</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;