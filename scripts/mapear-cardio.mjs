const apiKey = process.argv[2];
if (!apiKey) {
  console.error("Uso: node scripts/mapear-cardio.mjs TU_API_KEY_DE_WORKOUTX");
  process.exit(1);
}

const EJERCICIOS = {
  Burpee: "Burpee",
  "Cinta / trote": "Treadmill Running",
  "Bicicleta estática": "Stationary Bike",
  "Remo (máquina cardio)": "Rowing Machine",
  "Cuerda / saltar la cuerda": "Jump Rope",
};

const normalizar = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const puntuarCoincidencia = (nombreBuscado, nombreCandidato) => {
  const b = normalizar(nombreBuscado).join(" ");
  const c = normalizar(nombreCandidato).join(" ");
  if (b === c) return 1;
  if (c.includes(b)) return 0.95;
  const pb = normalizar(nombreBuscado);
  const pc = normalizar(nombreCandidato);
  const set = new Set(pc);
  const coincidencias = pb.filter((p) => set.has(p)).length;
  return coincidencias / Math.max(pb.length, pc.length);
};

async function main() {
  console.log("Descargando catálogo de cardio...\n");
  const lista = [];
  let offset = 0;
  let total = Infinity;

  while (lista.length < total && offset <= 500) {
    let res = await fetch(
      `https://api.workoutxapp.com/v1/exercises?bodyPart=cardio&offset=${offset}`,
      { headers: { "X-WorkoutX-Key": apiKey } },
    );

    let intentos = 0;
    while (res.status === 429 && intentos < 4) {
      intentos++;
      console.log(
        `429 (límite de peticiones), esperando 20s antes de reintentar...`,
      );
      await new Promise((r) => setTimeout(r, 20000));
      res = await fetch(
        `https://api.workoutxapp.com/v1/exercises?bodyPart=cardio&offset=${offset}`,
        { headers: { "X-WorkoutX-Key": apiKey } },
      );
    }

    if (!res.ok) {
      console.error(`Error HTTP ${res.status}`);
      break;
    }

    const json = await res.json();
    const lote = json.data || [];
    total = json.total ?? lote.length;
    if (lote.length === 0) break;
    lista.push(...lote);
    offset += lote.length;
    console.log(`  ${lista.length}/${total} descargados`);
    await new Promise((r) => setTimeout(r, 2800));
  }

  console.log(`\nCatálogo cardio completo: ${lista.length} ejercicios.\n`);

  const reporte = {};
  for (const [nombreEs, terminoEn] of Object.entries(EJERCICIOS)) {
    const puntuados = lista
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
    puntuados.forEach((c, i) =>
      console.log(
        `  ${i + 1}. [${Math.round(c.score * 100)}%] ${c.name} -> ${c.gifUrl}`,
      ),
    );
  }

  const fs = await import("fs");
  fs.writeFileSync(
    "gifs-candidatos-cardio.json",
    JSON.stringify(reporte, null, 2),
  );
  console.log("\n\nGuardado en gifs-candidatos-cardio.json");
}

main();
