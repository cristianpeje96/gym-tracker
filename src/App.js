import React, { useState, useEffect } from "react";
import {
  auth,
  onAuthStateChanged,
  iniciarSesionAnonima,
} from "./firebase/firebase";
import { Entrenamiento } from "./components/entrenamiento/Entrenamiento";
import { HistorialCompleto } from "./components/historial/HistorialCompleto";
import { ControlNutricional } from "./components/nutricion/ControlNutricional";
import "./App.css";

function App() {
  const [vista, setVista] = useState("entrenar");
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (!auth) {
        console.warn("⚠️ Firebase no disponible");
        setFirebaseReady(true);
        return;
      }

      // Escuchar cambios en autenticación
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("✅ Usuario autenticado:", user.uid);
          setUser(user);
          setFirebaseReady(true);
        } else {
          console.log("🔄 Intentando autenticación anónima...");
          // Intentar autenticación anónima
          const newUser = await iniciarSesionAnonima();
          if (newUser) {
            setUser(newUser);
          } else {
            console.warn("⚠️ No se pudo autenticar");
          }
          setFirebaseReady(true);
        }
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    };

    initAuth();
  }, []);

  if (!firebaseReady) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔄</div>
          <h2>Conectando con Firebase...</h2>
          <p style={{ color: "#718096" }}>Inicializando autenticación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏋️ Mi Gym Tracker</h1>
        <p>{user ? "✅ Sincronizado en la nube" : "📱 Modo local"}</p>
        {user && (
          <p style={{ fontSize: "10px", opacity: 0.7 }}>
            ID: {user.uid?.slice(0, 8)}...
          </p>
        )}
      </header>

      <div className="nav-tabs">
        <button
          onClick={() => setVista("entrenar")}
          className={vista === "entrenar" ? "active" : ""}
        >
          💪 Entrenar
        </button>
        <button
          onClick={() => setVista("historial")}
          className={vista === "historial" ? "active" : ""}
        >
          📊 Historial
        </button>
        <button
          onClick={() => setVista("nutricion")}
          className={vista === "nutricion" ? "active" : ""}
        >
          🥗 Nutrición
        </button>
      </div>

      <main>
        {vista === "entrenar" && <Entrenamiento />}
        {vista === "historial" && <HistorialCompleto />}
        {vista === "nutricion" && <ControlNutricional />}
      </main>
    </div>
  );
}

export default App;
