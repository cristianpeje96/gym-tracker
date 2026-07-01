import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { entrenamientoService } from "../services/entrenamientoService";

const EntrenamientoContext = createContext();

export const useEntrenamiento = () => useContext(EntrenamientoContext);

export const EntrenamientoProvider = ({ children }) => {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (user) {
      cargarHistorial();
    } else {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const sesiones = await entrenamientoService.obtenerHistorial(user.uid);
      setHistorial(sesiones);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setCargando(false);
    }
  };

  const guardarSesion = async (sesion) => {
    if (!user) return false;
    const resultado = await entrenamientoService.guardarSesion(
      user.uid,
      sesion,
    );
    if (resultado.success) {
      setHistorial((prev) => [...prev, sesion]);
    }
    return resultado.success;
  };

  return (
    <EntrenamientoContext.Provider
      value={{
        historial,
        cargando,
        guardarSesion,
        recargar: cargarHistorial,
      }}
    >
      {children}
    </EntrenamientoContext.Provider>
  );
};
