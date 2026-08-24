import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";

export const medidasService = {
  // Historial de medidas corporales (cada registro trae su fecha).
  async obtenerHistorial(userId) {
    try {
      const ref = doc(db, "usuarios", userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data().medidasHistorial || [];
      }
      return [];
    } catch (error) {
      console.error("Error obteniendo historial de medidas:", error);
      return [];
    }
  },

  // Agrega un nuevo registro fechado de medidas al historial (no
  // sobreescribe los anteriores, así se puede ver la evolución).
  async registrarMedidas(userId, medidas) {
    try {
      const ref = doc(db, "usuarios", userId);
      const registro = {
        ...medidas,
        fecha: new Date().toISOString().split("T")[0],
      };
      await setDoc(
        ref,
        { medidasHistorial: arrayUnion(registro) },
        { merge: true },
      );
      return { success: true, registro };
    } catch (error) {
      console.error("Error registrando medidas:", error);
      return { success: false, error };
    }
  },
};
