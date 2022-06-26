import React, { useState } from "react";

const CheckboxBranch = ({ branches, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = (c) => () => {
    const currentBranchId = checked.indexOf(c);
    const newCheckedBranchId = [...checked];
    if (currentBranchId === -1) {
      newCheckedBranchId.push(c);
    } else {
      newCheckedBranchId.splice(currentBranchId, 1);
    }

    setChecked(newCheckedBranchId);
    handleFilters(newCheckedBranchId);
  };

  return branches.map((c, i) => (
    <div key={i} className="form-check">
      <input
        onChange={handleToggle(c._id)}
        value={checked.indexOf(c._id === -1)}
        type="checkbox"
        className="form-check-input"
      />
      <label className="form-check-label ml-3">{c.name}</label>
    </div>
  ));
};

export default CheckboxBranch;
