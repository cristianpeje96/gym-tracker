import React from "react";
import "./RpeSelector.css";

const RPE_VALUES = [5, 6, 7, 8, 9, 10];

export const RpeSelector = ({ value, onChange, disabled = false }) => {
  return (
    <div className="rpe-selector">
      <span className="rpe-selector__etiqueta">RPE</span>
      <div className="rpe-selector__botones">
        {RPE_VALUES.map((rpe) => (
          <button
            key={rpe}
            className={`rpe-selector__boton ${value === rpe ? "rpe-selector__boton--activo" : ""}`}
            onClick={() => onChange(rpe)}
            type="button"
            disabled={disabled}
          >
            {rpe}
          </button>
        ))}
      </div>
    </div>
  );
};
