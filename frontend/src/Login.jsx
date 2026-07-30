import { useState } from 'react';
import { login } from './services/authService';

export default function Login({ onLogin }) {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setCargando(true);

    try {
      const usuario = await login(nombreUsuario, password);
      onLogin(usuario);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div
        className="card border-0 shadow-sm p-4 w-100"
        style={{ maxWidth: '400px' }}
      >
        <div className="text-center mb-4">
          <div className="fs-1 text-primary mb-2">
            <i className="bi bi-hospital" />
          </div>

          <h1 className="h4 fw-bold mb-1">
            Gestión de Clínicas
          </h1>

          <p className="text-secondary mb-0">
            Ingresá con tu usuario
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="nombreUsuario"
              className="form-label"
            >
              Usuario
            </label>

            <input
              id="nombreUsuario"
              type="text"
              className="form-control"
              value={nombreUsuario}
              onChange={(event) => setNombreUsuario(event.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}