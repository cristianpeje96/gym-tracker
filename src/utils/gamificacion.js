// Lógica de racha (días consecutivos entrenando) y récords personales (PRs).
// Trabaja directamente sobre el historial de sesiones guardado en Firestore
// (ver services/entrenamientoService.js) para no requerir datos extra.

const aFechaLocal = (fechaStr) => {
  // Las fechas se guardan como "YYYY-MM-DD"; se parsean en horario local
  // para evitar corrimientos de un día por zona horaria.
  const [y, m, d] = fechaStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const diffEnDias = (a, b) => {
  const msPorDia = 24 * 60 * 60 * 1000;
  return Math.round((a - b) / msPorDia);
};

/**
 * Racha actual: cantidad de días consecutivos (hasta hoy o ayer) en los
 * que hubo al menos una sesión guardada. Si hoy ya entrenaste, cuenta hoy;
 * si no, la racha sigue viva mientras hayas entrenado ayer.
 */
export const calcularRacha = (historial) => {
  if (!historial || historial.length === 0) return 0;

  const diasUnicos = Array.from(new Set(historial.map((s) => s.fecha))).sort();

  if (diasUnicos.length === 0) return 0;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ultimoDia = aFechaLocal(diasUnicos[diasUnicos.length - 1]);
  const diasDesdeUltimo = diffEnDias(hoy, ultimoDia);

  // Si la última sesión fue hace más de 1 día, la racha ya se rompió.
  if (diasDesdeUltimo > 1) return 0;

  let racha = 1;
  for (let i = diasUnicos.length - 1; i > 0; i--) {
    const actual = aFechaLocal(diasUnicos[i]);
    const anterior = aFechaLocal(diasUnicos[i - 1]);
    if (diffEnDias(actual, anterior) === 1) {
      racha++;
    } else {
      break;
    }
  }
  return racha;
};

/**
 * Devuelve, por ejercicio, la carga máxima levantada (entre series marcadas
 * como realizadas) en todo el historial. { "Press banca": 80, ... }
 */
export const calcularRecords = (historial) => {
  const records = {};
  (historial || []).forEach((sesion) => {
    Object.entries(sesion.ejercicios || {}).forEach(([nombre, series]) => {
      (series || [])
        .filter((s) => s?.realizado)
        .forEach((s) => {
          const carga = s.carga || 0;
          if (!records[nombre] || carga > records[nombre]) {
            records[nombre] = carga;
          }
        });
    });
  });
  return records;
};

/**
 * Compara una sesión recién guardada contra el historial previo (sin
 * incluirla) y devuelve la lista de ejercicios en los que se batió un
 * récord personal de carga. Se usa para mostrar el mensaje de celebración
 * justo al guardar.
 */
export const detectarNuevosPRs = (sesionNueva, historialPrevio) => {
  const recordsPrevios = calcularRecords(historialPrevio);
  const nuevos = [];

  Object.entries(sesionNueva.ejercicios || {}).forEach(([nombre, series]) => {
    const maxSesion = Math.max(
      0,
      ...(series || []).filter((s) => s?.realizado).map((s) => s.carga || 0),
    );
    const recordPrevio = recordsPrevios[nombre] || 0;
    if (maxSesion > 0 && maxSesion > recordPrevio) {
      nuevos.push({ nombre, carga: maxSesion, anterior: recordPrevio });
    }
  });

  return nuevos;
};

/**
 * Progreso de la semana actual: cuántos días con sesión planificada
 * (no descanso) ya se completaron, sobre el total de días con plan
 * en la semana.
 */
export const progresoSemana = (historial, plan) => {
  const diasConPlan = Object.values(plan || {}).filter(
    (dia) => dia.ejercicios && dia.ejercicios.length > 0,
  ).length;

  const hoy = new Date();
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay());
  inicioSemana.setHours(0, 0, 0, 0);

  const diasEntrenadosEstaSemana = new Set(
    (historial || [])
      .filter((s) => aFechaLocal(s.fecha) >= inicioSemana)
      .map((s) => s.fecha),
  ).size;

  return {
    completadas: Math.min(diasEntrenadosEstaSemana, diasConPlan),
    total: diasConPlan,
  };
};
