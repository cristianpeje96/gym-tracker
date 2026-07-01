// Calcular IMC
export const calcularIMC = (peso, altura) => {
  if (!peso || !altura || altura === 0) return null;
  const alturaMetros = altura / 100;
  const imc = peso / (alturaMetros * alturaMetros);
  return imc.toFixed(1);
};

// Obtener clasificación del IMC
export const getClasificacionIMC = (imc) => {
  const imcNum = parseFloat(imc);
  if (imcNum < 18.5) return "Bajo peso";
  if (imcNum < 25) return "Normal";
  if (imcNum < 30) return "Sobrepeso";
  return "Obesidad";
};

// Formatear fecha
export const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES");
};

// Obtener día actual
export const getDiaActual = () => {
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return dias[new Date().getDay()];
};

// Obtener día de la semana a partir de fecha
export const getDiaSemana = (fecha) => {
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return dias[new Date(fecha).getDay()];
};
