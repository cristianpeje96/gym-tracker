import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";

export const nutricionService = {
  async obtenerDatos(userId) {
    try {
      const ref = doc(db, "nutricion", userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        return {
          pesos: data.pesos || [],
          comidas: data.comidas || [],
        };
      }
      return { pesos: [], comidas: [] };
    } catch (error) {
      console.error("Error obteniendo datos de nutrición:", error);
      return { pesos: [], comidas: [] };
    }
  },

  async registrarPeso(userId, registro) {
    try {
      const ref = doc(db, "nutricion", userId);
      await setDoc(ref, { pesos: arrayUnion(registro) }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error registrando peso:", error);
      return { success: false, error };
    }
  },

  async registrarComida(userId, comida) {
    try {
      const ref = doc(db, "nutricion", userId);
      await setDoc(ref, { comidas: arrayUnion(comida) }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error registrando comida:", error);
      return { success: false, error };
    }
  },
};
