import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./config";

// Verificar que la configuración existe
const hasValidConfig = () => {
  const keys = ["apiKey", "authDomain", "projectId"];
  return keys.every((key) => firebaseConfig[key] && firebaseConfig[key] !== "");
};

// Inicializar Firebase
let app;
let db;
let auth;

if (hasValidConfig()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("✅ Firebase inicializado correctamente");
    console.log("📁 Proyecto:", firebaseConfig.projectId);
  } catch (error) {
    console.error("❌ Error inicializando Firebase:", error);
    app = null;
    db = null;
    auth = null;
  }
} else {
  console.error("❌ Configuración de Firebase incompleta");
  app = null;
  db = null;
  auth = null;
}

// Función para iniciar sesión anónima automáticamente
export const iniciarSesionAnonima = async () => {
  if (!auth) {
    console.warn("⚠️ Firebase no disponible");
    return null;
  }

  try {
    // Verificar si ya hay un usuario
    const user = auth.currentUser;
    if (user) {
      console.log("✅ Usuario ya autenticado:", user.uid);
      return user;
    }

    // Iniciar sesión anónima
    const result = await signInAnonymously(auth);
    console.log("✅ Usuario autenticado anónimamente:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("❌ Error en autenticación anónima:", error);
    return null;
  }
};

// Exportar funciones
export { app, db, auth };
export { signInAnonymously, onAuthStateChanged };

export default {
  app,
  db,
  auth,
  signInAnonymously,
  onAuthStateChanged,
  iniciarSesionAnonima,
};
