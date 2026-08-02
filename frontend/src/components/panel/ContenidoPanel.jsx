export default function ContenidoPanel({
  cargando,
  error,
  children,
}) {
  return (
    <main className="contenido-principal container py-4">
      {cargando && (
        <div className="estado-carga">
          <div
            className="spinner-border text-primary"
            role="status"
          />

          <p>Cargando información clínica...</p>
        </div>
      )}

      {!cargando && error && (
        <div className="alert alert-danger shadow-sm">
          <i className="bi bi-exclamation-triangle me-2" />
          {error}
        </div>
      )}

      {!cargando && !error && children}
    </main>
  );
}