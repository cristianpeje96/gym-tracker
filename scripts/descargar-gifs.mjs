/**
 * Script de un solo uso: descarga los GIFs ya confirmados (ver
 * gifs-finales.json, un mapa "Nombre en español" -> "id de WorkoutX")
 * y los guarda como archivos locales en public/ejercicios-gifs/.
 *
 * Así la app deja de depender de la API de WorkoutX en producción: no
 * hace falta ninguna key, no hay riesgo de exponerla, y no importa si
 * WorkoutX cambia sus URLs en el futuro.
 *
 * Uso:
 *   node scripts/descargar-gifs.mjs TU_API_KEY_DE_WORKOUTX
 *
 * Requiere Node 18+ (usa fetch nativo). No necesita instalar nada.
 * Lee gifs-finales.json de la raíz del proyecto.
 */

const apiKey = process.argv[2];
if (!apiKey) {
  console.error("Uso: node scripts/descargar-gifs.mjs TU_API_KEY_DE_WORKOUTX");
  process.exit(1);
}

const slugificar = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function main() {
  const fs = await import("fs");
  const path = await import("path");

  if (!fs.existsSync("gifs-finales.json")) {
    console.error(
      'No encontré gifs-finales.json en la raíz del proyecto. Debe ser un JSON: { "Nombre en español": "id_de_workoutx", ... }',
    );
    process.exit(1);
  }

  const mapa = JSON.parse(fs.readFileSync("gifs-finales.json", "utf-8"));
  const carpetaDestino = path.join("public", "ejercicios-gifs");
  fs.mkdirSync(carpetaDestino, { recursive: true });

  const rutasFinales = {};
  const fallidos = [];

  const entradas = Object.entries(mapa);
  console.log(`Descargando ${entradas.length} GIFs...\n`);

  for (const [nombreEs, id] of entradas) {
    const slug = slugificar(nombreEs);
    const archivoDestino = path.join(carpetaDestino, `${slug}.gif`);

    let res = await fetch(`https://api.workoutxapp.com/v1/gifs/${id}.gif`, {
      headers: { "X-WorkoutX-Key": apiKey },
    });

    let intentos = 0;
    while (res.status === 429 && intentos < 3) {
      intentos++;
      console.log(`  429, esperando 20s...`);
      await new Promise((r) => setTimeout(r, 20000));
      res = await fetch(`https://api.workoutxapp.com/v1/gifs/${id}.gif`, {
        headers: { "X-WorkoutX-Key": apiKey },
      });
    }

    if (!res.ok) {
      console.log(`✗ ${nombreEs} (id ${id}) -> HTTP ${res.status}`);
      fallidos.push(nombreEs);
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(archivoDestino, buffer);
    rutasFinales[nombreEs] = `/ejercicios-gifs/${slug}.gif`;
    console.log(
      `✓ ${nombreEs} -> ${archivoDestino} (${(buffer.length / 1024).toFixed(0)} KB)`,
    );

    // Pausa para respetar el límite de peticiones/minuto.
    await new Promise((r) => setTimeout(r, 2500));
  }

  fs.writeFileSync(
    "gifs-rutas-locales.json",
    JSON.stringify(rutasFinales, null, 2),
  );

  console.log(
    `\n${Object.keys(rutasFinales).length}/${entradas.length} GIFs descargados correctamente.`,
  );
  if (fallidos.length > 0) {
    console.log(`Fallidos (revisar cuota o id): ${fallidos.join(", ")}`);
  }
  console.log("\nMapa de rutas locales guardado en gifs-rutas-locales.json");
  console.log("Los archivos .gif quedaron en public/ejercicios-gifs/");
}

main();
