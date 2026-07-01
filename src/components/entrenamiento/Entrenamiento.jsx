import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useEntrenamiento } from "../../contexts/EntrenamientoContext";
import { planService } from "../../services/planService";
import { getDiaActual } from "../../utils/helpers";
import { SerieInput } from "./SerieInput";
import { SelectorEjercicios } from "../common/SelectorEjercicios/SelectorEjercicios";
import "./Entrenamiento.css";

export const Entrenamiento = () => {
  const { user } = useAuth();
  const { guardarSesion } = useEntrenamiento();
  const [plan, setPlan] = useState(null);
  const [sesionActual, setSesionActual] = useState({});
  const [ejerciciosExtra, setEjerciciosExtra] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [selectorAbierto, setSelectorAbierto] = useState(false);

  const hoy = getDiaActual();

  const cargarPlan = useCallback(async () => {
    if (!user) return;
    const planUsuario = await planService.obtenerPlan(user.uid);
    setPlan(planUsuario);
  }, [user]);

  useEffect(() => {
    cargarPlan();
  }, [cargarPlan]);

  const planHoy = plan?.[hoy];
  const ejerciciosBase = planHoy?.ejercicios || [];
  const ejerciciosMostrados = [...ejerciciosBase, ...ejerciciosExtra];

  const handleGuardarSerie = (nombreEjercicio, serieIndex, datos) => {
    setSesionActual((prev) => {
      const ejercicioActual = prev[nombreEjercicio] || [];
      const nuevasSeries = [...ejercicioActual];
      nuevasSeries[serieIndex] = datos;
      return { ...prev, [nombreEjercicio]: nuevasSeries };
    });
  };

  const handleAgregarExtra = (ejercicio) => {
    setEjerciciosExtra((prev) => [...prev, ejercicio]);
    setSelectorAbierto(false);
  };

  const handleGuardarSesion = async () => {
    if (!user) {
      setMensaje({
        tipo: "error",
        texto: "⚠️ No estás autenticado. Conectando...",
      });
      return;
    }

    const seriesCompletadas = Object.values(sesionActual)
      .flat()
      .filter((s) => s?.realizado).length;

    if (seriesCompletadas === 0) {
      setMensaje({
        tipo: "error",
        texto: "⚠️ Debes registrar al menos una serie",
      });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    setGuardando(true);

    const sesion = {
      fecha: new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString(),
      dia: hoy,
      ejercicios: sesionActual,
    };

    const exito = await guardarSesion(sesion);

    if (exito) {
      setMensaje({
        tipo: "exito",
        texto: `✅ ¡Sesión guardada! ${seriesCompletadas} series completadas`,
      });
      setSesionActual({});
      setEjerciciosExtra([]);
    } else {
      setMensaje({ tipo: "error", texto: "❌ Error al guardar la sesión" });
    }

    setGuardando(false);
    setTimeout(() => setMensaje(null), 3000);
  };

  const esDiaDescanso = !planHoy || ejerciciosMostrados.length === 0;

  return (
    <div className="entrenamiento">
      {mensaje && (
        <div
          className={`entrenamiento__mensaje entrenamiento__mensaje--${mensaje.tipo}`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="entrenamiento__header">
        <h2 className="entrenamiento__dia">{hoy}</h2>
        <p className="entrenamiento__nombre-rutina">
          {planHoy?.nombre || "Sin rutina asignada"}
        </p>
        <p
          className={`entrenamiento__estado ${user ? "entrenamiento__estado--ok" : "entrenamiento__estado--error"}`}
        >
          {user ? "✅ Conectado a Firebase" : "❌ Sin conexión a Firebase"}
        </p>
      </div>

      {esDiaDescanso && (
        <div className="entrenamiento__descanso">
          <div className="entrenamiento__descanso-icono">🎉</div>
          <h3>¡Día de descanso!</h3>
          <p>
            Recupera tus músculos y vuelve más fuerte mañana 💪. Si tu
            instructor te dejó algo para hoy, agrégalo abajo.
          </p>
        </div>
      )}

      {ejerciciosMostrados.map((ejercicio, ejIdx) => (
        <div key={ejIdx} className="entrenamiento__ejercicio">
          <h4 className="entrenamiento__ejercicio-nombre">
            {ejercicio.nombre}
          </h4>
          <p className="entrenamiento__ejercicio-objetivo">
            🎯 {ejercicio.series} × {ejercicio.reps}{" "}
            {ejercicio.carga > 0
              ? `(${ejercicio.carga} kg)`
              : "(peso corporal)"}
          </p>

          {[...Array(ejercicio.series)].map((_, serieIdx) => (
            <SerieInput
              key={serieIdx}
              numero={serieIdx + 1}
              repsObjetivo={ejercicio.reps}
              cargaObjetivo={ejercicio.carga}
              onGuardar={(datos) =>
                handleGuardarSerie(ejercicio.nombre, serieIdx, datos)
              }
            />
          ))}
        </div>
      ))}

      <button
        className="entrenamiento__btn-agregar-ejercicio"
        onClick={() => setSelectorAbierto(true)}
      >
        + Agregar ejercicio
      </button>

      {!esDiaDescanso && (
        <button
          className="entrenamiento__btn-guardar"
          onClick={handleGuardarSesion}
          disabled={guardando || !user}
        >
          {!user
            ? "🔄 Conectando..."
            : guardando
              ? "💾 Guardando..."
              : "💾 Guardar sesión"}
        </button>
      )}

      <SelectorEjercicios
        abierto={selectorAbierto}
        onCerrar={() => setSelectorAbierto(false)}
        onAgregar={handleAgregarExtra}
      />
    </div>
  );
};
