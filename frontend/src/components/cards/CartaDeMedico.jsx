import '../../styles/cards/cartaDeMedico.css';

function formatearEtiqueta(valor) {
  if (!valor) {
    return 'No especificado';
  }

  return valor
    .toLowerCase()
    .split('_')
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() +
        palabra.slice(1),
    )
    .join(' ');
}

function formatearFecha(fecha) {
  if (!fecha) {
    return null;
  }

  return new Intl.DateTimeFormat('es-AR').format(
    new Date(fecha),
  );
}

export default function CartaDeMedico({medico,onVerMedico}) {
  const especialidades =
    medico.especialidades?.map(
      (relacion) => relacion.especialidad,
    ) || [];

  return (
    <article
      className={`carta-medico ${
        medico.activo
          ? 'carta-medico--activo'
          : 'carta-medico--inactivo'
      }`}
    >
      <header className="carta-medico__encabezado">
        <div className="carta-medico__identidad">
          <div className="carta-medico__avatar">
            <i className="bi bi-person-badge-fill" />
          </div>

          <div>
            <span className="carta-medico__etiqueta">
              Profesional
            </span>

            <h2 className="carta-medico__nombre">
              Dr/a. {medico.nombre}
            </h2>
          </div>
        </div>

        <span className="carta-medico__estado">
          <span className="carta-medico__estado-punto" />
          {medico.activo ? 'Activo' : 'Inactivo'}
        </span>
      </header>

      <div className="carta-medico__contenido">
        <section className="carta-medico__resumen">
          <div>
            <span className="carta-medico__campo-etiqueta">
              Matrícula
            </span>

            <p className="carta-medico__matricula">
              {medico.matricula}
            </p>
          </div>

          <div>
            <span className="carta-medico__campo-etiqueta">
              Especialidades
            </span>

            {especialidades.length > 0 ? (
              <div className="carta-medico__especialidades">
                {especialidades.map(
                  (especialidad) => (
                    <span
                      className="carta-medico__especialidad"
                      key={especialidad}
                    >
                      {formatearEtiqueta(
                        especialidad,
                      )}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="carta-medico__sin-datos">
                Sin especialidades registradas
              </p>
            )}
          </div>
        </section>

        <section className="carta-medico__datos">
          {medico.telefono && (
            <DatoMedico
              icono="bi-telephone"
              etiqueta="Teléfono"
              valor={medico.telefono}
            />
          )}

          {medico.telefonoDeEmergencia && (
            <DatoMedico
              icono="bi-telephone-plus"
              etiqueta="Teléfono de emergencia"
              valor={medico.telefonoDeEmergencia}
              tipo="emergencia"
            />
          )}

          {medico.email && (
            <DatoMedico
              icono="bi-envelope"
              etiqueta="Email"
              valor={medico.email}
              ajustarTexto
            />
          )}

          {medico.fechaDeNacimiento && (
            <DatoMedico
              icono="bi-calendar3"
              etiqueta="Fecha de nacimiento"
              valor={formatearFecha(
                medico.fechaDeNacimiento,
              )}
            />
          )}

          {medico.genero && (
            <DatoMedico
              icono="bi-person"
              etiqueta="Género"
              valor={formatearEtiqueta(
                medico.genero,
              )}
            />
          )}

          {medico.domicilio && (
            <DatoMedico
              icono="bi-geo-alt"
              etiqueta="Domicilio"
              valor={medico.domicilio}
            />
          )}
        </section>
      </div>
      <footer className="carta-medico__acciones">
  <button
    type="button"
    className="btn btn-outline-primary btn-sm"
    onClick={onVerMedico}
  >
    <i className="bi bi-person-lines-fill me-2" />
    Ver profesional
  </button>
</footer>
    </article>
  );
}

function DatoMedico({
  icono,
  etiqueta,
  valor,
  tipo,
  ajustarTexto = false,
}) {
  return (
    <div className="carta-medico__dato">
      <div
        className={`carta-medico__dato-icono ${
          tipo === 'emergencia'
            ? 'carta-medico__dato-icono--emergencia'
            : ''
        }`}
      >
        <i className={`bi ${icono}`} />
      </div>

      <div className="carta-medico__dato-contenido">
        <span className="carta-medico__campo-etiqueta">
          {etiqueta}
        </span>

        <span
          className={
            ajustarTexto
              ? 'carta-medico__dato-valor carta-medico__dato-valor--ajustable'
              : 'carta-medico__dato-valor'
          }
        >
          {valor}
        </span>
      </div>
    </div>
  );
}