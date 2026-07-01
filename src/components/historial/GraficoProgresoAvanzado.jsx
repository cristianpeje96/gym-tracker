import React from "react";
import {
  LineChart,
  Line,
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
import "./GraficoProgresoAvanzado.css";

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
      <div className="grafico-avanzado__selector">
        <select
          className="grafico-avanzado__select"
          value={ejercicioSeleccionado}
          onChange={(e) => setEjercicioSeleccionado(e.target.value)}
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
          <h4 className="grafico-avanzado__titulo">
            Evolución de {ejercicioSeleccionado}
          </h4>

          <div className="grafico-avanzado__grafico">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" />
                <XAxis dataKey="fecha" stroke="#6b6862" fontSize={11} />
                <YAxis yAxisId="left" stroke="#6b6862" fontSize={11} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6b6862"
                  fontSize={11}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="carga"
                  stroke="#e8491c"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Carga (kg)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rpe"
                  stroke="#f2b705"
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" />
                <XAxis dataKey="fecha" stroke="#6b6862" fontSize={11} />
                <YAxis stroke="#6b6862" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="volumen" fill="#e8491c" name="Volumen total" />
                <Area
                  type="monotone"
                  dataKey="carga"
                  fill="#f2b70555"
                  stroke="#f2b705"
                  name="Carga media"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grafico-avanzado__stats">
            <div className="grafico-avanzado__stat">
              <div className="grafico-avanzado__stat-valor grafico-avanzado__stat-valor--iron">
                {datos[datos.length - 1]?.carga || 0} kg
              </div>
              <div className="grafico-avanzado__stat-label">Carga actual</div>
            </div>
            <div className="grafico-avanzado__stat">
              <div className="grafico-avanzado__stat-valor grafico-avanzado__stat-valor--plate">
                {datos[0]?.carga || 0} kg
              </div>
              <div className="grafico-avanzado__stat-label">Carga inicial</div>
            </div>
            <div className="grafico-avanzado__stat">
              <div className="grafico-avanzado__stat-valor grafico-avanzado__stat-valor--success">
                {(() => {
                  const primero = datos[0]?.carga || 0;
                  const ultimo = datos[datos.length - 1]?.carga || 0;
                  const progreso =
                    primero > 0 ? ((ultimo - primero) / primero) * 100 : 0;
                  return `${progreso > 0 ? "+" : ""}${progreso.toFixed(1)}%`;
                })()}
              </div>
              <div className="grafico-avanzado__stat-label">Progreso</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grafico-avanzado__vacio">
          {ejercicioSeleccionado
            ? "📭 Aún no hay datos de este ejercicio"
            : "👆 Selecciona un ejercicio para ver tu progreso"}
        </div>
      )}
    </div>
  );
};
