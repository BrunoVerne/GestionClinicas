import { useEffect, useState } from 'react';

import Login from './Login';
import PanelPrincipal from './components/PanelPrincipal';

import {
  logout,
  obtenerUsuarioActual,
} from './services/authService';

export default function Inicio() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const recuperarSesion = async () => {
      try {
        const usuarioActual = await obtenerUsuarioActual();
        setUsuario(usuarioActual);
      } catch (error) {
        console.error('Error recuperando sesión:', error);
        setUsuario(null);
      } finally {
        setCargandoSesion(false);
      }
    };

    recuperarSesion();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    } finally {
      setUsuario(null);
    }
  };

  if (cargandoSesion) {
    return (
      <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
          />

          <p className="text-secondary mb-0">
            Recuperando sesión...
          </p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  return (
    <PanelPrincipal
      usuario={usuario}
      onLogout={handleLogout}
    />
  );
}