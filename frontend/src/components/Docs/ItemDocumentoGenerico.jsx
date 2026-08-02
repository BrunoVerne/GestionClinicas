import '../../styles/itemDocumento.css';
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function DocumentoItem({ documento }) {
  const fecha = new Date(
    documento.fecha,
  ).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="item-documento">
      <div className="item-documento__icono">
        <i className="bi bi-file-earmark-text" />
      </div>

      <div className="item-documento__informacion">
        <div className="item-documento__encabezado">
          <span className="item-documento__tipo">
            {documento.tipo}
          </span>

        </div>

        <div className="item-documento__fecha">
          <i className="bi bi-calendar3" />
          <span>{fecha}</span>
        </div>
      </div>

      <a
        href={`${API_URL}${documento.archivo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline-secondary btn-sm item-documento__boton"
        aria-label={`Abrir documento ${documento.numeroDocumento}`}
        title="Abrir documento"
      >
        <i className="bi bi-box-arrow-up-right" />
        <span>Abrir</span>
      </a>
    </article>
  );
}
