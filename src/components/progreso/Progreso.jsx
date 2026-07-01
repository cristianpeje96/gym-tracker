import React, { useState, useEffect } from "react";
import { useEntrenamiento } from "../../contexts/EntrenamientoContext";
import { PLAN_ENTRENAMIENTO } from "../../constants/planEntrenamiento";
import { GraficoProgreso } from "./GraficoProgreso";
import "./Progreso.module.css";

export const Progreso = () => {
  const { historial } = useEntrenamiento();
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState("");
  const [ejercicios, setEjercicios] = useState([]);
  const [datosProgreso, setDatosProgreso] = useState([]);

  useEffect(() => {
    // Extraer ejercicios únicos del plan
    const ejerciciosUnicos = new Set();
    Object.values(PLAN_ENTRENAMIENTO).forEach((plan) => {
      plan.ejercicios.forEach((ej) => ejerciciosUnicos.add(ej.nombre));
    });
    setEjercicios(Array.from(ejerciciosUnicos).sort());
  }, []);

  useEffect(() => {
    if (!ejercicioSeleccionado || historial.length === 0) return;

    const progreso = [];
    historial.forEach((sesion) => {
      const ejercicioData = sesion.ejercicios[ejercicioSeleccionado];
      if (ejercicioData && ejercicioData.length > 0) {
        // Calcular carga media y RPE medio de la sesión
        const cargaMedia =
          ejercicioData.reduce((sum, serie) => sum + (serie.carga || 0), 0) /
          ejercicioData.length;
        const rpeMedia =
          ejercicioData.reduce((sum, serie) => sum + (serie.rpe || 0), 0) /
          ejercicioData.length;

        progreso.push({
          fecha: sesion.fecha,
          carga: cargaMedia,
          rpe: rpeMedia,
          series: ejercicioData.length,
        });
      }
    });

    setDatosProgreso(progreso.reverse());
  }, [ejercicioSeleccionado, historial]);

  const handleEjercicioChange = (e) => {
    setEjercicioSeleccionado(e.target.value);
  };

  return (
    <div className="progreso">
      <div className="progreso__card">
        <h3 className="progreso__titulo">📈 Seguimiento de progreso</h3>
        <p className="progreso__subtitulo">
          Visualiza la evolución de tus cargas y rendimiento
        </p>

        <div className="progreso__selector">
          <label className="progreso__label">Selecciona un ejercicio:</label>
          <select
            className="progreso__select"
            value={ejercicioSeleccionado}
            onChange={handleEjercicioChange}
          >
            <option value="">-- Elige un ejercicio --</option>
            {ejercicios.map((ej) => (
              <option key={ej} value={ej}>
                {ej}
              </option>
            ))}
          </select>
        </div>
      </div>

      {ejercicioSeleccionado && (
        <>
          {datosProgreso.length > 0 ? (
            <>
              <div className="progreso__stats">
                <div className="progreso__stat">
                  <div className="progreso__stat-valor">
                    {datosProgreso[datosProgreso.length - 1]?.carga.toFixed(
                      1,
                    ) || 0}{" "}
                    kg
                  </div>
                  <div className="progreso__stat-label">Carga actual</div>
                </div>
                <div className="progreso__stat">
                  <div className="progreso__stat-valor">
                    {datosProgreso[0]?.carga.toFixed(1) || 0} kg
                  </div>
                  <div className="progreso__stat-label">Carga inicial</div>
                </div>
                <div className="progreso__stat">
                  <div className="progreso__stat-valor">
                    {(() => {
                      const primera = datosProgreso[0]?.carga || 0;
                      const ultima =
                        datosProgreso[datosProgreso.length - 1]?.carga || 0;
                      const diferencia = ultima - primera;
                      const porcentaje =
                        primera > 0 ? (diferencia / primera) * 100 : 0;
                      return `${porcentaje > 0 ? "+" : ""}${porcentaje.toFixed(1)}%`;
                    })()}
                  </div>
                  <div className="progreso__stat-label">Progreso</div>
                </div>
              </div>

              <GraficoProgreso
                datos={datosProgreso}
                ejercicio={ejercicioSeleccionado}
              />

              <div className="progreso__card">
                <h4 className="progreso__subtitulo-card">
                  📊 Historial de sesiones
                </h4>
                <div className="progreso__tabla">
                  <div className="progreso__tabla-header">
                    <span>Fecha</span>
                    <span>Carga media</span>
                    <span>RPE medio</span>
                    <span>Series</span>
                  </div>
                  {datosProgreso.map((item, index) => (
                    <div key={index} className="progreso__tabla-fila">
                      <span>{item.fecha}</span>
                      <span>{item.carga.toFixed(1)} kg</span>
                      <span>{item.rpe.toFixed(1)}</span>
                      <span>{item.series}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="progreso__card">
              <div className="progreso__vacio">
                <div className="progreso__vacio-icono">📭</div>
                <p>Aún no hay datos de este ejercicio</p>
                <p className="progreso__vacio-texto">
                  Completa algunas sesiones de entrenamiento para ver tu
                  progreso
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
