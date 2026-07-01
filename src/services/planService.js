import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { PLAN_ENTRENAMIENTO } from "../constants/planEntrenamiento";

export const planService = {
  // Devuelve el plan del usuario: si tiene uno guardado en la nube lo usa,
  // si no, cae al plan por defecto (constants/planEntrenamiento.js).
  async obtenerPlan(userId) {
    try {
      const ref = doc(db, "planes", userId);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().dias) {
        return snap.data().dias;
      }
      return PLAN_ENTRENAMIENTO;
    } catch (error) {
      console.error("Error obteniendo plan:", error);
      return PLAN_ENTRENAMIENTO;
    }
  },

  // Agrega un ejercicio a un día concreto del plan del usuario y lo persiste.
  async agregarEjercicioADia(userId, planActual, dia, ejercicio) {
    const nuevoPlan = {
      ...planActual,
      [dia]: {
        ...planActual[dia],
        ejercicios: [...(planActual[dia]?.ejercicios || []), ejercicio],
      },
    };
    try {
      const ref = doc(db, "planes", userId);
      await setDoc(ref, { dias: nuevoPlan }, { merge: true });
      return { success: true, plan: nuevoPlan };
    } catch (error) {
      console.error("Error guardando ejercicio en el plan:", error);
      return { success: false, error };
    }
  },

  // Quita un ejercicio de un día del plan (por índice) y lo persiste.
  async quitarEjercicioDeDia(userId, planActual, dia, indice) {
    const ejerciciosActualizados = planActual[dia].ejercicios.filter(
      (_, i) => i !== indice,
    );
    const nuevoPlan = {
      ...planActual,
      [dia]: { ...planActual[dia], ejercicios: ejerciciosActualizados },
    };
    try {
      const ref = doc(db, "planes", userId);
      await setDoc(ref, { dias: nuevoPlan }, { merge: true });
      return { success: true, plan: nuevoPlan };
    } catch (error) {
      console.error("Error quitando ejercicio del plan:", error);
      return { success: false, error };
    }
  },
};
