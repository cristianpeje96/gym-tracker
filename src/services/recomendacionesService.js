import axios from "axios";

// API gratuita para recomendaciones (usaremos OpenRouter con modelos gratuitos)
const API_KEY = "TU_API_KEY"; // Puedes obtener en openrouter.ai

export const recomendacionesService = {
  // Obtener recomendación de entrenamiento
  async obtenerRecomendacionEntrenamiento(historial, objetivo) {
    try {
      // Datos simplificados para la API
      const datosResumidos = historial.slice(-10).map((sesion) => ({
        fecha: sesion.fecha,
        ejercicios: Object.keys(sesion.ejercicios).length,
        series: Object.values(sesion.ejercicios).reduce(
          (sum, e) => sum + e.length,
          0,
        ),
      }));

      const respuesta = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "Eres un entrenador personal experto. Da recomendaciones cortas y prácticas basadas en los datos del usuario.",
            },
            {
              role: "user",
              content: `Basado en estos datos de entrenamiento: ${JSON.stringify(datosResumidos)} 
              y con objetivo: ${objetivo}, dame 3 recomendaciones específicas para mejorar.`,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      return respuesta.data.choices[0].message.content;
    } catch (error) {
      console.error("Error obteniendo recomendaciones:", error);
      return null;
    }
  },

  // Recomendación nutricional con IA
  async obtenerRecomendacionNutricional(perfil, objetivo, comidas) {
    try {
      const respuesta = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "Eres un nutricionista experto. Da recomendaciones breves y prácticas.",
            },
            {
              role: "user",
              content: `Usuario: ${JSON.stringify(perfil)}. 
              Objetivo: ${objetivo}. 
              Comidas recientes: ${JSON.stringify(comidas.slice(-5))}. 
              Dame 3 consejos nutricionales personalizados.`,
            },
          ],
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      return respuesta.data.choices[0].message.content;
    } catch (error) {
      console.error("Error obteniendo recomendación nutricional:", error);
      return null;
    }
  },
};
