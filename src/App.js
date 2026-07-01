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
  const { user, loading } = useAuth();
  const [vista, setVista] = useState("dashboard");

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading__card">
          <div className="app-loading__icono">⏳</div>
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
          IRON<span>LOG</span>
        </h1>
        <p className="app-header__estado">
          {user ? "SINCRONIZADO EN LA NUBE" : "MODO LOCAL — SIN CONEXIÓN"}
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
