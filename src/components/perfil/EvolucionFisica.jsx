import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../hooks/useAuth";
import { nutricionService } from "../../services/nutricionService";
import { medidasService } from "../../services/medidasService";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  LineChart as LineChartIcon,
} from "lucide-react";
import "./EvolucionFisica.css";

const CAMPOS_MEDIDAS = [
  { id: "brazoIzq", label: "Brazo izquierdo" },
  { id: "brazoDer", label: "Brazo derecho" },
  { id: "pectoral", label: "Pectoral" },
  { id: "cintura", label: "Cintura" },
  { id: "cadera", label: "Cadera" },
  { id: "cuadricepsDer", label: "Cuádriceps derecho" },
  { id: "cuadricepsIzq", label: "Cuádriceps izquierdo" },
];

const TooltipEstilo = {
  background: "#16141f",
  border: "1px solid #2a2836",
  borderRadius: 8,
  color: "#fff",
};

const Tendencia = ({ primero, ultimo, unidad }) => {
  if (primero == null || ultimo == null) return null;
  const diferencia = ultimo - primero;
  const Icono =
    diferencia > 0 ? TrendingUp : diferencia < 0 ? TrendingDown : Minus;
  return (
    <span className="evolucion-fisica__tendencia">
      <Icono size={13} strokeWidth={2} />
      {diferencia > 0 ? "+" : ""}
      {diferencia.toFixed(1)} {unidad}
    </span>
  );
};

export const EvolucionFisica = ({ refrescarKey }) => {
  const { user } = useAuth();
  const [pesos, setPesos] = useState([]);
  const [medidasHistorial, setMedidasHistorial] = useState([]);
  const [pestana, setPestana] = useState("peso");
  const [campoMedida, setCampoMedida] = useState(CAMPOS_MEDIDAS[0].id);

  const cargar = useCallback(async () => {
    if (!user) return;
    const [datosNutricion, historialMedidas] = await Promise.all([
      nutricionService.obtenerDatos(user.uid),
      medidasService.obtenerHistorial(user.uid),
    ]);
    setPesos(datosNutricion.pesos || []);
    setMedidasHistorial(historialMedidas || []);
  }, [user]);

  useEffect(() => {
    cargar();
  }, [cargar, refrescarKey]);

  const datosPeso = useMemo(
    () =>
      [...pesos]
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .map((p) => ({ fecha: p.fecha, valor: p.peso })),
    [pesos],
  );

  const datosMedida = useMemo(
    () =>
      [...medidasHistorial]
        .filter((m) => m[campoMedida])
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .map((m) => ({ fecha: m.fecha, valor: parseFloat(m[campoMedida]) })),
    [medidasHistorial, campoMedida],
  );

  const datosActivos = pestana === "peso" ? datosPeso : datosMedida;
  const unidad = pestana === "peso" ? "kg" : "cm";

  return (
    <div className="evolucion-fisica">
      <div className="evolucion-fisica__tabs">
        <button
          className={`evolucion-fisica__tab ${pestana === "peso" ? "evolucion-fisica__tab--activo" : ""}`}
          onClick={() => setPestana("peso")}
        >
          Peso corporal
        </button>
        <button
          className={`evolucion-fisica__tab ${pestana === "medidas" ? "evolucion-fisica__tab--activo" : ""}`}
          onClick={() => setPestana("medidas")}
        >
          Medidas
        </button>
      </div>

      {pestana === "medidas" && (
        <select
          className="evolucion-fisica__select"
          value={campoMedida}
          onChange={(e) => setCampoMedida(e.target.value)}
        >
          {CAMPOS_MEDIDAS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      )}

      {datosActivos.length < 2 ? (
        <div className="evolucion-fisica__vacio">
          <LineChartIcon size={22} strokeWidth={1.5} />
          <span>
            Necesitas al menos 2 registros para ver la evolución. Sigue
            registrando {pestana === "peso" ? "tu peso" : "tus medidas"} para
            construir tu historial.
          </span>
        </div>
      ) : (
        <>
          <div className="evolucion-fisica__resumen">
            <div className="evolucion-fisica__resumen-valor">
              {datosActivos[datosActivos.length - 1].valor} {unidad}
            </div>
            <Tendencia
              primero={datosActivos[0].valor}
              ultimo={datosActivos[datosActivos.length - 1].valor}
              unidad={unidad}
            />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={datosActivos}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2836" />
              <XAxis dataKey="fecha" stroke="#9ca3af" fontSize={10} />
              <YAxis
                stroke="#9ca3af"
                fontSize={10}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip contentStyle={TooltipEstilo} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ r: 3, fill: "#a78bfa" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};
