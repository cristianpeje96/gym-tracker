import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export const entrenamientoService = {
  // Guardar sesión de entrenamiento
  async guardarSesion(userId, sesion) {
    try {
      const userRef = doc(db, "entrenamientos", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          sesiones: arrayUnion(sesion),
        });
      } else {
        await setDoc(userRef, {
          sesiones: [sesion],
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Error guardando sesión:", error);
      return { success: false, error };
    }
  },

  // Obtener historial de entrenamientos
  async obtenerHistorial(userId) {
    try {
      const userRef = doc(db, "entrenamientos", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data().sesiones || [];
      }
      return [];
    } catch (error) {
      console.error("Error obteniendo historial:", error);
      return [];
    }
  },

  // Guardar perfil de usuario
  async guardarPerfil(userId, perfil) {
    try {
      const userRef = doc(db, "usuarios", userId);
      await setDoc(userRef, { perfil }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error guardando perfil:", error);
      return { success: false, error };
    }
  },

  // Obtener perfil de usuario
  async obtenerPerfil(userId) {
    try {
      const userRef = doc(db, "usuarios", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data().perfil || null;
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      return null;
    }
  },
};
