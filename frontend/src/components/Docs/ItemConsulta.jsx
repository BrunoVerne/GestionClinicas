import '../../styles/itemConsulta.css';

export default function ItemConsulta({ consulta }) {
  const fecha = new Date(consulta.fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const nombreMedico =
    consulta.medico?.nombre || 'Médico no disponible';

  return (
    <article className="item-consulta">
      <header className="item-consulta-encabezado">
        <div className="item-consulta-titulo">
          <i className="bi bi-calendar2-check" />

          <h3>{consulta.motivo}</h3>
        </div>

        <time
          className="item-consulta-fecha"
          dateTime={consulta.fecha}
        >
          {fecha}
        </time>
      </header>

      <div className="item-consulta-contenido">
        <section className="item-consulta-seccion">
          <span className="item-consulta-etiqueta">
            Diagnóstico
          </span>

          <p>{consulta.diagnostico}</p>
        </section>

        {consulta.observaciones && (
          <section className="item-consulta-observaciones">
            <span className="item-consulta-etiqueta">
              Observaciones
            </span>

            <p>{consulta.observaciones}</p>
          </section>
        )}
      </div>

      <footer className="item-consulta-medico">
        <div className="item-consulta-medico-icono">
          <i className="bi bi-person-badge" />
        </div>

        <div>
          <span>Profesional responsable</span>
          <strong>{nombreMedico}</strong>
        </div>
      </footer>
    </article>
  );
}