import React, { useState, useEffect } from "react";
import { RpeSelector } from "./RpeSelector";
import "./SerieInput.css";

export const SerieInput = ({
  numero,
  repsObjetivo,
  cargaObjetivo,
  onGuardar,
}) => {
  const [reps, setReps] = useState(repsObjetivo);
  const [carga, setCarga] = useState(cargaObjetivo);
  const [rpe, setRpe] = useState(null);
  const [realizado, setRealizado] = useState(false);

  useEffect(() => {
    onGuardar({ reps, carga, rpe, realizado });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reps, carga, rpe, realizado]);

  return (
    <div className={`serie-input ${realizado ? "serie-input--realizada" : ""}`}>
      <div className="serie-input__header">
        <span className="serie-input__numero">Serie {numero}</span>
        <label className="serie-input__check">
          <input
            type="checkbox"
            checked={realizado}
            onChange={(e) => setRealizado(e.target.checked)}
          />
          Realizada
        </label>
      </div>

      <div className="serie-input__campos">
        <input
          type="number"
          className="serie-input__campo"
          value={reps}
          onChange={(e) => setReps(parseInt(e.target.value) || 0)}
          placeholder="Reps"
          disabled={!realizado}
        />
        <input
          type="number"
          className="serie-input__campo"
          value={carga}
          onChange={(e) => setCarga(parseFloat(e.target.value) || 0)}
          placeholder="Kg"
          step="2.5"
          disabled={!realizado}
        />
      </div>

      {realizado && <RpeSelector value={rpe} onChange={setRpe} />}
    </div>
  );
};
