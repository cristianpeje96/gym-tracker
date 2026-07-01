import React, { useState } from "react";

export const EjercicioCard = ({ ejercicio, onGuardarSerie }) => {
  const [series, setSeries] = useState([]);

  const handleGuardarSerie = (serieIndex, datos) => {
    const nuevasSeries = [...series];
    nuevasSeries[serieIndex] = datos;
    setSeries(nuevasSeries);
    onGuardarSerie(ejercicio.nombre, nuevasSeries);
  };

  return (
    <div className="ejercicio-card">
      <h4>{ejercicio.nombre}</h4>
      <p>
        Objetivo: {ejercicio.series} × {ejercicio.reps}
      </p>
      {[...Array(ejercicio.series)].map((_, idx) => (
        <div key={idx}>
          <input
            type="number"
            placeholder={`Serie ${idx + 1} - Reps`}
            onChange={(e) =>
              handleGuardarSerie(idx, {
                reps: e.target.value,
                carga: ejercicio.carga,
              })
            }
          />
          <input
            type="number"
            placeholder="Carga (kg)"
            defaultValue={ejercicio.carga}
          />
        </div>
      ))}
    </div>
  );
};
