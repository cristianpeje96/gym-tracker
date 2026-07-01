export const PLAN_ENTRENAMIENTO = {
  Lunes: {
    nombre: "Torso A",
    ejercicios: [
      { nombre: "Press banca", series: 4, reps: 12, carga: 35 },
      { nombre: "Remo máquina unilateral", series: 4, reps: 12, carga: 25 },
      { nombre: "Press militar con barra", series: 4, reps: 12, carga: 25 },
      { nombre: "Jalón al pecho", series: 4, reps: 12, carga: 60 },
      { nombre: "Flexiones", series: 3, reps: 8, carga: 0 },
      { nombre: "Extensión de tríceps", series: 4, reps: 15, carga: 25 },
      { nombre: "Burpee", series: 3, reps: 10, carga: 0 },
    ],
  },
  Martes: {
    nombre: "Tren inferior A",
    ejercicios: [
      { nombre: "Sentadilla libre", series: 4, reps: 10, carga: 40 },
      { nombre: "Prensa", series: 4, reps: 10, carga: 100 },
      { nombre: "Cuádriceps sentado", series: 4, reps: 10, carga: 25 },
      { nombre: "Peso muerto", series: 4, reps: 10, carga: 30 },
      { nombre: "Femoral parado", series: 4, reps: 10, carga: 20 },
    ],
  },
  Miércoles: {
    nombre: "Torso B",
    ejercicios: [
      { nombre: "Dominadas", series: 4, reps: 5, carga: 0 },
      { nombre: "Fondos", series: 4, reps: 10, carga: 0 },
      { nombre: "Press banca mancuerna", series: 4, reps: 12, carga: 8 },
      { nombre: "Remo con barra", series: 4, reps: 12, carga: 20 },
      { nombre: "Elevación lateral", series: 4, reps: 15, carga: 5 },
    ],
  },
  Jueves: {
    nombre: "Tren inferior B",
    ejercicios: [
      { nombre: "Hip thrust", series: 5, reps: 10, carga: 40 },
      { nombre: "Peso muerto rumano", series: 4, reps: 10, carga: 17.5 },
      { nombre: "Prensa", series: 4, reps: 10, carga: 100 },
      { nombre: "Step up", series: 4, reps: 10, carga: 5 },
      { nombre: "Femoral parado", series: 3, reps: 15, carga: 15 },
    ],
  },
  Viernes: { nombre: "Descanso", ejercicios: [] },
  Sábado: { nombre: "Descanso", ejercicios: [] },
  Domingo: { nombre: "Descanso", ejercicios: [] },
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
