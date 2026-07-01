import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const ComparativaSemanal = ({ historial }) => {
  const [semanas, setSemanas] = useState(4);

  const procesarDatos = () => {
    if (!historial || historial.length === 0) return [];

    // Agrupar por semana
    const semanasMap = new Map();

    historial.forEach((sesion) => {
      const fecha = new Date(sesion.fecha);
      const semana = getSemana(fecha);

      if (!semanasMap.has(semana)) {
        semanasMap.set(semana, []);
      }
      semanasMap.get(semana).push(sesion);
    });

    // Tomar las últimas N semanas
    const semanasArray = Array.from(semanasMap.entries()).slice(-semanas);

    return semanasArray.map(([semana, sesiones]) => {
      const cargaTotal = sesiones.reduce((sum, sesion) => {
        let cargaSemana = 0;
        Object.values(sesion.ejercicios).forEach((series) => {
          series
            .filter((s) => s?.realizado)
            .forEach((s) => {
              cargaSemana += (s.carga || 0) * (s.reps || 0);
            });
        });
        return sum + cargaSemana;
      }, 0);

      const rpeMedia =
        sesiones.reduce((sum, sesion) => {
          let rpeSum = 0;
          let count = 0;
          Object.values(sesion.ejercicios).forEach((series) => {
            series
              .filter((s) => s?.realizado)
              .forEach((s) => {
                if (s.rpe) {
                  rpeSum += s.rpe;
                  count++;
                }
              });
          });
          return sum + (count > 0 ? rpeSum / count : 0);
        }, 0) / sesiones.length;

      return {
        semana: `Sem ${semana}`,
        sesiones: sesiones.length,
        volumen: Math.round(cargaTotal / 1000),
        rpe: Math.round(rpeMedia * 10) / 10,
      };
    });
  };

  const getSemana = (fecha) => {
    const start = new Date(fecha.getFullYear(), 0, 1);
    const diff = (fecha - start) / (7 * 24 * 60 * 60 * 1000);
    return Math.floor(diff) + 1;
  };

  const datos = procesarDatos();

  if (datos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#718096" }}>
        📊 Aún no hay suficientes datos para comparar semanas
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h4>Comparativa Semanal</h4>
        <select
          value={semanas}
          onChange={(e) => setSemanas(parseInt(e.target.value))}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <option value={4}>Últimas 4 semanas</option>
          <option value={8}>Últimas 8 semanas</option>
          <option value={12}>Últimas 12 semanas</option>
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semana" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="volumen"
              stroke="#667eea"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Volumen (kg)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rpe"
              stroke="#764ba2"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="RPE medio"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "8px",
        }}
      >
        {datos.map((d, idx) => (
          <div
            key={idx}
            style={{
              background: "#f7fafc",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              {d.semana}
            </div>
            <div style={{ fontSize: "12px", color: "#718096" }}>
              <div>🏋️ {d.volumen}k</div>
              <div>📊 {d.rpe}</div>
              <div>📅 {d.sesiones} ses</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
