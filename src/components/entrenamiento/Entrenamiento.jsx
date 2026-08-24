import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useEntrenamiento } from "../../contexts/EntrenamientoContext";
import { planService } from "../../services/planService";
import { obtenerGifPorNombre } from "../../constants/ejerciciosLibrary";
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
  Video,
} from "lucide-react";
import "./Entrenamiento.css";

export const Entrenamiento = () => {
  const { user } = useAuth();
  const {
    guardarSesion,
    historial,
    sesionEnCurso,
    actualizarSesionEnCurso,
    limpiarSesionEnCurso,
  } = useEntrenamiento();
  const { indiceSeleccionado, sesionActual, ejerciciosExtra } = sesionEnCurso;

  const [plan, setPlan] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [gifsAbiertos, setGifsAbiertos] = useState(new Set());

  const cargarPlan = useCallback(async () => {
    if (!user) return;
    const planUsuario = await planService.obtenerPlan(user.uid);
    setPlan(planUsuario);
    // Solo fija el día sugerido como seleccionado si el usuario no tenía
    // ya uno elegido (por ejemplo, si venía de otra pestaña a medio
    // llenar una sesión, no le pisamos su selección).
    if (indiceSeleccionado === null) {
      actualizarSesionEnCurso({
        indiceSeleccionado: planUsuario.diaActualIndice,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    cargarPlan();
  }, [cargarPlan]);

  const indiceDia = indiceSeleccionado ?? plan?.diaActualIndice ?? 0;
  const diaPlan = plan?.dias?.[indiceDia];
  const ejerciciosBase = diaPlan?.ejercicios || [];
  const ejerciciosMostrados = [...ejerciciosBase, ...ejerciciosExtra];

  const handleGuardarSerie = (nombreEjercicio, serieIndex, datos) => {
    const ejercicioActual = sesionActual[nombreEjercicio] || [];
    const nuevasSeries = [...ejercicioActual];
    nuevasSeries[serieIndex] = datos;
    actualizarSesionEnCurso({
      sesionActual: { ...sesionActual, [nombreEjercicio]: nuevasSeries },
    });
  };

  const handleAgregarExtra = (ejercicio) => {
    actualizarSesionEnCurso({
      ejerciciosExtra: [...ejerciciosExtra, ejercicio],
    });
    setSelectorAbierto(false);
  };

  const handleCambiarDia = (indice) => {
    actualizarSesionEnCurso({
      indiceSeleccionado: indice,
      sesionActual: {},
      ejerciciosExtra: [],
    });
  };

  const toggleGif = (ejIdx) => {
    setGifsAbiertos((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(ejIdx)) nuevo.delete(ejIdx);
      else nuevo.add(ejIdx);
      return nuevo;
    });
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
      diaNumero: indiceDia + 1,
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

      // Actualiza en el plan las series/reps/kg reales de lo que se hizo
      // hoy, para que la próxima vez el objetivo mostrado ("4x8 (40kg)")
      // refleje lo último realizado, no lo que se había puesto al armar
      // la rutina.
      let planTrasActualizar = plan;
      if (planTrasActualizar) {
        for (const nombreEjercicio of Object.keys(sesionActual)) {
          const perteneceAlPlan = ejerciciosBase.some(
            (ej) => ej.nombre === nombreEjercicio,
          );
          if (!perteneceAlPlan) continue;

          const realizados = (sesionActual[nombreEjercicio] || []).filter(
            (s) => s?.realizado,
          );
          if (realizados.length === 0) continue;

          const ultimo = realizados[realizados.length - 1];
          const { success, plan: planActualizado } =
            await planService.actualizarEjercicioEnDia(
              user.uid,
              planTrasActualizar,
              indiceDia,
              nombreEjercicio,
              {
                series: realizados.length,
                reps: ultimo.reps,
                carga: ultimo.carga,
              },
            );
          if (success) planTrasActualizar = planActualizado;
        }
      }

      // Avanza el "día sugerido" al siguiente de la rotación.
      if (planTrasActualizar && planTrasActualizar.dias.length > 0) {
        const siguiente = (indiceDia + 1) % planTrasActualizar.dias.length;
        const { success, plan: planFinal } =
          await planService.establecerDiaActual(
            user.uid,
            planTrasActualizar,
            siguiente,
          );
        setPlan(success ? planFinal : planTrasActualizar);
      } else {
        setPlan(planTrasActualizar);
      }

      limpiarSesionEnCurso();
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

  const sinDiasConfigurados = !plan || plan.dias.length === 0;
  const diaSinEjercicios =
    !sinDiasConfigurados && ejerciciosMostrados.length === 0;

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
        <h2 className="entrenamiento__dia">Día {indiceDia + 1}</h2>
        <p className="entrenamiento__nombre-rutina">
          {diaPlan?.nombre || "Sin rutina asignada"}
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

      {!sinDiasConfigurados && plan.dias.length > 1 && (
        <div className="entrenamiento__selector-dias">
          {plan.dias.map((_, idx) => (
            <button
              key={idx}
              className={`entrenamiento__dia-chip ${idx === indiceDia ? "entrenamiento__dia-chip--activo" : ""}`}
              onClick={() => handleCambiarDia(idx)}
            >
              Día {idx + 1}
              {idx === plan.diaActualIndice && (
                <span className="entrenamiento__dia-chip-badge">sugerido</span>
              )}
            </button>
          ))}
        </div>
      )}

      {sinDiasConfigurados && (
        <div className="entrenamiento__descanso">
          <PartyPopper
            size={48}
            strokeWidth={1.5}
            className="entrenamiento__descanso-icono"
          />
          <h3>Aún no tienes días configurados</h3>
          <p>Ve a la pestaña "Plan" y arma tu rutina por días.</p>
        </div>
      )}

      {diaSinEjercicios && (
        <div className="entrenamiento__descanso">
          <PartyPopper
            size={48}
            strokeWidth={1.5}
            className="entrenamiento__descanso-icono"
          />
          <h3>Este día no tiene ejercicios todavía</h3>
          <p>Agrégalos desde aquí abajo, o edítalo desde la pestaña "Plan".</p>
        </div>
      )}

      {ejerciciosMostrados.map((ejercicio, ejIdx) => {
        const gifUrl = obtenerGifPorNombre(ejercicio.nombre);
        const gifAbierto = gifsAbiertos.has(ejIdx);
        return (
          <div key={ejIdx} className="entrenamiento__ejercicio">
            <div className="entrenamiento__ejercicio-header">
              <h4 className="entrenamiento__ejercicio-nombre">
                {ejercicio.nombre}
              </h4>
              {gifUrl && (
                <button
                  className="entrenamiento__btn-ver-gif"
                  onClick={() => toggleGif(ejIdx)}
                  type="button"
                >
                  <Video size={13} strokeWidth={1.75} />
                  {gifAbierto ? "Ocultar" : "Ver ejecución"}
                </button>
              )}
            </div>
            <p className="entrenamiento__ejercicio-objetivo">
              <Target size={14} strokeWidth={1.75} /> {ejercicio.series} ×{" "}
              {ejercicio.reps}{" "}
              {ejercicio.carga > 0
                ? `(${ejercicio.carga} kg)`
                : "(peso corporal)"}
            </p>

            {gifAbierto && gifUrl && (
              <img
                src={gifUrl}
                alt={`Cómo hacer ${ejercicio.nombre}`}
                className="entrenamiento__gif"
                loading="lazy"
              />
            )}

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
        );
      })}

      {!sinDiasConfigurados && (
        <button
          className="entrenamiento__btn-agregar-ejercicio"
          onClick={() => setSelectorAbierto(true)}
        >
          <Plus size={16} strokeWidth={2} /> Agregar ejercicio
        </button>
      )}

      {!sinDiasConfigurados && !diaSinEjercicios && (
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
