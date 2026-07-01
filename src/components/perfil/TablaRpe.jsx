import React from "react";
import "./TablaRpe.css";

export const TablaRpe = () => {
  const escalaRpe = [
    {
      rpe: 10,
      significado: "Esfuerzo Máximo",
      rir: 0,
      descripcion: "No queda nada en el tanque",
    },
    {
      rpe: 9.5,
      significado: "Puede que salga 1 rep más",
      rir: "1-0",
      descripcion: "Al límite absoluto",
    },
  ];

  return (
    <div className="tabla-rpe">
      <div className="tabla-rpe__header">
        <h3 className="tabla-rpe__titulo">
          📘 Escala de Esfuerzo Percibido (RPE/RIR)
        </h3>
        <p className="tabla-rpe__subtitulo">
          Guía para medir la intensidad de tus entrenamientos
        </p>
      </div>

      <div className="tabla-rpe__grid">
        {escalaRpe.map((item) => (
          <div key={item.rpe} className="tabla-rpe__item">
            <div className="tabla-rpe__item-header">
              <span className="tabla-rpe__rpe">RPE {item.rpe}</span>
              <span className="tabla-rpe__rir">RIR {item.rir}</span>
            </div>
            <div className="tabla-rpe__significado">{item.significado}</div>
            <div className="tabla-rpe__descripcion">{item.descripcion}</div>
          </div>
        ))}
      </div>

      <div className="tabla-rpe__footer">
        <p className="tabla-rpe__nota">
          💡 <strong>Pro tip:</strong> Entrena entre RPE 7-8 para la mayoría de
          ejercicios. Deja 1-2 repeticiones en reserva para evitar fatiga
          excesiva.
        </p>
      </div>
    </div>
  );
};
