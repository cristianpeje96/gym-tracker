import React from "react";
import { Gauge, Lightbulb } from "lucide-react";
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
    {
      rpe: 9,
      significado: "Seguro que sale 1 rep más",
      rir: 1,
      descripcion: "Esfuerzo cerca del máximo",
    },
    {
      rpe: 8.5,
      significado: "Sale 1 rep más y puede que 2",
      rir: "1-2",
      descripcion: "Podría haber hecho 1 o 2 reps más",
    },
    {
      rpe: 8,
      significado: "Seguro que salen 2 reps más",
      rir: 2,
      descripcion: "Esfuerzo duro",
    },
    {
      rpe: 7.5,
      significado: "Salen 2 reps más y puede que 3",
      rir: "2-3",
      descripcion: "Podría haber hecho 3 o 4 reps más",
    },
    {
      rpe: 7,
      significado: "Salen 3 reps más",
      rir: 3,
      descripcion: "Esfuerzo moderado",
    },
    {
      rpe: 6,
      significado: "Salen 4 reps más",
      rir: 4,
      descripcion: "Esfuerzo medio duro",
    },
    {
      rpe: 5,
      significado: "Salen 5 reps más",
      rir: 5,
      descripcion: "Esfuerzo ligero",
    },
  ];

  return (
    <div className="tabla-rpe">
      <div className="tabla-rpe__header">
        <h3 className="tabla-rpe__titulo">
          <Gauge size={17} strokeWidth={1.75} /> Escala de Esfuerzo Percibido
          (RPE/RIR)
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
          <Lightbulb size={15} strokeWidth={1.75} />
          <span>
            <strong>Pro tip:</strong> Entrena entre RPE 7-8 para la mayoría de
            ejercicios. Deja 1-2 repeticiones en reserva para evitar fatiga
            excesiva.
          </span>
        </p>
      </div>
    </div>
  );
};
