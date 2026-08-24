/**
 * Script de un solo uso: para cada ejercicio en español de
 * ejerciciosLibrary.js, descarga el catálogo relevante de WorkoutX y
 * muestra los 5 candidatos MÁS PARECIDOS (no elige uno solo a ciegas),
 * para revisarlos y elegir el correcto a mano.
 *
 * Uso:
 *   node scripts/mapear-gifs.mjs TU_API_KEY_DE_WORKOUTX
 *
 * Requiere Node 18+ (usa fetch nativo). No necesita instalar nada.
 */

const apiKey = process.argv[2];
if (!apiKey) {
  console.error("Uso: node scripts/mapear-gifs.mjs TU_API_KEY_DE_WORKOUTX");
  process.exit(1);
}

// Cada ejercicio en español: [término de búsqueda en inglés, bodyPart de WorkoutX]
const EJERCICIOS = {
  "Press banca": ["Barbell Bench Press", "chest"],
  "Press banca mancuerna": ["Dumbbell Bench Press", "chest"],
  "Press inclinado con barra": ["Barbell Incline Bench Press", "chest"],
  "Press inclinado mancuerna": ["Incline Dumbbell Bench Press", "chest"],
  "Aperturas con mancuerna": ["Dumbbell Fly", "chest"],
  "Cruce de poleas": ["Cable Crossover", "chest"],
  "Fondos en paralelas": ["Chest Dip", "chest"],
  Flexiones: ["Push Up", "chest"],
  "Press en máquina": ["Chest Press Machine", "chest"],

  Dominadas: ["Pull Up", "back"],
  "Jalón al pecho": ["Lat Pulldown", "back"],
  "Remo con barra": ["Barbell Row", "back"],
  "Remo máquina unilateral": ["Single Arm Row Machine", "back"],
  "Remo en polea baja": ["Seated Cable Row", "back"],
  "Peso muerto": ["Barbell Deadlift", "back"],
  "Pull-over con mancuerna": ["Dumbbell Pullover", "back"],
  Hiperextensiones: ["Hyperextension", "back"],

  "Sentadilla libre": ["Barbell Squat", "upper legs"],
  "Sentadilla búlgara": ["Bulgarian Split Squat", "upper legs"],
  Prensa: ["Leg Press", "upper legs"],
  "Cuádriceps sentado": ["Leg Extension", "upper legs"],
  Zancadas: ["Lunge", "upper legs"],
  "Step up": ["Step Up", "upper legs"],
  "Sentadilla hack": ["Hack Squat", "upper legs"],

  "Hip thrust": ["Hip Thrust", "upper legs"],
  "Peso muerto rumano": ["Romanian Deadlift", "upper legs"],
  "Femoral parado": ["Standing Leg Curl", "upper legs"],
  "Femoral sentado": ["Seated Leg Curl", "upper legs"],
  "Patada de glúteo en polea": ["Cable Glute Kickback", "upper legs"],
  "Puente de glúteo": ["Glute Bridge", "upper legs"],

  "Press militar con barra": ["Barbell Shoulder Press", "shoulders"],
  "Press militar mancuerna": ["Dumbbell Shoulder Press", "shoulders"],
  "Elevación lateral": ["Lateral Raise", "shoulders"],
  "Elevación frontal": ["Front Raise", "shoulders"],
  "Pájaro (deltoide posterior)": ["Reverse Fly", "shoulders"],
  "Press Arnold": ["Arnold Press", "shoulders"],
  "Encogimientos (trapecio)": ["Shrug", "shoulders"],

  "Curl con barra": ["Barbell Curl", "upper arms"],
  "Curl con mancuerna": ["Dumbbell Curl", "upper arms"],
  "Curl martillo": ["Hammer Curl", "upper arms"],
  "Curl en banco Scott": ["Preacher Curl", "upper arms"],
  "Curl en polea": ["Cable Curl", "upper arms"],

  "Extensión de tríceps": ["Triceps Extension", "upper arms"],
  "Press francés": ["Skull Crusher", "upper arms"],
  "Extensión en polea (cuerda)": ["Triceps Pushdown", "upper arms"],
  "Fondos entre bancos": ["Bench Dip", "upper arms"],
  "Patada de tríceps": ["Triceps Kickback", "upper arms"],

  "Crunch abdominal": ["Crunch", "waist"],
  "Elevación de piernas": ["Leg Raise", "waist"],
  Plancha: ["Plank", "waist"],
  "Rueda abdominal": ["Ab Wheel Rollout", "waist"],
  "Abdominales en polea": ["Cable Crunch", "waist"],

  Burpee: ["Burpee", "cardio"],
  "Cinta / trote": ["Treadmill Running", "cardio"],
  "Bicicleta estática": ["Stationary Bike", "cardio"],
  "Remo (máquina cardio)": ["Rowing Machine", "cardio"],
  "Cuerda / saltar la cuerda": ["Jump Rope", "cardio"],
};

// Grupos de equipo que se excluyen entre sí: si el término buscado
// menciona uno y el candidato menciona otro, es casi seguro que NO es
// el ejercicio correcto (aunque compartan muchas otras palabras).
const GRUPOS_EQUIPO = [
  ["barbell"],
  ["dumbbell"],
  ["cable"],
  ["machine", "leverage"],
  ["assisted", "bodyweight"],
  ["smith"],
  ["kettlebell"],
];

const equipoDe = (palabras) =>
  GRUPOS_EQUIPO.find((grupo) => grupo.some((g) => palabras.includes(g)));

const normalizar = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const cacheBodyParts = {};

async function obtenerPorBodyPart(bodyPart) {
  if (cacheBodyParts[bodyPart]) return cacheBodyParts[bodyPart];

  const lista = [];
  let offset = 0;
  let total = Infinity;

  while (lista.length < total && offset <= 3000) {
    const res = await fetch(
      `https://api.workoutxapp.com/v1/exercises?bodyPart=${encodeURIComponent(bodyPart)}&offset=${offset}`,
      { headers: { "X-WorkoutX-Key": apiKey } },
    );

    if (!res.ok) {
      console.error(
        `  Error HTTP ${res.status} (bodyPart=${bodyPart}, offset=${offset})`,
      );
      break;
    }

    const json = await res.json();
    const lote = json.data || [];
    total = json.total ?? lote.length;

    if (lote.length === 0) break;
    lista.push(...lote);
    offset += lote.length;
    await new Promise((r) => setTimeout(r, 2200));
  }

  cacheBodyParts[bodyPart] = lista;
  console.log(
    `  [${bodyPart}] ${lista.length}/${total} ejercicios descargados`,
  );
  return lista;
}

const puntuarCoincidencia = (nombreBuscado, nombreCandidato) => {
  const palabrasBuscadas = normalizar(nombreBuscado);
  const palabrasCandidato = normalizar(nombreCandidato);
  const setCandidato = new Set(palabrasCandidato);

  let score;
  const buscadoNorm = palabrasBuscadas.join(" ");
  const candidatoNorm = palabrasCandidato.join(" ");
  if (buscadoNorm === candidatoNorm) {
    score = 1;
  } else if (candidatoNorm.includes(buscadoNorm)) {
    score = 0.95;
  } else {
    const coincidencias = palabrasBuscadas.filter((p) =>
      setCandidato.has(p),
    ).length;
    score =
      coincidencias /
      Math.max(palabrasBuscadas.length, palabrasCandidato.length);
  }

  // Penaliza fuerte si el equipo mencionado no coincide (barra vs
  // mancuerna vs cable vs máquina...), aunque compartan otras palabras.
  const equipoBuscado = equipoDe(palabrasBuscadas);
  const equipoCandidato = equipoDe(palabrasCandidato);
  if (equipoBuscado && equipoCandidato && equipoBuscado !== equipoCandidato) {
    score *= 0.15;
  }

  return score;
};

async function main() {
  console.log("Descargando catálogo de WorkoutX por grupo muscular...\n");

  const bodyPartsNecesarios = [
    ...new Set(Object.values(EJERCICIOS).map(([, bp]) => bp)),
  ];

  const catalogoPorGrupo = {};
  for (const bp of bodyPartsNecesarios) {
    catalogoPorGrupo[bp] = await obtenerPorBodyPart(bp);
  }

  console.log("\nGenerando lista de candidatos para revisión manual...\n");

  const reporte = {};

  for (const [nombreEs, [terminoEn, bodyPart]] of Object.entries(EJERCICIOS)) {
    const pool = catalogoPorGrupo[bodyPart] || [];
    const puntuados = pool
      .map((ej) => ({
        id: ej.id,
        name: ej.name,
        gifUrl: ej.gifUrl,
        score: puntuarCoincidencia(terminoEn, ej.name || ""),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    reporte[nombreEs] = puntuados;

    console.log(`\n${nombreEs} (buscado: "${terminoEn}")`);
    puntuados.forEach((c, i) => {
      console.log(
        `  ${i + 1}. [${Math.round(c.score * 100)}%] ${c.name}  ->  ${c.gifUrl}`,
      );
    });
  }

  const fs = await import("fs");
  fs.writeFileSync("gifs-candidatos.json", JSON.stringify(reporte, null, 2));
  console.log("\n\nReporte completo guardado en gifs-candidatos.json");
}

main();
