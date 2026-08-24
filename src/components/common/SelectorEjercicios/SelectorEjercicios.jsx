import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { ejerciciosService } from "../../../services/ejerciciosService";
import {
  GRUPOS_MUSCULARES,
  EJERCICIOS_PREDEFINIDOS,
  obtenerGifPorNombre,
} from "../../../constants/ejerciciosLibrary";
import { ArrowLeft, X, Plus, SearchX } from "lucide-react";
import "./SelectorEjercicios.css";

/**
 * Selector de ejercicios en formato "hoja inferior".
 * Permite elegir de una lista predefinida agrupada por músculo objetivo,
 * o agregar un ejercicio propio (el que indique el instructor) que queda
 * guardado para futuras sesiones.
 */
export const SelectorEjercicios = ({ abierto, onCerrar, onAgregar }) => {
  const { user } = useAuth();
  const [personalizados, setPersonalizados] = useState([]);
  const [grupoActivo, setGrupoActivo] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ejercicioElegido, setEjercicioElegido] = useState(null);
  const [mostrarFormPropio, setMostrarFormPropio] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoGrupo, setNuevoGrupo] = useState(GRUPOS_MUSCULARES[0].id);

  // Valores del paso de confirmación (series/reps/carga)
  const [series, setSeries] = useState(4);
  const [reps, setReps] = useState(10);
  const [carga, setCarga] = useState(0);

  useEffect(() => {
    if (abierto && user) {
      ejerciciosService.obtenerPersonalizados(user.uid).then(setPersonalizados);
    }
    if (!abierto) {
      // Reiniciar estado al cerrar
      setGrupoActivo("todos");
      setBusqueda("");
      setEjercicioElegido(null);
      setMostrarFormPropio(false);
      setNuevoNombre("");
    }
  }, [abierto, user]);

  const listaCompleta = useMemo(
    () => [...EJERCICIOS_PREDEFINIDOS, ...personalizados],
    [personalizados],
  );

  const ejerciciosFiltrados = useMemo(() => {
    return listaCompleta.filter((ej) => {
      const coincideGrupo = grupoActivo === "todos" || ej.grupo === grupoActivo;
      const coincideBusqueda = ej.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      return coincideGrupo && coincideBusqueda;
    });
  }, [listaCompleta, grupoActivo, busqueda]);

  if (!abierto) return null;

  const handleElegir = (ejercicio) => {
    setEjercicioElegido(ejercicio);
    setSeries(4);
    setReps(10);
    setCarga(0);
  };

  const handleConfirmarAgregar = () => {
    onAgregar({
      nombre: ejercicioElegido.nombre,
      grupo: ejercicioElegido.grupo,
      series,
      reps,
      carga,
    });
  };

  const handleGuardarPropio = async () => {
    if (!nuevoNombre.trim() || !user) return;
    const ejercicio = { nombre: nuevoNombre.trim(), grupo: nuevoGrupo };
    await ejerciciosService.agregarPersonalizado(user.uid, ejercicio);
    setPersonalizados((prev) => [...prev, ejercicio]);
    setMostrarFormPropio(false);
    setNuevoNombre("");
    handleElegir(ejercicio);
  };

  return (
    <div className="selector-ejercicios__overlay" onClick={onCerrar}>
      <div
        className="selector-ejercicios__hoja"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="selector-ejercicios__agarradera" />

        {ejercicioElegido ? (
          // ---- Paso 2: confirmar series / reps / carga ----
          <>
            <div className="selector-ejercicios__header">
              <button
                className="selector-ejercicios__volver"
                onClick={() => setEjercicioElegido(null)}
              >
                <ArrowLeft size={15} strokeWidth={2} /> Volver
              </button>
              <button
                className="selector-ejercicios__cerrar"
                onClick={onCerrar}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
            <div className="selector-ejercicios__paso2">
              <h3 className="selector-ejercicios__titulo-confirmar">
                {ejercicioElegido.nombre}
              </h3>
              {obtenerGifPorNombre(ejercicioElegido.nombre) && (
                <img
                  src={obtenerGifPorNombre(ejercicioElegido.nombre)}
                  alt={`Cómo hacer ${ejercicioElegido.nombre}`}
                  className="selector-ejercicios__gif"
                  loading="lazy"
                />
              )}
              <div className="selector-ejercicios__campos-confirmar">
                <label className="selector-ejercicios__campo">
                  <span>Series</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={series}
                    onChange={(e) => setSeries(parseInt(e.target.value) || 0)}
                  />
                </label>
                <label className="selector-ejercicios__campo">
                  <span>Reps</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                  />
                </label>
                <label className="selector-ejercicios__campo">
                  <span>Kg iniciales</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="2.5"
                    value={carga}
                    onChange={(e) => setCarga(parseFloat(e.target.value) || 0)}
                  />
                </label>
              </div>
              <button
                className="selector-ejercicios__btn-confirmar"
                onClick={handleConfirmarAgregar}
              >
                <Plus size={16} strokeWidth={2} /> Agregar a la rutina
              </button>
            </div>
          </>
        ) : (
          // ---- Paso 1: elegir de la lista ----
          <>
            <div className="selector-ejercicios__header">
              <h3>Elegir ejercicio</h3>
              <button
                className="selector-ejercicios__cerrar"
                onClick={onCerrar}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            <input
              type="text"
              className="selector-ejercicios__buscar"
              placeholder="Buscar ejercicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="selector-ejercicios__grupos">
              <button
                className={`selector-ejercicios__grupo ${grupoActivo === "todos" ? "selector-ejercicios__grupo--activo" : ""}`}
                onClick={() => setGrupoActivo("todos")}
              >
                Todos
              </button>
              {GRUPOS_MUSCULARES.map((g) => (
                <button
                  key={g.id}
                  className={`selector-ejercicios__grupo ${grupoActivo === g.id ? "selector-ejercicios__grupo--activo" : ""}`}
                  onClick={() => setGrupoActivo(g.id)}
                >
                  <span aria-hidden="true">{g.icono}</span> {g.label}
                </button>
              ))}
            </div>

            <div className="selector-ejercicios__lista">
              {ejerciciosFiltrados.length === 0 ? (
                <p className="selector-ejercicios__vacio">
                  <SearchX size={22} strokeWidth={1.5} />
                  <span>No se encontraron ejercicios</span>
                </p>
              ) : (
                ejerciciosFiltrados.map((ej, idx) => (
                  <button
                    key={`${ej.nombre}-${idx}`}
                    className="selector-ejercicios__item"
                    onClick={() => handleElegir(ej)}
                  >
                    <span>{ej.nombre}</span>
                    <span className="selector-ejercicios__item-grupo">
                      {GRUPOS_MUSCULARES.find((g) => g.id === ej.grupo)
                        ?.label || ej.grupo}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="selector-ejercicios__footer">
              {mostrarFormPropio ? (
                <div className="selector-ejercicios__form-propio">
                  <input
                    type="text"
                    placeholder="Nombre del ejercicio (el que te dio tu instructor)"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="selector-ejercicios__buscar"
                  />
                  <select
                    value={nuevoGrupo}
                    onChange={(e) => setNuevoGrupo(e.target.value)}
                    className="selector-ejercicios__select-grupo"
                  >
                    {GRUPOS_MUSCULARES.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <button
                    className="selector-ejercicios__btn-confirmar"
                    onClick={handleGuardarPropio}
                    disabled={!nuevoNombre.trim()}
                  >
                    Guardar y usar
                  </button>
                </div>
              ) : (
                <button
                  className="selector-ejercicios__btn-propio"
                  onClick={() => setMostrarFormPropio(true)}
                >
                  <Plus size={15} strokeWidth={2} /> No está en la lista,
                  agregar el mío
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
