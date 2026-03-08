
import { useState } from "react";

function ProjectSearch({ onSearch }) {

  const [skill, setSkill] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const handleSearch = () => {
    onSearch({
      skill,
      minBudget,
      maxBudget,
    });
  };

  return (
    <div className="search-box">

      <input
        type="text"
        placeholder="Search by skill (React, Java...)"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
      />

      <input
        type="number"
        placeholder="Min Budget"
        value={minBudget}
        onChange={(e) => setMinBudget(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max Budget"
        value={maxBudget}
        onChange={(e) => setMaxBudget(e.target.value)}
      />

      <button onClick={handleSearch}>
        Search
      </button>

    </div>
  );
}

export default ProjectSearch;