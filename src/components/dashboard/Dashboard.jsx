import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getDiaActual, formatearFecha } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";
import { useEntrenamiento } from "../../contexts/EntrenamientoContext";
import { planService } from "../../services/planService";
import {
  calcularRacha,
  calcularRecords,
  progresoSemana,
} from "../../utils/gamificacion";
import {
  Flame,
  Calendar,
  Target,
  BarChart3,
  Trophy,
  Dumbbell,
  PartyPopper,
  GraduationCap,
} from "lucide-react";
import "./Dashboard.css";

export const Dashboard = () => {
  const { user } = useAuth();
  const { historial } = useEntrenamiento();
  const hoy = getDiaActual();
  const [plan, setPlan] = useState(null);

  const cargarPlan = useCallback(async () => {
    if (!user) return;
    setPlan(await planService.obtenerPlan(user.uid));
  }, [user]);

  useEffect(() => {
    cargarPlan();
  }, [cargarPlan]);

  const planHoy = plan?.[hoy];
  const ultimaSesion =
    historial.length > 0 ? historial[historial.length - 1] : null;

  const racha = useMemo(() => calcularRacha(historial), [historial]);

  const records = useMemo(() => calcularRecords(historial), [historial]);
  const topRecords = useMemo(
    () =>
      Object.entries(records)
        .filter(([, carga]) => carga > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
    [records],
  );

  const semana = useMemo(
    () => progresoSemana(historial, plan || {}),
    [historial, plan],
  );

  return (
    <div className="dashboard">
      <div className="dashboard__aviso">
        <GraduationCap
          size={20}
          strokeWidth={1.75}
          className="dashboard__aviso-icono"
        />
        <p>
          Para mejores resultados y evitar lesiones, entrena siguiendo el plan
          de un <strong>entrenador calificado</strong>. Esta app es una
          herramienta de seguimiento, no reemplaza su asesoría.
        </p>
      </div>
      <div className="dashboard__racha-card">
        <Flame
          size={34}
          strokeWidth={1.75}
          className="dashboard__racha-icono"
        />
        <div>
          <div className="dashboard__racha-numero">{racha}</div>
          <div className="dashboard__racha-label">
            {racha === 1
              ? "día seguido entrenando"
              : "días seguidos entrenando"}
          </div>
        </div>
      </div>

      {semana.total > 0 && (
        <div className="dashboard__card">
          <h3 className="dashboard__titulo">
            <Calendar size={18} strokeWidth={1.75} /> Progreso de la semana
          </h3>
          <div className="dashboard__semana-barra-fondo">
            <div
              className="dashboard__semana-barra"
              style={{
                width: `${Math.min(100, (semana.completadas / semana.total) * 100)}%`,
              }}
            />
          </div>
          <p className="dashboard__semana-texto">
            {semana.completadas} de {semana.total} días entrenados esta semana
          </p>
        </div>
      )}

      <div className="dashboard__card">
        <h3 className="dashboard__titulo">
          <Target size={18} strokeWidth={1.75} /> Próxima sesión
        </h3>
        <div className="dashboard__contenido">
          {planHoy && planHoy.ejercicios.length > 0 ? (
            <>
              <p className="dashboard__dia">{hoy}</p>
              <p className="dashboard__nombre">{planHoy.nombre}</p>
              <p className="dashboard__stats">
                {planHoy.ejercicios.length} ejercicios programados
              </p>
            </>
          ) : (
            <p className="dashboard__descanso">
              <PartyPopper size={16} strokeWidth={1.75} /> ¡Día de descanso!
              Recupera energía
            </p>
          )}
        </div>
      </div>

      <div className="dashboard__card">
        <h3 className="dashboard__titulo">
          <BarChart3 size={18} strokeWidth={1.75} /> Resumen rápido
        </h3>
        <div className="dashboard__stats-grid">
          <div className="dashboard__stat">
            <span className="dashboard__stat-valor">{historial.length}</span>
            <span className="dashboard__stat-label">Sesiones completadas</span>
          </div>
          <div className="dashboard__stat">
            <span className="dashboard__stat-valor">
              {ultimaSesion ? formatearFecha(ultimaSesion.fecha) : "---"}
            </span>
            <span className="dashboard__stat-label">Última sesión</span>
          </div>
        </div>
      </div>

      {topRecords.length > 0 && (
        <div className="dashboard__card">
          <h3 className="dashboard__titulo">
            <Trophy size={18} strokeWidth={1.75} /> Tus mejores marcas
          </h3>
          <div className="dashboard__records">
            {topRecords.map(([nombre, carga]) => (
              <div key={nombre} className="dashboard__record">
                <span className="dashboard__record-nombre">{nombre}</span>
                <span className="dashboard__record-valor">{carga} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {ultimaSesion && (
        <div className="dashboard__card">
          <h3 className="dashboard__titulo">
            <Dumbbell size={18} strokeWidth={1.75} /> Último entrenamiento
          </h3>
          <p className="dashboard__fecha">
            {formatearFecha(ultimaSesion.fecha)}
          </p>
          <p className="dashboard__ejercicios">
            {Object.keys(ultimaSesion.ejercicios || {}).length} ejercicios
            realizados
          </p>
        </div>
      )}
    </div>
  );
};
