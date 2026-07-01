// Biblioteca de ejercicios predefinidos, agrupados por músculo objetivo.
// Se combina en tiempo de ejecución con los ejercicios personalizados
// que cada usuario agregue (ver services/ejerciciosService.js).

export const GRUPOS_MUSCULARES = [
  { id: "pecho", label: "Pecho", icono: "🎯" },
  { id: "espalda", label: "Espalda", icono: "🔺" },
  { id: "piernas", label: "Piernas", icono: "🦵" },
  { id: "gluteo", label: "Glúteo/Femoral", icono: "⭘" },
  { id: "hombros", label: "Hombros", icono: "◆" },
  { id: "biceps", label: "Bíceps", icono: "💪" },
  { id: "triceps", label: "Tríceps", icono: "⬡" },
  { id: "abdominales", label: "Abdominales", icono: "▦" },
  { id: "cardio", label: "Cardio", icono: "⚡" },
];

export const EJERCICIOS_PREDEFINIDOS = [
  // Pecho
  { nombre: "Press banca", grupo: "pecho" },
  { nombre: "Press banca mancuerna", grupo: "pecho" },
  { nombre: "Press inclinado con barra", grupo: "pecho" },
  { nombre: "Press inclinado mancuerna", grupo: "pecho" },
  { nombre: "Aperturas con mancuerna", grupo: "pecho" },
  { nombre: "Cruce de poleas", grupo: "pecho" },
  { nombre: "Fondos en paralelas", grupo: "pecho" },
  { nombre: "Flexiones", grupo: "pecho" },
  { nombre: "Press en máquina", grupo: "pecho" },

  // Espalda
  { nombre: "Dominadas", grupo: "espalda" },
  { nombre: "Jalón al pecho", grupo: "espalda" },
  { nombre: "Remo con barra", grupo: "espalda" },
  { nombre: "Remo máquina unilateral", grupo: "espalda" },
  { nombre: "Remo en polea baja", grupo: "espalda" },
  { nombre: "Peso muerto", grupo: "espalda" },
  { nombre: "Pull-over con mancuerna", grupo: "espalda" },
  { nombre: "Hiperextensiones", grupo: "espalda" },

  // Piernas (cuádriceps)
  { nombre: "Sentadilla libre", grupo: "piernas" },
  { nombre: "Sentadilla búlgara", grupo: "piernas" },
  { nombre: "Prensa", grupo: "piernas" },
  { nombre: "Cuádriceps sentado", grupo: "piernas" },
  { nombre: "Zancadas", grupo: "piernas" },
  { nombre: "Step up", grupo: "piernas" },
  { nombre: "Sentadilla hack", grupo: "piernas" },

  // Glúteo / Femoral
  { nombre: "Hip thrust", grupo: "gluteo" },
  { nombre: "Peso muerto rumano", grupo: "gluteo" },
  { nombre: "Femoral parado", grupo: "gluteo" },
  { nombre: "Femoral sentado", grupo: "gluteo" },
  { nombre: "Patada de glúteo en polea", grupo: "gluteo" },
  { nombre: "Puente de glúteo", grupo: "gluteo" },

  // Hombros
  { nombre: "Press militar con barra", grupo: "hombros" },
  { nombre: "Press militar mancuerna", grupo: "hombros" },
  { nombre: "Elevación lateral", grupo: "hombros" },
  { nombre: "Elevación frontal", grupo: "hombros" },
  { nombre: "Pájaro (deltoide posterior)", grupo: "hombros" },
  { nombre: "Press Arnold", grupo: "hombros" },
  { nombre: "Encogimientos (trapecio)", grupo: "hombros" },

  // Bíceps
  { nombre: "Curl con barra", grupo: "biceps" },
  { nombre: "Curl con mancuerna", grupo: "biceps" },
  { nombre: "Curl martillo", grupo: "biceps" },
  { nombre: "Curl en banco Scott", grupo: "biceps" },
  { nombre: "Curl en polea", grupo: "biceps" },

  // Tríceps
  { nombre: "Extensión de tríceps", grupo: "triceps" },
  { nombre: "Press francés", grupo: "triceps" },
  { nombre: "Extensión en polea (cuerda)", grupo: "triceps" },
  { nombre: "Fondos entre bancos", grupo: "triceps" },
  { nombre: "Patada de tríceps", grupo: "triceps" },

  // Abdominales
  { nombre: "Crunch abdominal", grupo: "abdominales" },
  { nombre: "Elevación de piernas", grupo: "abdominales" },
  { nombre: "Plancha", grupo: "abdominales" },
  { nombre: "Rueda abdominal", grupo: "abdominales" },
  { nombre: "Abdominales en polea", grupo: "abdominales" },

  // Cardio / funcional
  { nombre: "Burpee", grupo: "cardio" },
  { nombre: "Cinta / trote", grupo: "cardio" },
  { nombre: "Bicicleta estática", grupo: "cardio" },
  { nombre: "Remo (máquina cardio)", grupo: "cardio" },
  { nombre: "Cuerda / saltar la cuerda", grupo: "cardio" },
];
