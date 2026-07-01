import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";

export const GraficoProgresoAvanzado = ({
  historial,
  ejercicios,
  ejercicioSeleccionado,
  setEjercicioSeleccionado,
}) => {
  const procesarDatos = () => {
    if (!ejercicioSeleccionado) return [];

    const datos = [];
    historial.forEach((sesion) => {
      if (sesion.ejercicios && sesion.ejercicios[ejercicioSeleccionado]) {
        const series = sesion.ejercicios[ejercicioSeleccionado];
        const realizadas = series.filter((s) => s?.realizado);

        if (realizadas.length > 0) {
          const cargaMedia =
            realizadas.reduce((sum, s) => sum + (s.carga || 0), 0) /
            realizadas.length;
          const rpeMedia =
            realizadas.reduce((sum, s) => sum + (s.rpe || 0), 0) /
            realizadas.length;
          const volumen = realizadas.reduce(
            (sum, s) => sum + (s.carga || 0) * (s.reps || 0),
            0,
          );

          datos.push({
            fecha: sesion.fecha,
            carga: Math.round(cargaMedia * 10) / 10,
            rpe: Math.round(rpeMedia * 10) / 10,
            volumen: Math.round(volumen),
            series: realizadas.length,
          });
        }
      }
    });

    return datos;
  };

  const datos = procesarDatos();

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <select
          value={ejercicioSeleccionado}
          onChange={(e) => setEjercicioSeleccionado(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
          }}
        >
          <option value="">Selecciona un ejercicio</option>
          {ejercicios.map((ej) => (
            <option key={ej} value={ej}>
              {ej}
            </option>
          ))}
        </select>
      </div>

      {ejercicioSeleccionado && datos.length > 0 ? (
        <div>
          <h4 style={{ marginBottom: "12px" }}>
            Evolución de {ejercicioSeleccionado}
          </h4>

          <div style={{ marginBottom: "24px" }}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="carga"
                  stroke="#667eea"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Carga (kg)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rpe"
                  stroke="#764ba2"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="RPE"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volumen" fill="#667eea" name="Volumen total" />
                <Area
                  type="monotone"
                  dataKey="carga"
                  fill="#764ba2"
                  stroke="#764ba2"
                  name="Carga media"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              marginTop: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            <div
              style={{
                background: "#f7fafc",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#667eea",
                }}
              >
                {datos[datos.length - 1]?.carga || 0} kg
              </div>
              <div style={{ fontSize: "12px", color: "#718096" }}>
                Carga actual
              </div>
            </div>
            <div
              style={{
                background: "#f7fafc",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#764ba2",
                }}
              >
                {datos[0]?.carga || 0} kg
              </div>
              <div style={{ fontSize: "12px", color: "#718096" }}>
                Carga inicial
              </div>
            </div>
            <div
              style={{
                background: "#f7fafc",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#48bb78",
                }}
              >
                {(() => {
                  const primero = datos[0]?.carga || 0;
                  const ultimo = datos[datos.length - 1]?.carga || 0;
                  const progreso =
                    primero > 0 ? ((ultimo - primero) / primero) * 100 : 0;
                  return `${progreso > 0 ? "+" : ""}${progreso.toFixed(1)}%`;
                })()}
              </div>
              <div style={{ fontSize: "12px", color: "#718096" }}>Progreso</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", color: "#718096" }}>
          {ejercicioSeleccionado
            ? "📭 Aún no hay datos de este ejercicio"
            : "👆 Selecciona un ejercicio para ver tu progreso"}
        </div>
      )}
    </div>
  );
};
