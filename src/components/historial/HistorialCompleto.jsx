import React, { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useEntrenamiento } from "../../contexts/EntrenamientoContext";
import { GraficoProgresoAvanzado } from "./GraficoProgresoAvanzado";
import { ComparativaSemanal } from "./ComparativaSemanal";
import {
  BarChart3,
  TrendingUp,
  GitCompareArrows,
  ClipboardList,
  Loader2,
} from "lucide-react";
import "./HistorialCompleto.css";

export const HistorialCompleto = () => {
  const { user } = useAuth();
  const { historial, cargando } = useEntrenamiento();
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState("");
  const [vista, setVista] = useState("progreso");

  const ejercicios = useMemo(() => {
    const set = new Set();
    historial.forEach((sesion) => {
      if (sesion.ejercicios) {
        Object.keys(sesion.ejercicios).forEach((ej) => set.add(ej));
      }
    });
    return Array.from(set);
  }, [historial]);

  return (
    <div className="historial">
      <h2 className="historial__titulo">
        <BarChart3 size={20} strokeWidth={1.75} /> Historial y Progreso
      </h2>

      {!user || cargando ? (
        <div className="historial__cargando">
          <Loader2 size={20} strokeWidth={2} className="icono-spin" />
          <p>Conectando a la nube...</p>
        </div>
      ) : (
        <>
          <div className="historial__tabs">
            <button
              className={`historial__tab ${vista === "progreso" ? "historial__tab--activo" : ""}`}
              onClick={() => setVista("progreso")}
            >
              <TrendingUp size={15} strokeWidth={1.75} /> Progreso
            </button>
            <button
              className={`historial__tab ${vista === "comparativa" ? "historial__tab--activo" : ""}`}
              onClick={() => setVista("comparativa")}
            >
              <GitCompareArrows size={15} strokeWidth={1.75} /> Comparativa
            </button>
            <button
              className={`historial__tab ${vista === "lista" ? "historial__tab--activo" : ""}`}
              onClick={() => setVista("lista")}
            >
              <ClipboardList size={15} strokeWidth={1.75} /> Historial
            </button>
          </div>

          <div className="historial__contenido">
            {vista === "progreso" && (
              <GraficoProgresoAvanzado
                historial={historial}
                ejercicios={ejercicios}
                ejercicioSeleccionado={ejercicioSeleccionado}
                setEjercicioSeleccionado={setEjercicioSeleccionado}
              />
            )}

            {vista === "comparativa" && (
              <ComparativaSemanal historial={historial} />
            )}

            {vista === "lista" && (
              <div>
                <h4 className="historial__subtitulo">
                  <ClipboardList size={16} strokeWidth={1.75} /> Últimas
                  sesiones
                </h4>
                {historial.length === 0 ? (
                  <p className="historial__vacio">
                    Aún no hay sesiones guardadas
                  </p>
                ) : (
                  historial
                    .slice()
                    .reverse()
                    .slice(0, 20)
                    .map((sesion, idx) => (
                      <div key={idx} className="historial__sesion">
                        <div className="historial__sesion-header">
                          <span>
                            <strong>{sesion.fecha}</strong> - {sesion.dia}
                          </span>
                          <span>
                            {sesion.ejercicios
                              ? Object.keys(sesion.ejercicios).length
                              : 0}{" "}
                            ejercicios
                          </span>
                        </div>
                        <div className="historial__sesion-detalle">
                          {sesion.ejercicios
                            ? Object.entries(sesion.ejercicios).map(
                                ([nombre, series]) => {
                                  const realizadas = series
                                    ? series.filter((s) => s?.realizado).length
                                    : 0;
                                  return `${nombre} (${realizadas}/${series ? series.length : 0}) `;
                                },
                              )
                            : "Sin datos"}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>

          <div className="historial__resumen">
            <BarChart3 size={14} strokeWidth={1.75} /> Total sesiones:{" "}
            {historial.length}
          </div>
        </>
      )}
    </div>
  );
};
