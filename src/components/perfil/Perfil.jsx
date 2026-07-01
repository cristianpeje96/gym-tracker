import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { TablaRpe } from "./TablaRpe";
import "./Perfil.module.css";

export const Perfil = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState({
    altura: "",
    peso: "",
    edad: "",
    grasa: "",
    sexo: "masculino",
  });

  const [medidas, setMedidas] = useState({
    brazoIzq: "",
    brazoDer: "",
    pectoral: "",
    cintura: "",
    cadera: "",
    cuadricepsDer: "",
    cuadricepsIzq: "",
  });

  const [imc, setImc] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.perfil) setPerfil(data.perfil);
        if (data.medidas) setMedidas(data.medidas);
        if (data.perfil?.peso && data.perfil?.altura) {
          calcularIMC(data.perfil.peso, data.perfil.altura);
        }
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const calcularIMC = (peso, altura) => {
    if (peso && altura && altura > 0) {
      const alturaM = altura / 100;
      const imcCalculado = peso / (alturaM * alturaM);
      let clasificacion = "";

      if (imcCalculado < 18.5) clasificacion = "Bajo peso";
      else if (imcCalculado < 25) clasificacion = "Normal";
      else if (imcCalculado < 30) clasificacion = "Sobrepeso";
      else clasificacion = "Obesidad";

      setImc({ valor: imcCalculado.toFixed(1), clasificacion });
    }
  };

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));

    if (name === "peso" || name === "altura") {
      const nuevoPeso = name === "peso" ? parseFloat(value) : perfil.peso;
      const nuevaAltura = name === "altura" ? parseFloat(value) : perfil.altura;
      if (nuevoPeso && nuevaAltura) {
        calcularIMC(nuevoPeso, nuevaAltura);
      }
    }
  };

  const handleMedidasChange = (e) => {
    const { name, value } = e.target;
    setMedidas((prev) => ({ ...prev, [name]: value }));
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const userRef = doc(db, "usuarios", user.uid);
      await setDoc(userRef, { perfil }, { merge: true });
      setMensaje({ tipo: "exito", texto: "✅ Perfil guardado correctamente" });
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "❌ Error al guardar el perfil" });
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const guardarMedidas = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const userRef = doc(db, "usuarios", user.uid);
      await setDoc(userRef, { medidas }, { merge: true });
      setMensaje({
        tipo: "exito",
        texto: "✅ Medidas guardadas correctamente",
      });
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "❌ Error al guardar las medidas" });
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="perfil">
      {mensaje && (
        <div className={`perfil__mensaje perfil__mensaje--${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="perfil__card">
        <h3 className="perfil__card-titulo">👤 Datos personales</h3>
        <form onSubmit={guardarPerfil} className="perfil__form">
          <div className="perfil__form-group">
            <label className="perfil__label">Altura (cm)</label>
            <input
              type="number"
              name="altura"
              value={perfil.altura}
              onChange={handlePerfilChange}
              className="perfil__input"
              placeholder="Ej: 164"
              step="1"
            />
          </div>

          <div className="perfil__form-group">
            <label className="perfil__label">Peso (kg)</label>
            <input
              type="number"
              name="peso"
              value={perfil.peso}
              onChange={handlePerfilChange}
              className="perfil__input"
              placeholder="Ej: 65.7"
              step="0.1"
            />
          </div>

          <div className="perfil__form-group">
            <label className="perfil__label">Edad</label>
            <input
              type="number"
              name="edad"
              value={perfil.edad}
              onChange={handlePerfilChange}
              className="perfil__input"
              placeholder="Ej: 29"
            />
          </div>

          <div className="perfil__form-group">
            <label className="perfil__label">% Grasa corporal</label>
            <input
              type="number"
              name="grasa"
              value={perfil.grasa}
              onChange={handlePerfilChange}
              className="perfil__input"
              placeholder="Ej: 25"
              step="0.1"
            />
          </div>

          <div className="perfil__form-group">
            <label className="perfil__label">Sexo</label>
            <select
              name="sexo"
              value={perfil.sexo}
              onChange={handlePerfilChange}
              className="perfil__select"
            >
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>

          {imc && (
            <div className="perfil__imc">
              <div className="perfil__imc-valor">IMC: {imc.valor}</div>
              <div
                className={`perfil__imc-clasificacion perfil__imc-clasificacion--${imc.clasificacion.toLowerCase().replace(" ", "-")}`}
              >
                {imc.clasificacion}
              </div>
            </div>
          )}

          <button type="submit" className="perfil__btn" disabled={cargando}>
            {cargando ? "Guardando..." : "💾 Guardar perfil"}
          </button>
        </form>
      </div>

      <div className="perfil__card">
        <h3 className="perfil__card-titulo">📏 Medidas corporales (cm)</h3>
        <form onSubmit={guardarMedidas} className="perfil__form">
          <div className="perfil__form-row">
            <div className="perfil__form-group">
              <label className="perfil__label">Brazo izquierdo</label>
              <input
                type="number"
                name="brazoIzq"
                value={medidas.brazoIzq}
                onChange={handleMedidasChange}
                className="perfil__input"
                placeholder="Ej: 35"
                step="0.1"
              />
            </div>

            <div className="perfil__form-group">
              <label className="perfil__label">Brazo derecho</label>
              <input
                type="number"
                name="brazoDer"
                value={medidas.brazoDer}
                onChange={handleMedidasChange}
                className="perfil__input"
                placeholder="Ej: 34"
                step="0.1"
              />
            </div>
          </div>

          <div className="perfil__form-group">
            <label className="perfil__label">Pectoral</label>
            <input
              type="number"
              name="pectoral"
              value={medidas.pectoral}
              onChange={handleMedidasChange}
              className="perfil__input"
              placeholder="Ej: 97.5"
              step="0.1"
            />
          </div>

          <div className="perfil__form-row">
            <div className="perfil__form-group">
              <label className="perfil__label">Cintura</label>
              <input
                type="number"
                name="cintura"
                value={medidas.cintura}
                onChange={handleMedidasChange}
                className="perfil__input"
                placeholder="Ej: 85"
                step="0.1"
              />
            </div>

            <div className="perfil__form-group">
              <label className="perfil__label">Cadera</label>
              <input
                type="number"
                name="cadera"
                value={medidas.cadera}
                onChange={handleMedidasChange}
                className="perfil__input"
                placeholder="Ej: 95"
                step="0.1"
              />
            </div>
          </div>

          <div className="perfil__form-row">
            <div className="perfil__form-group">
              <label className="perfil__label">Cuádriceps derecho</label>
              <input
                type="number"
                name="cuadricepsDer"
                value={medidas.cuadricepsDer}
                onChange={handleMedidasChange}
                className="perfil__input"
                placeholder="Ej: 52"
                step="0.1"
              />
            </div>

            <div className="perfil__form-group">
              <label className="perfil__label">Cuádriceps izquierdo</label>
              <input
                type="number"
                name="cuadricepsIzq"
                value={medidas.cuadricepsIzq}
                onChange={handleMedidasChange}
                className="perfil__input"
                placeholder="Ej: 52"
                step="0.1"
              />
            </div>
          </div>

          <button type="submit" className="perfil__btn" disabled={cargando}>
            {cargando ? "Guardando..." : "📏 Guardar medidas"}
          </button>
        </form>
      </div>

      <TablaRpe />
    </div>
  );
};
