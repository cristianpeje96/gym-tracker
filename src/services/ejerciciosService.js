import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";

export const ejerciciosService = {
  // Obtener ejercicios personalizados agregados por el usuario
  // (los que le indica su instructor y no están en la lista predefinida)
  async obtenerPersonalizados(userId) {
    try {
      const ref = doc(db, "ejerciciosPersonalizados", userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data().ejercicios || [];
      }
      return [];
    } catch (error) {
      console.error("Error obteniendo ejercicios personalizados:", error);
      return [];
    }
  },

  // Agregar un ejercicio personalizado nuevo
  async agregarPersonalizado(userId, ejercicio) {
    try {
      const ref = doc(db, "ejerciciosPersonalizados", userId);
      await setDoc(ref, { ejercicios: arrayUnion(ejercicio) }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error agregando ejercicio personalizado:", error);
      return { success: false, error };
    }
  },
};
