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
import "./ComparativaSemanal.css";

export const ComparativaSemanal = ({ historial }) => {
  const [semanas, setSemanas] = useState(4);

  const getSemana = (fecha) => {
    const start = new Date(fecha.getFullYear(), 0, 1);
    const diff = (fecha - start) / (7 * 24 * 60 * 60 * 1000);
    return Math.floor(diff) + 1;
  };

  const procesarDatos = () => {
    if (!historial || historial.length === 0) return [];

    const semanasMap = new Map();

    historial.forEach((sesion) => {
      const fecha = new Date(sesion.fecha);
      const semana = getSemana(fecha);

      if (!semanasMap.has(semana)) {
        semanasMap.set(semana, []);
      }
      semanasMap.get(semana).push(sesion);
    });

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

  const datos = procesarDatos();

  if (datos.length === 0) {
    return (
      <div className="comparativa__vacio">
        📊 Aún no hay suficientes datos para comparar semanas
      </div>
    );
  }

  return (
    <div>
      <div className="comparativa__header">
        <h4>Comparativa Semanal</h4>
        <select
          className="comparativa__select"
          value={semanas}
          onChange={(e) => setSemanas(parseInt(e.target.value))}
        >
          <option value={4}>Últimas 4 semanas</option>
          <option value={8}>Últimas 8 semanas</option>
          <option value={12}>Últimas 12 semanas</option>
        </select>
      </div>

      <div className="comparativa__grafico">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" />
            <XAxis dataKey="semana" stroke="#6b6862" fontSize={12} />
            <YAxis yAxisId="left" stroke="#6b6862" fontSize={12} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b6862"
              fontSize={12}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="volumen"
              stroke="#e8491c"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Volumen (kg)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rpe"
              stroke="#f2b705"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="RPE medio"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="comparativa__grid">
        {datos.map((d, idx) => (
          <div key={idx} className="comparativa__card">
            <div className="comparativa__card-semana">{d.semana}</div>
            <div className="comparativa__card-datos">
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
