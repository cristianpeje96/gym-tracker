import React, { createContext, useEffect, useState } from "react";
import { auth, configuracionValida } from "../firebase/firebase";
import {
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  linkWithPopup,
  signInWithPopup,
  signInWithCredential,
  signOut,
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorAuth, setErrorAuth] = useState(null);
  const [vinculando, setVinculando] = useState(false);
  // Credencial pendiente cuando Google ya tiene una cuenta propia en la
  // app. En vez de usar window.confirm() (los navegadores modernos lo
  // suprimen si la ventana no tiene el foco justo en ese instante, que es
  // exactamente lo que pasa al volver de un popup de Google), mostramos
  // un modal propio controlado por este estado.
  const [credencialPendiente, setCredencialPendiente] = useState(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    if (!auth.currentUser) {
      signInAnonymously(auth).catch(console.error);
    }

    return unsubscribe;
  }, []);

  const iniciarSesionConGoogle = async () => {
    if (!auth) return;
    setErrorAuth(null);
    setVinculando(true);
    const provider = new GoogleAuthProvider();

    try {
      if (auth.currentUser?.isAnonymous) {
        await linkWithPopup(auth.currentUser, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      if (error.code === "auth/credential-already-in-use") {
        // Guardamos la credencial y dejamos que la UI (modal propio)
        // pregunte al usuario, en vez de window.confirm().
        const credential = GoogleAuthProvider.credentialFromError(error);
        setCredencialPendiente(credential);
      } else if (error.code === "auth/popup-closed-by-user") {
        // El usuario cerró el popup, no es un error real.
      } else {
        console.error("Error iniciando sesión con Google:", error);
        setErrorAuth("No se pudo iniciar sesión con Google. Intenta de nuevo.");
      }
    } finally {
      setVinculando(false);
    }
  };

  const confirmarCambioDeCuenta = async () => {
    if (!credencialPendiente) return;
    setVinculando(true);
    try {
      await signInWithCredential(auth, credencialPendiente);
    } catch (error) {
      console.error("Error entrando a la cuenta existente:", error);
      setErrorAuth("No se pudo iniciar sesión. Intenta de nuevo.");
    } finally {
      setCredencialPendiente(null);
      setVinculando(false);
    }
  };

  const cancelarCambioDeCuenta = () => setCredencialPendiente(null);

  const cerrarSesion = async () => {
    if (!auth) return;
    await signOut(auth);
    await signInAnonymously(auth).catch(console.error);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configError: !configuracionValida,
        esInvitado: !!user?.isAnonymous,
        errorAuth,
        vinculando,
        hayConflictoDeCuenta: !!credencialPendiente,
        iniciarSesionConGoogle,
        confirmarCambioDeCuenta,
        cancelarCambioDeCuenta,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
