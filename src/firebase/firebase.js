import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./config";

// Verificar que la configuración existe
const CAMPOS_REQUERIDOS = ["apiKey", "authDomain", "projectId"];

const hasValidConfig = () =>
  CAMPOS_REQUERIDOS.every(
    (key) => firebaseConfig[key] && firebaseConfig[key] !== "",
  );

const mostrarErrorConfiguracion = () => {
  const faltantes = CAMPOS_REQUERIDOS.filter(
    (key) => !firebaseConfig[key] || firebaseConfig[key] === "",
  );
  console.error(
    "%c🔥 Firebase no está configurado",
    "font-size: 14px; font-weight: bold; color: #e8491c;",
  );
  console.error(
    `Faltan estas variables de entorno: ${faltantes
      .map(
        (k) =>
          `REACT_APP_FIREBASE_${k.replace(/[A-Z]/g, (c) => "_" + c).toUpperCase()}`,
      )
      .join(", ")}`,
  );
  console.error(
    "Solución:\n" +
      "  1. Copia el archivo .env.example y renómbralo a .env.local\n" +
      "  2. Completa los valores (Firebase Console > Configuración del proyecto > Tus apps)\n" +
      "  3. Detén el servidor (Ctrl+C) y vuelve a correr: npm start\n" +
      "     (Create React App solo lee .env.local al arrancar, no con hot-reload)",
  );
};

// Inicializar Firebase
let app;
let db;
let auth;
export const configuracionValida = hasValidConfig();

if (configuracionValida) {
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
  mostrarErrorConfiguracion();
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

const firebaseExports = {
  app,
  db,
  auth,
  signInAnonymously,
  onAuthStateChanged,
  iniciarSesionAnonima,
  configuracionValida,
};

export default firebaseExports;
