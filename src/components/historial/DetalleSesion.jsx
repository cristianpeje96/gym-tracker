import React from "react";
import { formatearFecha } from "../../utils/helpers";
import { X, CheckCircle2, Circle, Dumbbell } from "lucide-react";
import "./DetalleSesion.css";

/**
 * Hoja inferior con el detalle completo de una sesión guardada:
 * todos los ejercicios, series, pesos, reps y RPE registrados.
 */
export const DetalleSesion = ({ sesion, onCerrar }) => {
  if (!sesion) return null;

  const tituloDia = sesion.diaNumero
    ? `Día ${sesion.diaNumero}`
    : sesion.dia || "Sesión";

  const ejercicios = Object.entries(sesion.ejercicios || {});

  return (
    <div className="detalle-sesion__overlay" onClick={onCerrar}>
      <div
        className="detalle-sesion__hoja"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detalle-sesion__agarradera" />

        <div className="detalle-sesion__header">
          <div>
            <h3 className="detalle-sesion__titulo">{tituloDia}</h3>
            <p className="detalle-sesion__fecha">
              {formatearFecha(sesion.fecha)}
              {sesion.hora ? ` · ${sesion.hora}` : ""}
            </p>
          </div>
          <button className="detalle-sesion__cerrar" onClick={onCerrar}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="detalle-sesion__lista">
          {ejercicios.length === 0 ? (
            <p className="detalle-sesion__vacio">
              Esta sesión no tiene ejercicios registrados
            </p>
          ) : (
            ejercicios.map(([nombre, series]) => (
              <div key={nombre} className="detalle-sesion__ejercicio">
                <h4 className="detalle-sesion__ejercicio-nombre">
                  <Dumbbell size={15} strokeWidth={1.75} /> {nombre}
                </h4>
                <div className="detalle-sesion__series">
                  {(series || []).map((s, idx) => (
                    <div
                      key={idx}
                      className={`detalle-sesion__serie ${s?.realizado ? "detalle-sesion__serie--realizada" : ""}`}
                    >
                      <span className="detalle-sesion__serie-icono">
                        {s?.realizado ? (
                          <CheckCircle2 size={15} strokeWidth={2} />
                        ) : (
                          <Circle size={15} strokeWidth={1.75} />
                        )}
                      </span>
                      <span className="detalle-sesion__serie-numero">
                        Serie {idx + 1}
                      </span>
                      <span className="detalle-sesion__serie-datos">
                        {s?.realizado ? (
                          <>
                            {s.reps} reps · {s.carga} kg
                            {s.rpe ? ` · RPE ${s.rpe}` : ""}
                          </>
                        ) : (
                          "No realizada"
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
