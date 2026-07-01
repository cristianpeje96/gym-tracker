// Cálculo de calorías basales (TMB)
export const calcularTMB = (peso, altura, edad, sexo) => {
  if (sexo === "masculino") {
    return 10 * peso + 6.25 * altura - 5 * edad + 5;
  } else {
    return 10 * peso + 6.25 * altura - 5 * edad - 161;
  }
};

// Factor de actividad
export const FACTORES_ACTIVIDAD = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muyActivo: 1.9,
};

// Calcular calorías de mantenimiento
export const calcularMantenimiento = (tmb, factorActividad) => {
  return tmb * factorActividad;
};

// Calcular macros según objetivo
export const calcularMacros = (caloriasObjetivo, peso, objetivo) => {
  let proteinas, carbohidratos, grasas;

  if (objetivo === "deficit") {
    // Déficit calórico (pérdida de peso)
    proteinas = peso * 2.2; // 2.2g por kg
    grasas = (caloriasObjetivo * 0.25) / 9;
    carbohidratos = (caloriasObjetivo - (proteinas * 4 + grasas * 9)) / 4;
  } else if (objetivo === "superavit") {
    // Superávit calórico (ganancia muscular)
    proteinas = peso * 2.5; // 2.5g por kg
    grasas = (caloriasObjetivo * 0.3) / 9;
    carbohidratos = (caloriasObjetivo - (proteinas * 4 + grasas * 9)) / 4;
  } else {
    // Mantenimiento
    proteinas = peso * 1.8;
    grasas = (caloriasObjetivo * 0.25) / 9;
    carbohidratos = (caloriasObjetivo - (proteinas * 4 + grasas * 9)) / 4;
  }

  return {
    proteinas: Math.round(proteinas),
    carbohidratos: Math.round(carbohidratos),
    grasas: Math.round(grasas),
    calorias: Math.round(caloriasObjetivo),
  };
};

// Recomendaciones según objetivo
export const obtenerRecomendaciones = (
  objetivo,
  peso,
  altura,
  edad,
  sexo,
  nivelActividad,
) => {
  const tmb = calcularTMB(peso, altura, edad, sexo);
  const mantenimiento = calcularMantenimiento(
    tmb,
    FACTORES_ACTIVIDAD[nivelActividad],
  );

  let caloriasObjetivo, consejos;

  switch (objetivo) {
    case "deficit":
      caloriasObjetivo = mantenimiento - 500;
      consejos = [
        "🥗 Déficit de 500 kcal diarias para perder ~0.5kg por semana",
        "💧 Bebe 2-3 litros de agua al día",
        "🥩 Prioriza proteínas para mantener masa muscular",
        "🏃‍♂️ Añade cardio 3 veces por semana",
        "📉 Pésate 1 vez por semana en ayunas",
      ];
      break;
    case "superavit":
      caloriasObjetivo = mantenimiento + 300;
      consejos = [
        "💪 Superávit de 300 kcal diarias para ganar ~0.5kg por mes",
        "🥩 Consume 2.5g de proteína por kg de peso",
        "🏋️ Entrena pesado con sobrecarga progresiva",
        "🛌 Duerme 7-9 horas para la recuperación",
        "📈 Aumenta carbs antes del entrenamiento",
      ];
      break;
    default:
      caloriasObjetivo = mantenimiento;
      consejos = [
        "⚖️ Mantén tu peso actual",
        "🥗 Balancea tus macros correctamente",
        "💪 Entrena con consistencia",
        "🧘‍♂️ Escucha a tu cuerpo",
      ];
  }

  const macros = calcularMacros(caloriasObjetivo, peso, objetivo);

  return {
    caloriasObjetivo: Math.round(caloriasObjetivo),
    mantenimiento: Math.round(mantenimiento),
    macros,
    consejos,
    deficitSuperavit:
      objetivo === "deficit" ? -500 : objetivo === "superavit" ? 300 : 0,
  };
};
