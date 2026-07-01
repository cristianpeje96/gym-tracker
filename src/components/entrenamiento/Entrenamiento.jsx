import React, { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "../../firebase/firebase";
import { entrenamientoService } from "../../services/entrenamientoService";

// PLAN COMPLETO DE TUS IMÁGENES
const PLAN_ENTRENAMIENTO = {
  Lunes: {
    nombre: "Torso A",
    ejercicios: [
      { nombre: "Press banca", series: 4, reps: 12, carga: 35 },
      { nombre: "Remo máquina unilateral", series: 4, reps: 12, carga: 25 },
      { nombre: "Press militar con barra", series: 4, reps: 12, carga: 25 },
      { nombre: "Jalón al pecho", series: 4, reps: 12, carga: 60 },
      { nombre: "Flexiones", series: 3, reps: 8, carga: 0 },
      { nombre: "Extensión de tríceps", series: 4, reps: 15, carga: 25 },
      { nombre: "Burpee", series: 3, reps: 10, carga: 0 },
    ],
  },
  Martes: {
    nombre: "Tren inferior A",
    ejercicios: [
      { nombre: "Sentadilla libre", series: 4, reps: 10, carga: 40 },
      { nombre: "Prensa", series: 4, reps: 10, carga: 100 },
      { nombre: "Cuádriceps sentado", series: 4, reps: 10, carga: 25 },
      { nombre: "Peso muerto", series: 4, reps: 10, carga: 30 },
      { nombre: "Femoral parado", series: 4, reps: 10, carga: 20 },
    ],
  },
  Miércoles: {
    nombre: "Torso B",
    ejercicios: [
      { nombre: "Dominadas", series: 4, reps: 5, carga: 0 },
      { nombre: "Fondos", series: 4, reps: 10, carga: 0 },
      { nombre: "Press banca mancuerna", series: 4, reps: 12, carga: 8 },
      { nombre: "Remo con barra", series: 4, reps: 12, carga: 20 },
      { nombre: "Elevación lateral", series: 4, reps: 15, carga: 5 },
    ],
  },
  Jueves: {
    nombre: "Tren inferior B",
    ejercicios: [
      { nombre: "Hip thrust", series: 5, reps: 10, carga: 40 },
      { nombre: "Peso muerto rumano", series: 4, reps: 10, carga: 17.5 },
      { nombre: "Prensa", series: 4, reps: 10, carga: 100 },
      { nombre: "Step up", series: 4, reps: 10, carga: 5 },
      { nombre: "Femoral parado", series: 3, reps: 15, carga: 15 },
    ],
  },
  Viernes: { nombre: "Descanso", ejercicios: [] },
  Sábado: { nombre: "Descanso", ejercicios: [] },
  Domingo: { nombre: "Descanso", ejercicios: [] },
};

const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const ESCALA_RPE = [
  { rpe: 10, significado: "Esfuerzo Máximo", rir: 0, color: "#f56565" },
  {
    rpe: 9,
    significado: "Seguro que sale 1 rep más",
    rir: 1,
    color: "#f6ad55",
  },
  {
    rpe: 8,
    significado: "Seguro que salen 2 reps más",
    rir: 2,
    color: "#fbbf24",
  },
  { rpe: 7, significado: "Salen 3 reps más", rir: 3, color: "#a0aec0" },
  { rpe: 6, significado: "Salen 4 reps más", rir: 4, color: "#cbd5e0" },
  { rpe: 5, significado: "Salen 5 reps más", rir: 5, color: "#e2e8f0" },
];

const SerieInput = ({ numero, repsObjetivo, cargaObjetivo, onGuardar }) => {
  const [reps, setReps] = useState(repsObjetivo);
  const [carga, setCarga] = useState(cargaObjetivo);
  const [rpe, setRpe] = useState(null);
  const [realizado, setRealizado] = useState(false);

  const guardarDatos = () => {
    onGuardar({ reps, carga, rpe, realizado });
  };

  React.useEffect(() => {
    guardarDatos();
  }, [reps, carga, rpe, realizado]);

  return (
    <div
      style={{
        background: realizado ? "#f0fff4" : "white",
        border: realizado ? "1px solid #48bb78" : "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "12px",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Serie {numero}</span>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
          }}
        >
          <input
            type="checkbox"
            checked={realizado}
            onChange={(e) => setRealizado(e.target.checked)}
          />
          Realizada
        </label>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(parseInt(e.target.value) || 0)}
          placeholder="Reps"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
          disabled={!realizado}
        />
        <input
          type="number"
          value={carga}
          onChange={(e) => setCarga(parseFloat(e.target.value) || 0)}
          placeholder="Kg"
          step="2.5"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
          disabled={!realizado}
        />
      </div>

      {realizado && (
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {ESCALA_RPE.map((item) => (
            <button
              key={item.rpe}
              onClick={() => setRpe(item.rpe)}
              style={{
                padding: "6px 10px",
                background: rpe === item.rpe ? item.color : "#f7fafc",
                color: rpe === item.rpe ? "white" : "#4a5568",
                border:
                  rpe === item.rpe
                    ? `2px solid ${item.color}`
                    : "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
                cursor: "pointer",
                minWidth: "40px",
              }}
            >
              {item.rpe}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Entrenamiento = () => {
  const [userId, setUserId] = useState(null);
  const [sesionActual, setSesionActual] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Para pruebas: cambia "Lunes" por DIAS_SEMANA[new Date().getDay()] para usar el día real
  const hoy = "Lunes";
  const planHoy = PLAN_ENTRENAMIENTO[hoy];

  useEffect(() => {
    if (!auth) {
      console.warn("⚠️ Firebase no disponible");
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("✅ Usuario autenticado en Entrenamiento:", user.uid);
      } else {
        console.log("👤 Usuario no autenticado en Entrenamiento");
        setUserId(null);
      }
      setAuthReady(true);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGuardarSerie = (nombreEjercicio, serieIndex, datos) => {
    setSesionActual((prev) => {
      const ejercicioActual = prev[nombreEjercicio] || [];
      const nuevasSeries = [...ejercicioActual];
      nuevasSeries[serieIndex] = datos;
      return { ...prev, [nombreEjercicio]: nuevasSeries };
    });
  };

  const handleGuardarSesion = async () => {
    if (!userId) {
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

    const resultado = await entrenamientoService.guardarSesion(userId, sesion);

    if (resultado.success) {
      setMensaje({
        tipo: "exito",
        texto: `✅ ¡Sesión guardada! ${seriesCompletadas} series completadas`,
      });
      setSesionActual({});
    } else {
      setMensaje({ tipo: "error", texto: "❌ Error al guardar la sesión" });
    }

    setGuardando(false);
    setTimeout(() => setMensaje(null), 3000);
  };

  if (!authReady) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>🔄 Conectando...</p>
      </div>
    );
  }

  if (!planHoy || planHoy.ejercicios.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "64px" }}>🎉</div>
        <h3>¡Día de descanso!</h3>
        <p>Recupera tus músculos y vuelve más fuerte mañana 💪</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", paddingBottom: "32px" }}>
      {mensaje && (
        <div
          style={{
            padding: "12px",
            background: mensaje.tipo === "exito" ? "#c6f6d5" : "#fed7d7",
            color: mensaje.tipo === "exito" ? "#22543d" : "#742a2a",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {mensaje.texto}
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "28px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {hoy}
        </h2>
        <p>{planHoy.nombre}</p>
        <p
          style={{
            fontSize: "12px",
            color: userId ? "#48bb78" : "#fc8181",
            marginTop: "8px",
          }}
        >
          {userId ? "✅ Conectado a Firebase" : "❌ Sin conexión a Firebase"}
        </p>
      </div>

      {planHoy.ejercicios.map((ejercicio, ejIdx) => (
        <div
          key={ejIdx}
          style={{
            background: "white",
            borderRadius: "16px",
            marginBottom: "16px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h4 style={{ color: "#667eea", marginBottom: "8px" }}>
            {ejercicio.nombre}
          </h4>
          <p
            style={{ fontSize: "12px", color: "#718096", marginBottom: "16px" }}
          >
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
        onClick={handleGuardarSesion}
        disabled={guardando || !userId}
        style={{
          width: "100%",
          padding: "18px",
          background: !userId
            ? "#a0aec0"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: !userId || guardando ? "not-allowed" : "pointer",
          opacity: !userId || guardando ? 0.6 : 1,
        }}
      >
        {!userId
          ? "🔄 Conectando..."
          : guardando
            ? "💾 Guardando..."
            : "💾 Guardar sesión"}
      </button>
    </div>
  );
};
