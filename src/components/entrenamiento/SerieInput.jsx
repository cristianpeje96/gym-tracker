import React, { useState, useEffect } from "react";
import { RpeSelector } from "./RpeSelector";
import "./SerieInput.css";

const limpiarNumero = (valor) => {
  if (valor === "") return "";
  if (/^0+\d/.test(valor)) {
    return valor.replace(/^0+/, "");
  }
  return valor;
};

export const SerieInput = ({
  numero,
  repsObjetivo,
  cargaObjetivo,
  onGuardar,
}) => {
  const [reps, setReps] = useState(String(repsObjetivo ?? ""));
  const [carga, setCarga] = useState(String(cargaObjetivo ?? ""));
  const [rpe, setRpe] = useState(null);
  const [realizado, setRealizado] = useState(false);

  useEffect(() => {
    onGuardar({
      reps: parseInt(reps) || 0,
      carga: parseFloat(carga) || 0,
      rpe,
      realizado,
    });
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
          inputMode="numeric"
          className="serie-input__campo"
          value={reps}
          onChange={(e) => setReps(limpiarNumero(e.target.value))}
          placeholder="Reps"
          disabled={!realizado}
        />
        <input
          type="number"
          inputMode="decimal"
          className="serie-input__campo"
          value={carga}
          onChange={(e) => setCarga(limpiarNumero(e.target.value))}
          placeholder="Kg"
          step="2.5"
          disabled={!realizado}
        />
      </div>

      {realizado && <RpeSelector value={rpe} onChange={setRpe} />}
    </div>
  );
};
