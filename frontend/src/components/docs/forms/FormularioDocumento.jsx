import {
  useRef,
  useState,
} from 'react';

import {
  crearDocumento,
} from '../../../services/documentoService';

import '../../../styles/forms/formularioDocumento.css';

const TAMANIO_MAXIMO =
  10 * 1024 * 1024;

const TIPOS_PERMITIDOS = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

function obtenerFechaActual() {
  const ahora = new Date();

  const offset =
    ahora.getTimezoneOffset() * 60000;

  return new Date(
    ahora.getTime() - offset,
  )
    .toISOString()
    .slice(0, 16);
}

export default function FormularioDocumento({
  dniPaciente,
  onDocumentoCreado,
  onCancelar,
}) {
  const inputArchivoRef = useRef(null);

  const [archivo, setArchivo] =
    useState(null);

  const [tipo, setTipo] =
    useState('');

  const [fecha, setFecha] =
    useState(obtenerFechaActual());

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState('');

  const [errores, setErrores] =
    useState({});

  function abrirSelectorArchivos() {
    inputArchivoRef.current?.click();
  }

  function seleccionarArchivo(evento) {
    const archivoSeleccionado =
      evento.target.files?.[0];

    setError('');

    if (!archivoSeleccionado) {
      setArchivo(null);
      return;
    }

    if (
      !TIPOS_PERMITIDOS.includes(
        archivoSeleccionado.type,
      )
    ) {
      setArchivo(null);

      setErrores((actuales) => ({
        ...actuales,
        archivo:
          'Solo se permiten archivos PDF, JPG, PNG o WEBP',
      }));

      evento.target.value = '';

      return;
    }

    if (
      archivoSeleccionado.size >
      TAMANIO_MAXIMO
    ) {
      setArchivo(null);

      setErrores((actuales) => ({
        ...actuales,
        archivo:
          'El archivo no puede superar los 10 MB',
      }));

      evento.target.value = '';

      return;
    }

    setArchivo(archivoSeleccionado);

    setErrores((actuales) => ({
      ...actuales,
      archivo: undefined,
    }));
  }

  function eliminarSeleccion() {
    setArchivo(null);

    if (inputArchivoRef.current) {
      inputArchivoRef.current.value = '';
    }
  }

  function validarFormulario() {
    const nuevosErrores = {};

    if (!archivo) {
      nuevosErrores.archivo =
        'Debe seleccionar un archivo';
    }

    if (!tipo.trim()) {
      nuevosErrores.tipo =
        'Debe indicar el tipo de documento';
    }

    if (!fecha) {
      nuevosErrores.fecha =
        'Debe indicar la fecha';
    }

    setErrores(nuevosErrores);

    return (
      Object.keys(nuevosErrores)
        .length === 0
    );
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setGuardando(true);
      setError('');

      const documento =
        await crearDocumento({
          dniPaciente,
          tipo: tipo.trim(),

          fecha: new Date(
            fecha,
          ).toISOString(),

          archivo,
        });

      onDocumentoCreado?.(
        documento,
      );

      setArchivo(null);
      setTipo('');
      setFecha(
        obtenerFechaActual(),
      );

      if (
        inputArchivoRef.current
      ) {
        inputArchivoRef.current.value =
          '';
      }
    } catch (error) {
      console.error(
        'Error subiendo documento:',
        error,
      );

      setError(
        error.message ||
          'No se pudo subir el documento',
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      className="formulario-documento"
      onSubmit={manejarSubmit}
    >
      <header className="formulario-documento__encabezado">
        <div>
          <span className="formulario-documento__etiqueta">
            Historia clínica
          </span>

          <h2 className="formulario-documento__titulo">
            Agregar documento
          </h2>

          <p className="formulario-documento__descripcion">
            Adjuntá estudios,
            informes, imágenes u
            otros archivos relacionados
            con el paciente.
          </p>
        </div>
      </header>

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="formulario-documento__contenido">

        <section className="formulario-documento__seccion">
          <h3 className="formulario-documento__seccion-titulo">
            Archivo
          </h3>

          <input
            ref={inputArchivoRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="formulario-documento__input-archivo"
            onChange={
              seleccionarArchivo
            }
          />

          {!archivo ? (
            <button
              type="button"
              className={`formulario-documento__selector ${
                errores.archivo
                  ? 'formulario-documento__selector--error'
                  : ''
              }`}
              onClick={
                abrirSelectorArchivos
              }
            >
              <span className="formulario-documento__selector-icono">
                <i className="bi bi-cloud-arrow-up" />
              </span>

              <span className="formulario-documento__selector-contenido">
                <strong>
                  Seleccionar archivo
                </strong>

                <span>
                  PDF, JPG, PNG o WEBP
                  · máximo 10 MB
                </span>
              </span>

              <span className="btn btn-outline-primary btn-sm">
                Explorar
              </span>
            </button>
          ) : (
            <div className="formulario-documento__archivo">
              <div className="formulario-documento__archivo-icono">
                <i
                  className={`bi ${
                    archivo.type ===
                    'application/pdf'
                      ? 'bi-file-earmark-pdf'
                      : 'bi-file-earmark-image'
                  }`}
                />
              </div>

              <div className="formulario-documento__archivo-informacion">
                <strong>
                  {archivo.name}
                </strong>

                <span>
                  {formatearTamanio(
                    archivo.size,
                  )}
                </span>
              </div>

              <button
                type="button"
                className="formulario-documento__archivo-eliminar"
                onClick={
                  eliminarSeleccion
                }
                aria-label="Quitar archivo"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
          )}

          {errores.archivo && (
            <div className="formulario-documento__error">
              {errores.archivo}
            </div>
          )}
        </section>

        <section className="formulario-documento__seccion">
          <h3 className="formulario-documento__seccion-titulo">
            Información del documento
          </h3>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label
                htmlFor="tipoDocumento"
                className="form-label"
              >
                Tipo de documento
              </label>

              <input
                id="tipoDocumento"
                type="text"
                className={`form-control ${
                  errores.tipo
                    ? 'is-invalid'
                    : ''
                }`}
                value={tipo}
                onChange={(evento) => {
                  setTipo(
                    evento.target.value,
                  );

                  setErrores(
                    (actuales) => ({
                      ...actuales,
                      tipo: undefined,
                    }),
                  );
                }}
                placeholder="Ej. Estudio de laboratorio"
              />

              {errores.tipo && (
                <div className="invalid-feedback">
                  {errores.tipo}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label
                htmlFor="fechaDocumento"
                className="form-label"
              >
                Fecha
              </label>

              <input
                id="fechaDocumento"
                type="datetime-local"
                className={`form-control ${
                  errores.fecha
                    ? 'is-invalid'
                    : ''
                }`}
                value={fecha}
                onChange={(evento) => {
                  setFecha(
                    evento.target.value,
                  );

                  setErrores(
                    (actuales) => ({
                      ...actuales,
                      fecha: undefined,
                    }),
                  );
                }}
              />

              {errores.fecha && (
                <div className="invalid-feedback">
                  {errores.fecha}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <footer className="formulario-documento__acciones">
        {onCancelar && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancelar}
            disabled={guardando}
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />

              Subiendo...
            </>
          ) : (
            <>
              <i className="bi bi-upload me-2" />
              Subir documento
            </>
          )}
        </button>
      </footer>
    </form>
  );
}

function formatearTamanio(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}