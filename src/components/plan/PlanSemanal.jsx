import React from "react";
import {
  PLAN_ENTRENAMIENTO,
  DIAS_SEMANA,
} from "../../constants/planEntrenamiento";
import "./PlanSemanal.css";

export const PlanSemanal = () => {
  const hoy = DIAS_SEMANA[new Date().getDay()];

  return (
    <div className="plan-semanal">
      <div className="plan-semanal__header">
        <h2 className="plan-semanal__titulo">
          📅 Plan de entrenamiento semanal
        </h2>
        <p className="plan-semanal__subtitulo">
          Tu rutina completa para la semana
        </p>
      </div>

      <div className="plan-semanal__grid">
        {Object.entries(PLAN_ENTRENAMIENTO).map(([dia, plan]) => (
          <div
            key={dia}
            className={`plan-semanal__dia ${hoy === dia ? "plan-semanal__dia--hoy" : ""}`}
          >
            <div className="plan-semanal__dia-header">
              <span className="plan-semanal__dia-nombre">{dia}</span>
              {hoy === dia && (
                <span className="plan-semanal__hoy-badge">HOY</span>
              )}
            </div>

            <div className="plan-semanal__dia-contenido">
              {plan.ejercicios.length > 0 ? (
                <>
                  <div className="plan-semanal__grupo">
                    <strong>{plan.nombre}</strong>
                  </div>
                  <div className="plan-semanal__ejercicios">
                    {plan.ejercicios.slice(0, 4).map((ej, idx) => (
                      <div key={idx} className="plan-semanal__ejercicio">
                        <span className="plan-semanal__ejercicio-nombre">
                          {ej.nombre}
                        </span>
                        <span className="plan-semanal__ejercicio-detalle">
                          {ej.series}x{ej.reps}
                        </span>
                      </div>
                    ))}
                    {plan.ejercicios.length > 4 && (
                      <div className="plan-semanal__mas">
                        +{plan.ejercicios.length - 4} ejercicios más
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="plan-semanal__descanso">🎉 Día de descanso</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
