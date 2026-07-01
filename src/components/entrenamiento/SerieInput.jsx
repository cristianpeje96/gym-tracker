import React, { useState } from "react";
import { RpeSelector } from "./RpeSelector";
import "./SerieInput.module.css";

export const SerieInput = ({
  numero,
  repsObjetivo,
  cargaObjetivo,
  onGuardar,
}) => {
  const [reps, setReps] = useState(repsObjetivo);
  const [carga, setCarga] = useState(cargaObjetivo);
  const [rpe, setRpe] = useState(null);

  const handleGuardar = () => {
    onGuardar({ reps, carga, rpe });
  };

  return (
    <div className="serie-input">
      <div className="serie-input__numero">Serie {numero}</div>

      <div className="serie-input__campos">
        <input
          type="number"
          className="serie-input__campo"
          value={reps}
          onChange={(e) => setReps(parseInt(e.target.value))}
          onBlur={handleGuardar}
          placeholder="Reps"
        />

        <input
          type="number"
          className="serie-input__campo"
          value={carga}
          onChange={(e) => setCarga(parseFloat(e.target.value))}
          onBlur={handleGuardar}
          placeholder="Kg"
          step="2.5"
        />

        <RpeSelector
          value={rpe}
          onChange={(nuevoRpe) => {
            setRpe(nuevoRpe);
            handleGuardar();
          }}
        />
      </div>
    </div>
  );
};
