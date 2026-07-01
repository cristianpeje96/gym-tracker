import React, { useState, useEffect } from "react";
import { getDiaActual, formatearFecha } from "../../utils/helpers";
import { PLAN_ENTRENAMIENTO } from "../../constants/planEntrenamiento";
import { useEntrenamiento } from "../../contexts/EntrenamientoContext";
import "./Dashboard.css";

export const Dashboard = () => {
  const { historial } = useEntrenamiento();
  const hoy = getDiaActual();
  const planHoy = PLAN_ENTRENAMIENTO[hoy];
  const [ultimaSesion, setUltimaSesion] = useState(null);

  useEffect(() => {
    if (historial.length > 0) {
      setUltimaSesion(historial[historial.length - 1]);
    }
  }, [historial]);

  return (
    <div className="dashboard">
      <div className="dashboard__card">
        <h3 className="dashboard__titulo">🎯 Próxima sesión</h3>
        <div className="dashboard__contenido">
          {planHoy && planHoy.ejercicios.length > 0 ? (
            <>
              <p className="dashboard__dia">{hoy}</p>
              <p className="dashboard__nombre">{planHoy.nombre}</p>
              <p className="dashboard__stats">
                {planHoy.ejercicios.length} ejercicios programados
              </p>
            </>
          ) : (
            <p className="dashboard__descanso">
              🎉 ¡Día de descanso! Recupera energía
            </p>
          )}
        </div>
      </div>

      <div className="dashboard__card">
        <h3 className="dashboard__titulo">📊 Resumen rápido</h3>
        <div className="dashboard__stats-grid">
          <div className="dashboard__stat">
            <span className="dashboard__stat-valor">{historial.length}</span>
            <span className="dashboard__stat-label">Sesiones completadas</span>
          </div>
          <div className="dashboard__stat">
            <span className="dashboard__stat-valor">
              {ultimaSesion ? formatearFecha(ultimaSesion.fecha) : "---"}
            </span>
            <span className="dashboard__stat-label">Última sesión</span>
          </div>
        </div>
      </div>

      {ultimaSesion && (
        <div className="dashboard__card">
          <h3 className="dashboard__titulo">💪 Último entrenamiento</h3>
          <p className="dashboard__fecha">
            {formatearFecha(ultimaSesion.fecha)}
          </p>
          <p className="dashboard__ejercicios">
            {Object.keys(ultimaSesion.ejercicios || {}).length} ejercicios
            realizados
          </p>
        </div>
      )}
    </div>
  );
};
