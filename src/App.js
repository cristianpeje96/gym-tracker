import React, { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { EntrenamientoProvider } from "./contexts/EntrenamientoContext";
import { useAuth } from "./hooks/useAuth";
import { NavTabs } from "./components/common/NavTabs/NavTabs";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Entrenamiento } from "./components/entrenamiento/Entrenamiento";
import { HistorialCompleto } from "./components/historial/HistorialCompleto";
import { PlanSemanal } from "./components/plan/PlanSemanal";
import { ControlNutricional } from "./components/nutricion/ControlNutricional";
import { Perfil } from "./components/perfil/Perfil";
import {
  Settings,
  Loader2,
  WifiOff,
  User,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import "./App.css";

const TABS = [
  { id: "dashboard", label: "Resumen" },
  { id: "entrenar", label: "Entrenar" },
  { id: "historial", label: "Historial" },
  { id: "plan", label: "Plan" },
  { id: "nutricion", label: "Nutrición" },
  { id: "perfil", label: "Perfil" },
];

function AppContent() {
  const {
    user,
    loading,
    configError,
    esInvitado,
    hayConflictoDeCuenta,
    confirmarCambioDeCuenta,
    cancelarCambioDeCuenta,
  } = useAuth();
  const [vista, setVista] = useState("dashboard");

  if (configError) {
    return (
      <div className="app-loading">
        <div className="app-loading__card">
          <Settings
            size={40}
            strokeWidth={1.5}
            className="app-loading__icono"
          />
          <h2>Falta configurar Firebase</h2>
          <p style={{ color: "var(--color-ink-soft)", marginTop: 8 }}>
            No se encontró tu archivo{" "}
            <code style={{ color: "var(--color-iron)" }}>.env.local</code>.
          </p>
          <ol
            style={{
              textAlign: "left",
              marginTop: 16,
              color: "var(--color-ink-soft)",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            <li>
              Copia <code>.env.example</code> y renómbralo a{" "}
              <code>.env.local</code>
            </li>
            <li>Completa los valores con los datos de tu proyecto Firebase</li>
            <li>
              Detén el servidor (<code>Ctrl+C</code>) y corre de nuevo{" "}
              <code>npm start</code>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading__card">
          <Loader2
            size={40}
            strokeWidth={1.5}
            className="app-loading__icono icono-spin"
          />
          <h2>Conectando con Firebase...</h2>
          <p style={{ color: "var(--color-ink-soft)" }}>
            Inicializando autenticación
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-header__titulo">
          GLADIADOR<span>STEEL</span>
        </h1>
        <p className="app-header__estado">
          {!user ? (
            <>
              <WifiOff size={13} strokeWidth={2} /> Sin conexión a Firebase
            </>
          ) : esInvitado ? (
            <>
              <User size={13} strokeWidth={2} /> Modo invitado
            </>
          ) : (
            <>
              <ShieldCheck size={13} strokeWidth={2} /> Cuenta sincronizada
            </>
          )}
        </p>
        {user && <p className="app-header__uid">ID {user.uid?.slice(0, 8)}…</p>}
      </header>

      <main>
        {vista === "dashboard" && <Dashboard />}
        {vista === "entrenar" && <Entrenamiento />}
        {vista === "historial" && <HistorialCompleto />}
        {vista === "plan" && <PlanSemanal />}
        {vista === "nutricion" && <ControlNutricional />}
        {vista === "perfil" && <Perfil />}
      </main>

      <NavTabs tabs={TABS} activo={vista} onChange={setVista} />

      {hayConflictoDeCuenta && (
        <div className="conflicto-cuenta__overlay">
          <div className="conflicto-cuenta__card">
            <TriangleAlert
              size={36}
              strokeWidth={1.5}
              className="conflicto-cuenta__icono"
            />
            <h3>Esta cuenta de Google ya tiene datos</h3>
            <p>
              Ya existe una cuenta en la app con este correo de Google. Si
              entras a esa cuenta, los datos que llevas como invitado en este
              dispositivo no se transferirán.
            </p>
            <div className="conflicto-cuenta__botones">
              <button
                className="conflicto-cuenta__btn conflicto-cuenta__btn--cancelar"
                onClick={cancelarCambioDeCuenta}
              >
                Cancelar
              </button>
              <button
                className="conflicto-cuenta__btn conflicto-cuenta__btn--aceptar"
                onClick={confirmarCambioDeCuenta}
              >
                Entrar a esa cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <EntrenamientoProvider>
        <AppContent />
      </EntrenamientoProvider>
    </AuthProvider>
  );
}

export default App;
