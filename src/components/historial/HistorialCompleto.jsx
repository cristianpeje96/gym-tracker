import React, { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "../../firebase/firebase";
import { entrenamientoService } from "../../services/entrenamientoService";
import { GraficoProgresoAvanzado } from "./GraficoProgresoAvanzado";
import { ComparativaSemanal } from "./ComparativaSemanal";

export const HistorialCompleto = () => {
  const [userId, setUserId] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState("");
  const [ejercicios, setEjercicios] = useState([]);
  const [vista, setVista] = useState("progreso");

  useEffect(() => {
    // Verificar que auth existe
    if (!auth) {
      console.error("Firebase auth no inicializado");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const data = await entrenamientoService.obtenerHistorial(user.uid);
        setHistorial(data);

        const ejerciciosSet = new Set();
        data.forEach((sesion) => {
          if (sesion.ejercicios) {
            Object.keys(sesion.ejercicios).forEach((ej) =>
              ejerciciosSet.add(ej),
            );
          }
        });
        setEjercicios(Array.from(ejerciciosSet));
      } else {
        console.log("Usuario no autenticado");
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "16px" }}>📊 Historial y Progreso</h2>

      {!userId ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            background: "white",
            borderRadius: "16px",
          }}
        >
          <p>🔄 Conectando a la nube...</p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              overflowX: "auto",
            }}
          >
            <button
              onClick={() => setVista("progreso")}
              style={{
                padding: "8px 16px",
                background: vista === "progreso" ? "#667eea" : "#e2e8f0",
                color: vista === "progreso" ? "white" : "#4a5568",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              📈 Progreso
            </button>
            <button
              onClick={() => setVista("comparativa")}
              style={{
                padding: "8px 16px",
                background: vista === "comparativa" ? "#667eea" : "#e2e8f0",
                color: vista === "comparativa" ? "white" : "#4a5568",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              📊 Comparativa
            </button>
            <button
              onClick={() => setVista("lista")}
              style={{
                padding: "8px 16px",
                background: vista === "lista" ? "#667eea" : "#e2e8f0",
                color: vista === "lista" ? "white" : "#4a5568",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              📋 Historial
            </button>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
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
                <h4>📋 Últimas sesiones</h4>
                {historial.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#718096" }}>
                    Aún no hay sesiones guardadas
                  </p>
                ) : (
                  historial
                    .slice()
                    .reverse()
                    .slice(0, 20)
                    .map((sesion, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px",
                          marginBottom: "8px",
                          background: "#f7fafc",
                          borderRadius: "8px",
                          borderLeft: "4px solid #667eea",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
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
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#718096",
                            marginTop: "4px",
                          }}
                        >
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

          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "#edf2f7",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            📊 Total sesiones: {historial.length}
          </div>
        </>
      )}
    </div>
  );
};
