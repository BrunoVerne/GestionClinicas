import '../../styles/panel/contenidoPrincipal.css';

export default function ContenidoPrincipal({
  cargando,
  error,
  children,
}) {
  return (
    <main className="contenido-principal container py-4">
      {cargando && (
        <div className="contenido-principal__carga">
          <div
            className="spinner-border text-primary"
            role="status"
            aria-label="Cargando"
          />

          <div>
            <h2 className="contenido-principal__carga-titulo">
              Cargando información
            </h2>

            <p className="contenido-principal__carga-texto">
              Estamos preparando los datos clínicos.
            </p>
          </div>
        </div>
      )}

      {!cargando && error && (
        <div
          className="alert alert-danger contenido-principal__error"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill" />

          <div>
            <strong>No se pudo cargar la información</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!cargando && !error && (
        <div className="contenido-principal__contenido">
          {children}
        </div>
      )}
    </main>
  );
}