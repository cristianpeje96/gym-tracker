import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { planService } from "../../services/planService";
import { SelectorEjercicios } from "../common/SelectorEjercicios/SelectorEjercicios";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  PartyPopper,
  Loader2,
  Trash2,
} from "lucide-react";
import "./PlanSemanal.css";

export const PlanSemanal = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [diaExpandido, setDiaExpandido] = useState(0);
  const [diaParaAgregar, setDiaParaAgregar] = useState(null);
  const [nombresEditados, setNombresEditados] = useState({});

  const cargarPlan = useCallback(async () => {
    if (!user) return;
    const planUsuario = await planService.obtenerPlan(user.uid);
    setPlan(planUsuario);
  }, [user]);

  useEffect(() => {
    cargarPlan();
  }, [cargarPlan]);

  const handleAgregarEjercicio = async (ejercicio) => {
    if (!user || !plan || diaParaAgregar === null) return;
    const { success, plan: nuevoPlan } = await planService.agregarEjercicioADia(
      user.uid,
      plan,
      diaParaAgregar,
      ejercicio,
    );
    if (success) setPlan(nuevoPlan);
    setDiaParaAgregar(null);
  };

  const handleQuitarEjercicio = async (indiceDia, indiceEjercicio) => {
    if (!user || !plan) return;
    const { success, plan: nuevoPlan } = await planService.quitarEjercicioDeDia(
      user.uid,
      plan,
      indiceDia,
      indiceEjercicio,
    );
    if (success) setPlan(nuevoPlan);
  };

  const handleAgregarDia = async () => {
    if (!user || !plan) return;
    const { success, plan: nuevoPlan } = await planService.agregarDia(
      user.uid,
      plan,
    );
    if (success) {
      setPlan(nuevoPlan);
      setDiaExpandido(nuevoPlan.dias.length - 1);
    }
  };

  const handleQuitarDia = async (indice) => {
    if (!user || !plan || plan.dias.length <= 1) return;
    const { success, plan: nuevoPlan } = await planService.quitarDia(
      user.uid,
      plan,
      indice,
    );
    if (success) {
      setPlan(nuevoPlan);
      setDiaExpandido(null);
    }
  };

  const handleGuardarNombre = async (indice) => {
    if (!user || !plan) return;
    const nombre = nombresEditados[indice];
    if (nombre === undefined || nombre === plan.dias[indice].nombre) return;
    const { success, plan: nuevoPlan } = await planService.renombrarDia(
      user.uid,
      plan,
      indice,
      nombre,
    );
    if (success) setPlan(nuevoPlan);
  };

  if (!plan) {
    return (
      <div className="plan-semanal">
        <p className="plan-semanal__cargando">
          <Loader2 size={18} strokeWidth={2} className="icono-spin" />
          Cargando tu plan...
        </p>
      </div>
    );
  }

  return (
    <div className="plan-semanal">
      <div className="plan-semanal__header">
        <h2 className="plan-semanal__titulo">
          <Calendar size={20} strokeWidth={1.75} /> Plan de entrenamiento
        </h2>
        <p className="plan-semanal__subtitulo">
          Días numerados, no atados a un día fijo de la semana. Toca uno para
          verlo completo y agregar ejercicios.
        </p>
      </div>

      <div className="plan-semanal__grid">
        {plan.dias.map((planDia, indice) => {
          const expandido = diaExpandido === indice;
          const esSugerido = plan.diaActualIndice === indice;
          return (
            <div
              key={indice}
              className={`plan-semanal__dia ${esSugerido ? "plan-semanal__dia--hoy" : ""}`}
            >
              <button
                className="plan-semanal__dia-header"
                onClick={() => setDiaExpandido(expandido ? null : indice)}
              >
                <span className="plan-semanal__dia-nombre">
                  Día {indice + 1}
                  {planDia.nombre ? ` · ${planDia.nombre}` : ""}
                </span>
                <div className="plan-semanal__dia-header-derecha">
                  {esSugerido && (
                    <span className="plan-semanal__hoy-badge">SUGERIDO</span>
                  )}
                  <span className="plan-semanal__chevron">
                    {expandido ? (
                      <ChevronUp size={16} strokeWidth={2} />
                    ) : (
                      <ChevronDown size={16} strokeWidth={2} />
                    )}
                  </span>
                </div>
              </button>

              {expandido && (
                <div className="plan-semanal__dia-contenido">
                  <input
                    type="text"
                    className="plan-semanal__nombre-input"
                    placeholder="Nombre de este día (ej: Torso A, Pierna...)"
                    value={nombresEditados[indice] ?? planDia.nombre ?? ""}
                    onChange={(e) =>
                      setNombresEditados((prev) => ({
                        ...prev,
                        [indice]: e.target.value,
                      }))
                    }
                    onBlur={() => handleGuardarNombre(indice)}
                  />

                  {planDia.ejercicios.length > 0 ? (
                    <div className="plan-semanal__ejercicios">
                      {planDia.ejercicios.map((ej, idx) => (
                        <div key={idx} className="plan-semanal__ejercicio">
                          <span className="plan-semanal__ejercicio-nombre">
                            {ej.nombre}
                          </span>
                          <span className="plan-semanal__ejercicio-derecha">
                            <span className="plan-semanal__ejercicio-detalle">
                              {ej.series}x{ej.reps}
                              {ej.carga > 0 ? ` · ${ej.carga}kg` : " · PC"}
                            </span>
                            <button
                              className="plan-semanal__quitar"
                              onClick={() => handleQuitarEjercicio(indice, idx)}
                              aria-label="Quitar ejercicio"
                            >
                              <X size={13} strokeWidth={2.5} />
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="plan-semanal__descanso">
                      <PartyPopper size={16} strokeWidth={1.75} /> Sin
                      ejercicios asignados todavía
                    </div>
                  )}

                  <button
                    className="plan-semanal__btn-agregar"
                    onClick={() => setDiaParaAgregar(indice)}
                  >
                    <Plus size={14} strokeWidth={2} /> Agregar ejercicio a este
                    día
                  </button>

                  {plan.dias.length > 1 && (
                    <button
                      className="plan-semanal__btn-quitar-dia"
                      onClick={() => handleQuitarDia(indice)}
                    >
                      <Trash2 size={13} strokeWidth={1.75} /> Quitar Día{" "}
                      {indice + 1} de la rutina
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="plan-semanal__btn-agregar-dia"
        onClick={handleAgregarDia}
      >
        <Plus size={16} strokeWidth={2} /> Agregar un día más a la rutina
      </button>

      <SelectorEjercicios
        abierto={diaParaAgregar !== null}
        onCerrar={() => setDiaParaAgregar(null)}
        onAgregar={handleAgregarEjercicio}
      />
    </div>
  );
};
