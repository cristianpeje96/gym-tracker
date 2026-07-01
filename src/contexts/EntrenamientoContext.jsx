import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

const EntrenamientoContext = createContext();

export const useEntrenamiento = () => useContext(EntrenamientoContext);

export const EntrenamientoProvider = ({ children }) => {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (user) {
      cargarHistorial();
    }
  }, [user]);

  const cargarHistorial = async () => {
    try {
      const historialRef = doc(db, "historial", user.uid);
      const historialDoc = await getDoc(historialRef);
      if (historialDoc.exists()) {
        setHistorial(historialDoc.data().sesiones || []);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setCargando(false);
    }
  };

  const guardarSesion = async (sesion) => {
    try {
      const historialRef = doc(db, "historial", user.uid);
      await setDoc(
        historialRef,
        {
          sesiones: arrayUnion(sesion),
        },
        { merge: true },
      );

      setHistorial((prev) => [...prev, sesion]);
      return true;
    } catch (error) {
      console.error("Error guardando sesión:", error);
      return false;
    }
  };

  return (
    <EntrenamientoContext.Provider
      value={{
        historial,
        cargando,
        guardarSesion,
      }}
    >
      {children}
    </EntrenamientoContext.Provider>
  );
};
