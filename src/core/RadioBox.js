import React, { useState } from "react";

const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event) => {
    handleFilters(event.target.value);
    setValue(event.target.value);
  };

  return prices.map((p, i) => (
    <div key={i} className="form-check">
      <input
        onChange={handleChange}
        value={`${p._id}`}
        name={p}
        type="radio"
        className="form-check-input ml-2"
      />
      <label className="form-check-label ml-5">{p.name}</label>
    </div>
  ));
};

export default RadioBox;
