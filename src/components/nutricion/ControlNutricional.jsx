import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { entrenamientoService } from "../../services/entrenamientoService";
import { nutricionService } from "../../services/nutricionService";
import { obtenerRecomendaciones } from "../../utils/calculosNutricionales";
import {
  Salad,
  Loader2,
  FileText,
  Target,
  TrendingDown,
  Scale,
  TrendingUp,
  Lightbulb,
  Utensils,
  Plus,
  BarChart3,
} from "lucide-react";
import "./ControlNutricional.css";

export const ControlNutricional = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [objetivo, setObjetivo] = useState("mantenimiento");
  const [nivelActividad] = useState("moderado");
  const [recomendaciones, setRecomendaciones] = useState(null);
  const [pesoActual, setPesoActual] = useState("");
  const [pesosRegistrados, setPesosRegistrados] = useState([]);
  const [comidas, setComidas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) {
        setCargando(false);
        return;
      }
      try {
        const perfilData = await entrenamientoService.obtenerPerfil(user.uid);
        if (perfilData) {
          setPerfil(perfilData);
          setPesoActual(perfilData.peso || "");
        }

        // Bug corregido: antes los pesos y comidas registrados solo
        // vivían en memoria y se perdían al recargar la página.
        const { pesos, comidas: comidasGuardadas } =
          await nutricionService.obtenerDatos(user.uid);
        setPesosRegistrados(pesos);
        setComidas(comidasGuardadas);
      } catch (error) {
        console.error("Error cargando datos de nutrición:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [user]);

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

  const handleRegistrarPeso = async () => {
    if (!pesoActual || !user) return;
    const nuevoRegistro = {
      fecha: new Date().toISOString().split("T")[0],
      peso: parseFloat(pesoActual),
    };
    setPesosRegistrados((prev) => [...prev, nuevoRegistro]);
    await nutricionService.registrarPeso(user.uid, nuevoRegistro);
  };

  const handleRegistrarComida = async (e) => {
    e.preventDefault();
    if (!user) return;
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
    setComidas((prev) => [...prev, comida]);
    await nutricionService.registrarComida(user.uid, comida);
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

  if (!user || cargando) {
    return (
      <div className="nutricion__cargando">
        <Loader2 size={20} strokeWidth={2} className="icono-spin" />
        <p>Conectando a la nube...</p>
      </div>
    );
  }

  return (
    <div className="nutricion">
      <h2 className="nutricion__titulo">
        <Salad size={20} strokeWidth={1.75} /> Control Nutricional
      </h2>

      {!perfil ? (
        <div className="nutricion__card nutricion__card--centrada">
          <p className="nutricion__card-mensaje">
            <FileText size={16} strokeWidth={1.75} /> Completa tu perfil primero
            para obtener recomendaciones personalizadas
          </p>
          <p className="nutricion__nota">
            Ve a la sección de Perfil para ingresar tus datos
          </p>
        </div>
      ) : (
        <>
          <div className="nutricion__card">
            <h4 className="nutricion__card-titulo">
              <Target size={16} strokeWidth={1.75} /> Objetivo
            </h4>
            <div className="nutricion__objetivos">
              <button
                onClick={() => setObjetivo("deficit")}
                className={`nutricion__objetivo-btn ${objetivo === "deficit" ? "nutricion__objetivo-btn--deficit" : ""}`}
              >
                <TrendingDown size={18} strokeWidth={1.75} />
                Déficit
                <br />
                <small>Perder peso</small>
              </button>
              <button
                onClick={() => setObjetivo("mantenimiento")}
                className={`nutricion__objetivo-btn ${objetivo === "mantenimiento" ? "nutricion__objetivo-btn--mantenimiento" : ""}`}
              >
                <Scale size={18} strokeWidth={1.75} />
                Mantener
                <br />
                <small>Peso actual</small>
              </button>
              <button
                onClick={() => setObjetivo("superavit")}
                className={`nutricion__objetivo-btn ${objetivo === "superavit" ? "nutricion__objetivo-btn--superavit" : ""}`}
              >
                <TrendingUp size={18} strokeWidth={1.75} />
                Superávit
                <br />
                <small>Ganar músculo</small>
              </button>
            </div>
          </div>

          {recomendaciones && (
            <div className="nutricion__card">
              <h4 className="nutricion__card-titulo">
                <BarChart3 size={16} strokeWidth={1.75} /> Recomendaciones
                Personalizadas
              </h4>
              <div className="nutricion__grid-2">
                <div className="nutricion__mini-card">
                  <div className="nutricion__mini-label">Calorías diarias</div>
                  <div className="nutricion__mini-valor nutricion__mini-valor--iron">
                    {recomendaciones.caloriasObjetivo} kcal
                  </div>
                </div>
                <div className="nutricion__mini-card">
                  <div className="nutricion__mini-label">Mantenimiento</div>
                  <div className="nutricion__mini-valor">
                    {recomendaciones.mantenimiento} kcal
                  </div>
                </div>
              </div>

              <div className="nutricion__macros">
                <h5 className="nutricion__subtitulo">Macros diarios</h5>
                <div className="nutricion__grid-3">
                  <div className="nutricion__macro nutricion__macro--proteina">
                    <div className="nutricion__macro-valor">
                      {recomendaciones.macros.proteinas}g
                    </div>
                    <div className="nutricion__macro-label">Proteínas</div>
                  </div>
                  <div className="nutricion__macro nutricion__macro--carbo">
                    <div className="nutricion__macro-valor">
                      {recomendaciones.macros.carbohidratos}g
                    </div>
                    <div className="nutricion__macro-label">Carbohidratos</div>
                  </div>
                  <div className="nutricion__macro nutricion__macro--grasa">
                    <div className="nutricion__macro-valor">
                      {recomendaciones.macros.grasas}g
                    </div>
                    <div className="nutricion__macro-label">Grasas</div>
                  </div>
                </div>
              </div>

              <div className="nutricion__consejos">
                <h5 className="nutricion__subtitulo">
                  <Lightbulb size={14} strokeWidth={1.75} /> Consejos
                </h5>
                <ul className="nutricion__lista-consejos">
                  {recomendaciones.consejos.map((consejo, idx) => (
                    <li key={idx}>{consejo}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="nutricion__card">
            <h4 className="nutricion__card-titulo">
              <Scale size={16} strokeWidth={1.75} /> Registrar Peso
            </h4>
            <div className="nutricion__registro-peso">
              <input
                type="number"
                value={pesoActual}
                onChange={(e) => setPesoActual(e.target.value)}
                placeholder="Peso actual (kg)"
                className="nutricion__input"
              />
              <button
                onClick={handleRegistrarPeso}
                className="nutricion__btn-primario"
              >
                Registrar
              </button>
            </div>

            {pesosRegistrados.length > 0 && (
              <div className="nutricion__historial-pesos">
                <div className="nutricion__historial-titulo">
                  Últimos registros:
                </div>
                {pesosRegistrados
                  .slice(-5)
                  .reverse()
                  .map((p, idx) => (
                    <div key={idx} className="nutricion__historial-item">
                      {p.fecha}: <strong>{p.peso} kg</strong>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="nutricion__card">
            <h4 className="nutricion__card-titulo">
              <Utensils size={16} strokeWidth={1.75} /> Registrar Comida
            </h4>
            <form
              onSubmit={handleRegistrarComida}
              className="nutricion__form-comida"
            >
              <div className="nutricion__grid-2">
                <select name="tipo" className="nutricion__input">
                  <option value="desayuno">Desayuno</option>
                  <option value="almuerzo">Almuerzo</option>
                  <option value="cena">Cena</option>
                  <option value="snack">Snack</option>
                </select>
                <input
                  name="nombre"
                  placeholder="Nombre del plato"
                  className="nutricion__input"
                />
                <input
                  name="calorias"
                  type="number"
                  placeholder="Calorías"
                  className="nutricion__input"
                />
                <input
                  name="proteinas"
                  type="number"
                  placeholder="Proteínas (g)"
                  className="nutricion__input"
                />
                <input
                  name="carbohidratos"
                  type="number"
                  placeholder="Carbohidratos (g)"
                  className="nutricion__input"
                />
                <input
                  name="grasas"
                  type="number"
                  placeholder="Grasas (g)"
                  className="nutricion__input"
                />
              </div>
              <button type="submit" className="nutricion__btn-agregar">
                <Plus size={16} strokeWidth={2} /> Agregar Comida
              </button>
            </form>

            {comidas.filter(
              (c) => c.fecha === new Date().toISOString().split("T")[0],
            ).length > 0 && (
              <div className="nutricion__resumen-dia">
                <h5 className="nutricion__subtitulo">
                  <BarChart3 size={14} strokeWidth={1.75} /> Resumen del día
                </h5>
                <div className="nutricion__grid-4">
                  <div className="nutricion__resumen-item">
                    <div className="nutricion__resumen-valor">
                      {totalDia.calorias} kcal
                    </div>
                    <div className="nutricion__resumen-label">Calorías</div>
                  </div>
                  <div className="nutricion__resumen-item">
                    <div className="nutricion__resumen-valor nutricion__resumen-valor--info">
                      {totalDia.proteinas}g
                    </div>
                    <div className="nutricion__resumen-label">Proteínas</div>
                  </div>
                  <div className="nutricion__resumen-item">
                    <div className="nutricion__resumen-valor nutricion__resumen-valor--warning">
                      {totalDia.carbohidratos}g
                    </div>
                    <div className="nutricion__resumen-label">Carbs</div>
                  </div>
                  <div className="nutricion__resumen-item">
                    <div className="nutricion__resumen-valor nutricion__resumen-valor--warning">
                      {totalDia.grasas}g
                    </div>
                    <div className="nutricion__resumen-label">Grasas</div>
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
