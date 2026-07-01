import React from "react";
import "./RpeSelector.module.css";

const RPE_VALUES = [5, 6, 7, 8, 9, 10];

export const RpeSelector = ({ value, onChange }) => {
  return (
    <div className="rpe-selector">
      {RPE_VALUES.map((rpe) => (
        <button
          key={rpe}
          className={`rpe-selector__boton ${value === rpe ? "rpe-selector__boton--activo" : ""}`}
          onClick={() => onChange(rpe)}
          type="button"
        >
          {rpe}
        </button>
      ))}
    </div>
  );
};
