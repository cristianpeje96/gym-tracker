// Plan de entrenamiento por defecto: vacío a propósito.
// Cada usuario arma su propia rutina (la que le asigne su instructor)
// desde la pestaña "Plan", usando el selector de ejercicios. No se
// precargan ejercicios de ejemplo para evitar que alguien entrene algo
// que no fue indicado por un profesional.
export const PLAN_ENTRENAMIENTO = {
  Lunes: { nombre: "", ejercicios: [] },
  Martes: { nombre: "", ejercicios: [] },
  Miércoles: { nombre: "", ejercicios: [] },
  Jueves: { nombre: "", ejercicios: [] },
  Viernes: { nombre: "", ejercicios: [] },
  Sábado: { nombre: "", ejercicios: [] },
  Domingo: { nombre: "", ejercicios: [] },
};

export const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const ESCALA_RPE = [
  { rpe: 10, significado: "Esfuerzo Máximo", rir: 0 },
  { rpe: 9, significado: "Seguro que sale 1 rep más", rir: 1 },
  { rpe: 8, significado: "Seguro que salen 2 reps más", rir: 2 },
  { rpe: 7, significado: "Salen 3 reps más", rir: 3 },
  { rpe: 6, significado: "Salen 4 reps más", rir: 4 },
  { rpe: 5, significado: "Salen 5 reps más", rir: 5 },
];
