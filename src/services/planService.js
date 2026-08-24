import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { PLAN_ENTRENAMIENTO } from "../constants/planEntrenamiento";

const persistir = async (userId, plan) => {
  const ref = doc(db, "planes", userId);
  await setDoc(ref, plan, { merge: true });
};

export const planService = {
  // Devuelve el plan del usuario: si tiene uno guardado en la nube lo usa,
  // si no, cae al plan por defecto (constants/planEntrenamiento.js).
  // Forma: { dias: [{nombre, ejercicios}, ...], diaActualIndice }
  async obtenerPlan(userId) {
    try {
      const ref = doc(db, "planes", userId);
      const snap = await getDoc(ref);
      if (snap.exists() && Array.isArray(snap.data().dias)) {
        const data = snap.data();
        return {
          dias: data.dias,
          diaActualIndice: data.diaActualIndice || 0,
        };
      }
      return PLAN_ENTRENAMIENTO;
    } catch (error) {
      console.error("Error obteniendo plan:", error);
      return PLAN_ENTRENAMIENTO;
    }
  },

  // Agrega un nuevo día vacío al final de la rutina.
  async agregarDia(userId, planActual) {
    const nuevoPlan = {
      ...planActual,
      dias: [...planActual.dias, { nombre: "", ejercicios: [] }],
    };
    try {
      await persistir(userId, nuevoPlan);
      return { success: true, plan: nuevoPlan };
    } catch (error) {
      console.error("Error agregando día:", error);
      return { success: false, error };
    }
  },

  // Quita un día completo de la rutina (por índice).
  async quitarDia(userId, planActual, indice) {
    const nuevosDias = planActual.dias.filter((_, i) => i !== indice);
    let diaActualIndice = planActual.diaActualIndice;
    if (diaActualIndice >= nuevosDias.length) diaActualIndice = 0;
    const nuevoPlan = { dias: nuevosDias, diaActualIndice };
    try {
      await persistir(userId, nuevoPlan);
      return { success: true, plan: nuevoPlan };
    } catch (error) {
      console.error("Error quitando día:", error);
      return { success: false, error };
    }
  },

  // Cambia el nombre/etiqueta de un día (ej. "Torso A", "Pierna").
  async renombrarDia(userId, planActual, indice, nombre) {
    const nuevosDias = planActual.dias.map((dia, i) =>
      i === indice ? { ...dia, nombre } : dia,
    );
    const nuevoPlan = { ...planActual, dias: nuevosDias };
    try {
      await persistir(userId, nuevoPlan);
      return { success: true, plan: nuevoPlan };
    } catch (error) {
      console.error("Error renombrando día:", error);
      return { success: false, error };
    }
  },

  // Agrega un ejercicio a un día concreto del plan del usuario y lo persiste.
  async agregarEjercicioADia(userId, planActual, indiceDia, ejercicio) {
    const nuevosDias = planActual.dias.map((dia, i) =>
      i === indiceDia
        ? { ...dia, ejercicios: [...dia.ejercicios, ejercicio] }
        : dia,
    );
    const nuevoPlan = { ...planActual, dias: nuevosDias };
    try {
      await persistir(userId, nuevoPlan);
      return { success: true, plan: nuevoPlan };
    } catch (error) {
      console.error("Error guardando ejercicio en el plan:", error);
      return { success: false, error };
    }
  },

  // Quita un ejercicio de un día del plan (por índice) y lo persiste.
  async quitarEjercicioDeDia(userId, planActual, indiceDia, indiceEjercicio) {
    const nuevosDias = planActual.dias.map((dia, i) =>
      i === indiceDia
        ? {
            ...dia,
            ejercicios: dia.ejercicios.filter((_, j) => j !== indiceEjercicio),
          }
        : dia,
    );
    const nuevoPlan = { ...planActual, dias: nuevosDias };
    try {
      await persistir(userId, nuevoPlan);
      return { success: true, plan: nuevoPlan };
    } catch (error) {
      console.error("Error quitando ejercicio del plan:", error);
      return { success: false, error };
    }
  },

  // Actualiza series/reps/kg de un ejercicio ya existente en un día del
  // plan (por nombre). Se usa después de guardar una sesión, para que el
  // objetivo mostrado la próxima vez refleje lo que realmente se hizo
  // (ej: si el plan decía "4x8" y hoy hiciste "4x10", el plan pasa a
  // sugerir "4x10" la próxima vez).
  async actualizarEjercicioEnDia(
    userId,
    planActual,
    indiceDia,
    nombreEjercicio,
    cambios,
  ) {
    const nuevosDias = planActual.dias.map((dia, i) => {
      if (i !== indiceDia) return dia;
      return {
        ...dia,
        ejercicios: dia.ejercicios.map((ej) =>
          ej.nombre === nombreEjercicio ? { ...ej, ...cambios } : ej,
        ),
      };
    });
    const nuevoPlan = { ...planActual, dias: nuevosDias };
    try {
      await persistir(userId, nuevoPlan);
      return { success: true, plan: nuevoPlan };
    } catch (error) {
      console.error("Error actualizando ejercicio del plan:", error);
      return { success: false, error };
    }
  },

  // Cambia cuál es el "día sugerido" siguiente en la rotación (se llama
  // automáticamente al guardar una sesión, o manualmente si el usuario
  // elige entrenar un día distinto al sugerido).
  async establecerDiaActual(userId, planActual, indice) {
    const nuevoPlan = { ...planActual, diaActualIndice: indice };
    try {
      await persistir(userId, nuevoPlan);
      return { success: true, plan: nuevoPlan };
    } catch (error) {
      console.error("Error cambiando de día:", error);
      return { success: false, error };
    }
  },
};
