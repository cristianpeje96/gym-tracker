import React, { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "../../firebase/firebase";
import { entrenamientoService } from "../../services/entrenamientoService";
import {
  obtenerRecomendaciones,
  FACTORES_ACTIVIDAD,
} from "../../utils/calculosNutricionales";

export const ControlNutricional = () => {
  const [userId, setUserId] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [objetivo, setObjetivo] = useState("mantenimiento");
  const [nivelActividad, setNivelActividad] = useState("moderado");
  const [recomendaciones, setRecomendaciones] = useState(null);
  const [pesoActual, setPesoActual] = useState("");
  const [pesosRegistrados, setPesosRegistrados] = useState([]);
  const [comidas, setComidas] = useState([]);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth no inicializado");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const perfilData = await entrenamientoService.obtenerPerfil(user.uid);
          if (perfilData) {
            setPerfil(perfilData);
            setPesoActual(perfilData.peso || "");
          }
        } catch (error) {
          console.error("Error cargando perfil:", error);
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (perfil && perfil.peso && perfil.altura && perfil.edad && perfil.sexo) {
      const recomendacionesObj = obtenerRecomendaciones(
        objetivo,
        parseFloat(perfil.peso),
        parseFloat(perfil.altura),
        parseInt(perfil.edad),
        perfil.sexo,
        nivelActividad,
      );
      setRecomendaciones(recomendacionesObj);
    }
  }, [perfil, objetivo, nivelActividad]);

  const handleRegistrarPeso = () => {
    if (!pesoActual) return;
    const nuevoRegistro = {
      fecha: new Date().toISOString().split("T")[0],
      peso: parseFloat(pesoActual),
    };
    setPesosRegistrados([...pesosRegistrados, nuevoRegistro]);
    setPesoActual("");
  };

  const handleRegistrarComida = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const comida = {
      fecha: new Date().toISOString().split("T")[0],
      tipo: formData.get("tipo"),
      nombre: formData.get("nombre"),
      calorias: parseInt(formData.get("calorias")) || 0,
      proteinas: parseInt(formData.get("proteinas")) || 0,
      carbohidratos: parseInt(formData.get("carbohidratos")) || 0,
      grasas: parseInt(formData.get("grasas")) || 0,
    };
    setComidas([...comidas, comida]);
    e.target.reset();
  };

  const calcularTotalDia = () => {
    const hoy = new Date().toISOString().split("T")[0];
    const comidasHoy = comidas.filter((c) => c.fecha === hoy);
    return comidasHoy.reduce(
      (total, c) => ({
        calorias: total.calorias + c.calorias,
        proteinas: total.proteinas + c.proteinas,
        carbohidratos: total.carbohidratos + c.carbohidratos,
        grasas: total.grasas + c.grasas,
      }),
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 },
    );
  };

  const totalDia = calcularTotalDia();

  if (!userId) {
    return (
      <div style={{ padding: "16px", textAlign: "center" }}>
        <p>🔄 Conectando a la nube...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "16px" }}>🥗 Control Nutricional</h2>

      {!perfil ? (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <p>
            📝 Completa tu perfil primero para obtener recomendaciones
            personalizadas
          </p>
          <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
            Ve a la sección de Perfil para ingresar tus datos
          </p>
        </div>
      ) : (
        <>
          {/* Selector de Objetivo */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "16px",
            }}
          >
            <h4>🎯 Objetivo</h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              <button
                onClick={() => setObjetivo("deficit")}
                style={{
                  padding: "12px",
                  background: objetivo === "deficit" ? "#f56565" : "#f7fafc",
                  color: objetivo === "deficit" ? "white" : "#4a5568",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                📉 Déficit
                <br />
                <small>Perder peso</small>
              </button>
              <button
                onClick={() => setObjetivo("mantenimiento")}
                style={{
                  padding: "12px",
                  background:
                    objetivo === "mantenimiento" ? "#48bb78" : "#f7fafc",
                  color: objetivo === "mantenimiento" ? "white" : "#4a5568",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                ⚖️ Mantener
                <br />
                <small>Peso actual</small>
              </button>
              <button
                onClick={() => setObjetivo("superavit")}
                style={{
                  padding: "12px",
                  background: objetivo === "superavit" ? "#4299e1" : "#f7fafc",
                  color: objetivo === "superavit" ? "white" : "#4a5568",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                📈 Superávit
                <br />
                <small>Ganar músculo</small>
              </button>
            </div>
          </div>

          {/* Recomendaciones Personalizadas */}
          {recomendaciones && (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "16px",
              }}
            >
              <h4>📊 Recomendaciones Personalizadas</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    background: "#f7fafc",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#718096" }}>
                    Calorías diarias
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#667eea",
                    }}
                  >
                    {recomendaciones.caloriasObjetivo} kcal
                  </div>
                </div>
                <div
                  style={{
                    background: "#f7fafc",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#718096" }}>
                    Mantenimiento
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#718096",
                    }}
                  >
                    {recomendaciones.mantenimiento} kcal
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "12px" }}>
                <h5 style={{ fontSize: "14px", marginBottom: "8px" }}>
                  Macros diarios
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      background: "#ebf8ff",
                      padding: "12px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#4299e1",
                      }}
                    >
                      {recomendaciones.macros.proteinas}g
                    </div>
                    <div style={{ fontSize: "11px", color: "#718096" }}>
                      Proteínas
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#fef5e7",
                      padding: "12px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#ed8936",
                      }}
                    >
                      {recomendaciones.macros.carbohidratos}g
                    </div>
                    <div style={{ fontSize: "11px", color: "#718096" }}>
                      Carbohidratos
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#fef5e7",
                      padding: "12px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#ed8936",
                      }}
                    >
                      {recomendaciones.macros.grasas}g
                    </div>
                    <div style={{ fontSize: "11px", color: "#718096" }}>
                      Grasas
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "12px" }}>
                <h5 style={{ fontSize: "14px", marginBottom: "8px" }}>
                  💡 Consejos
                </h5>
                <ul
                  style={{
                    fontSize: "13px",
                    color: "#4a5568",
                    paddingLeft: "20px",
                  }}
                >
                  {recomendaciones.consejos.map((consejo, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>
                      {consejo}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Registro de Peso */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "16px",
            }}
          >
            <h4>⚖️ Registrar Peso</h4>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <input
                type="number"
                value={pesoActual}
                onChange={(e) => setPesoActual(e.target.value)}
                placeholder="Peso actual (kg)"
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <button
                onClick={handleRegistrarPeso}
                style={{
                  padding: "10px 20px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Registrar
              </button>
            </div>

            {pesosRegistrados.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Últimos registros:
                </div>
                {pesosRegistrados
                  .slice(-5)
                  .reverse()
                  .map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: "13px",
                        color: "#4a5568",
                        padding: "4px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {p.fecha}: <strong>{p.peso} kg</strong>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Registro de Comidas */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "16px",
            }}
          >
            <h4>🍽️ Registrar Comida</h4>
            <form
              onSubmit={handleRegistrarComida}
              style={{ marginTop: "12px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <select
                  name="tipo"
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <option value="desayuno">Desayuno</option>
                  <option value="almuerzo">Almuerzo</option>
                  <option value="cena">Cena</option>
                  <option value="snack">Snack</option>
                </select>
                <input
                  name="nombre"
                  placeholder="Nombre del plato"
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <input
                  name="calorias"
                  type="number"
                  placeholder="Calorías"
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <input
                  name="proteinas"
                  type="number"
                  placeholder="Proteínas (g)"
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <input
                  name="carbohidratos"
                  type="number"
                  placeholder="Carbohidratos (g)"
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <input
                  name="grasas"
                  type="number"
                  placeholder="Grasas (g)"
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  marginTop: "12px",
                  padding: "10px 20px",
                  background: "#48bb78",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                + Agregar Comida
              </button>
            </form>

            {/* Resumen del día */}
            {comidas.filter(
              (c) => c.fecha === new Date().toISOString().split("T")[0],
            ).length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <h5 style={{ fontSize: "14px", marginBottom: "8px" }}>
                  📊 Resumen del día
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      background: "#f7fafc",
                      padding: "8px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {totalDia.calorias} kcal
                    </div>
                    <div style={{ fontSize: "11px", color: "#718096" }}>
                      Calorías
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f7fafc",
                      padding: "8px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "#4299e1" }}>
                      {totalDia.proteinas}g
                    </div>
                    <div style={{ fontSize: "11px", color: "#718096" }}>
                      Proteínas
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f7fafc",
                      padding: "8px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "#ed8936" }}>
                      {totalDia.carbohidratos}g
                    </div>
                    <div style={{ fontSize: "11px", color: "#718096" }}>
                      Carbs
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f7fafc",
                      padding: "8px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "#ed8936" }}>
                      {totalDia.grasas}g
                    </div>
                    <div style={{ fontSize: "11px", color: "#718096" }}>
                      Grasas
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
