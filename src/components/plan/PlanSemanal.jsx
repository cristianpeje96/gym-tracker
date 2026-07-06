import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { planService } from "../../services/planService";
import { DIAS_SEMANA } from "../../constants/planEntrenamiento";
import { SelectorEjercicios } from "../common/SelectorEjercicios/SelectorEjercicios";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  PartyPopper,
  Loader2,
} from "lucide-react";
import "./PlanSemanal.css";

export const PlanSemanal = () => {
  const { user } = useAuth();
  const hoy = DIAS_SEMANA[new Date().getDay()];
  const [plan, setPlan] = useState(null);
  const [diaExpandido, setDiaExpandido] = useState(hoy);
  const [diaParaAgregar, setDiaParaAgregar] = useState(null);

  const cargarPlan = useCallback(async () => {
    if (!user) return;
    const planUsuario = await planService.obtenerPlan(user.uid);
    setPlan(planUsuario);
  }, [user]);

  useEffect(() => {
    cargarPlan();
  }, [cargarPlan]);

  const handleAgregarEjercicio = async (ejercicio) => {
    if (!user || !plan || !diaParaAgregar) return;
    const { success, plan: nuevoPlan } = await planService.agregarEjercicioADia(
      user.uid,
      plan,
      diaParaAgregar,
      ejercicio,
    );
    if (success) setPlan(nuevoPlan);
    setDiaParaAgregar(null);
  };

  const handleQuitarEjercicio = async (dia, indice) => {
    if (!user || !plan) return;
    const { success, plan: nuevoPlan } = await planService.quitarEjercicioDeDia(
      user.uid,
      plan,
      dia,
      indice,
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
          semanal
        </h2>
        <p className="plan-semanal__subtitulo">
          Toca un día para verlo completo y agregar ejercicios
        </p>
      </div>

      <div className="plan-semanal__grid">
        {Object.entries(plan).map(([dia, planDia]) => {
          const expandido = diaExpandido === dia;
          return (
            <div
              key={dia}
              className={`plan-semanal__dia ${hoy === dia ? "plan-semanal__dia--hoy" : ""}`}
            >
              <button
                className="plan-semanal__dia-header"
                onClick={() => setDiaExpandido(expandido ? null : dia)}
              >
                <span className="plan-semanal__dia-nombre">{dia}</span>
                <div className="plan-semanal__dia-header-derecha">
                  {hoy === dia && (
                    <span className="plan-semanal__hoy-badge">HOY</span>
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
                  {planDia.ejercicios.length > 0 ? (
                    <>
                      <div className="plan-semanal__grupo">
                        <strong>{planDia.nombre}</strong>
                      </div>
                      <div className="plan-semanal__ejercicios">
                        {planDia.ejercicios.map((ej, idx) => (
                          <div key={idx} className="plan-semanal__ejercicio">
                            <span className="plan-semanal__ejercicio-nombre">
                              {ej.nombre}
                            </span>
                            <span className="plan-semanal__ejercicio-derecha">
                              <span className="plan-semanal__ejercicio-detalle">
                                {ej.series}x{ej.reps}
                              </span>
                              <button
                                className="plan-semanal__quitar"
                                onClick={() => handleQuitarEjercicio(dia, idx)}
                                aria-label="Quitar ejercicio"
                              >
                                <X size={13} strokeWidth={2.5} />
                              </button>
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="plan-semanal__descanso">
                      <PartyPopper size={16} strokeWidth={1.75} /> Sin
                      ejercicios asignados todavía
                    </div>
                  )}

                  <button
                    className="plan-semanal__btn-agregar"
                    onClick={() => setDiaParaAgregar(dia)}
                  >
                    <Plus size={14} strokeWidth={2} /> Agregar ejercicio a este
                    día
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SelectorEjercicios
        abierto={!!diaParaAgregar}
        onCerrar={() => setDiaParaAgregar(null)}
        onAgregar={handleAgregarEjercicio}
      />
    </div>
  );
};
