import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useEntrenamiento } from "../../contexts/EntrenamientoContext";
import { planService } from "../../services/planService";
import { getDiaActual } from "../../utils/helpers";
import { detectarNuevosPRs } from "../../utils/gamificacion";
import { SerieInput } from "./SerieInput";
import { SelectorEjercicios } from "../common/SelectorEjercicios/SelectorEjercicios";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trophy,
  PartyPopper,
  Target,
  Plus,
  Save,
  Loader2,
  WifiOff,
  Wifi,
} from "lucide-react";
import "./Entrenamiento.css";

export const Entrenamiento = () => {
  const { user } = useAuth();
  const { guardarSesion, historial } = useEntrenamiento();
  const [plan, setPlan] = useState(null);
  const [sesionActual, setSesionActual] = useState({});
  const [ejerciciosExtra, setEjerciciosExtra] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [selectorAbierto, setSelectorAbierto] = useState(false);

  // Bug corregido: antes estaba fijo en "Lunes" para pruebas.
  // Ahora usa el día real de la semana.
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
        icono: AlertTriangle,
        texto: "No estás autenticado. Conectando...",
      });
      return;
    }

    const seriesCompletadas = Object.values(sesionActual)
      .flat()
      .filter((s) => s?.realizado).length;

    if (seriesCompletadas === 0) {
      setMensaje({
        tipo: "error",
        icono: AlertTriangle,
        texto: "Debes registrar al menos una serie",
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
    let huboPR = false;

    if (exito) {
      const nuevosPRs = detectarNuevosPRs(sesion, historial);
      huboPR = nuevosPRs.length > 0;
      if (huboPR) {
        const detalle = nuevosPRs
          .map((pr) => `${pr.nombre} (${pr.carga}kg)`)
          .join(", ");
        setMensaje({
          tipo: "exito",
          icono: Trophy,
          texto: `¡Nuevo récord! ${detalle}`,
        });
      } else {
        setMensaje({
          tipo: "exito",
          icono: CheckCircle2,
          texto: `¡Sesión guardada! ${seriesCompletadas} series completadas`,
        });
      }
      setSesionActual({});
      setEjerciciosExtra([]);
    } else {
      setMensaje({
        tipo: "error",
        icono: XCircle,
        texto: "Error al guardar la sesión",
      });
    }

    setGuardando(false);
    setTimeout(() => setMensaje(null), huboPR ? 5000 : 3000);
  };

  const esDiaDescanso = !planHoy || ejerciciosMostrados.length === 0;

  return (
    <div className="entrenamiento">
      {mensaje && (
        <div
          className={`entrenamiento__mensaje entrenamiento__mensaje--${mensaje.tipo}`}
        >
          <mensaje.icono size={16} strokeWidth={1.75} />
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
          {user ? (
            <>
              <Wifi size={13} strokeWidth={2} /> Conectado a Firebase
            </>
          ) : (
            <>
              <WifiOff size={13} strokeWidth={2} /> Sin conexión a Firebase
            </>
          )}
        </p>
      </div>

      {esDiaDescanso && (
        <div className="entrenamiento__descanso">
          <PartyPopper
            size={48}
            strokeWidth={1.5}
            className="entrenamiento__descanso-icono"
          />
          <h3>¡Día de descanso!</h3>
          <p>
            Recupera tus músculos y vuelve más fuerte mañana. Si tu instructor
            te dejó algo para hoy, agrégalo abajo.
          </p>
        </div>
      )}

      {ejerciciosMostrados.map((ejercicio, ejIdx) => (
        <div key={ejIdx} className="entrenamiento__ejercicio">
          <h4 className="entrenamiento__ejercicio-nombre">
            {ejercicio.nombre}
          </h4>
          <p className="entrenamiento__ejercicio-objetivo">
            <Target size={14} strokeWidth={1.75} /> {ejercicio.series} ×{" "}
            {ejercicio.reps}{" "}
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
        <Plus size={16} strokeWidth={2} /> Agregar ejercicio
      </button>

      {!esDiaDescanso && (
        <button
          className="entrenamiento__btn-guardar"
          onClick={handleGuardarSesion}
          disabled={guardando || !user}
        >
          {!user ? (
            <>
              <Loader2 size={18} strokeWidth={2} className="icono-spin" />{" "}
              Conectando...
            </>
          ) : guardando ? (
            <>
              <Loader2 size={18} strokeWidth={2} className="icono-spin" />{" "}
              Guardando...
            </>
          ) : (
            <>
              <Save size={18} strokeWidth={2} /> Guardar sesión
            </>
          )}
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
