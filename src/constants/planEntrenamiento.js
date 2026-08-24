// Plan de entrenamiento por defecto: vacío a propósito.
// Cada usuario arma su propia rutina (la que le asigne su instructor)
// desde la pestaña "Plan", usando el selector de ejercicios.
//
// Los días se numeran (Día 1, Día 2...) en vez de usar días de la
// semana, porque no todos entrenan en un horario fijo de lunes a
// domingo — así cada quien sigue su rutina por el número de día que le
// toca, sin importar qué día del calendario sea.
export const PLAN_ENTRENAMIENTO = {
  dias: [
    { nombre: "", ejercicios: [] },
    { nombre: "", ejercicios: [] },
    { nombre: "", ejercicios: [] },
  ],
  diaActualIndice: 0,
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
