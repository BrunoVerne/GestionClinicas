import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  guardarHorariosMedico,
  obtenerHorariosMedico,
} from '../../services/horarioMedicoService';

import '../../styles/agenda/grillaHorarioMedico.css';

const DIAS = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO',
];

const ETIQUETAS_DIAS = {
  LUNES: 'Lun',
  MARTES: 'Mar',
  MIERCOLES: 'Mié',
  JUEVES: 'Jue',
  VIERNES: 'Vie',
  SABADO: 'Sáb',
  DOMINGO: 'Dom',
};

const HORA_INICIO_GRILLA = 7;
const HORA_FIN_GRILLA = 22;

export default function GrillaHorarioMedico({
  legajoMedico,
}) {
  const [bloquesSeleccionados, setBloquesSeleccionados] =
    useState(new Set());

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState('');

  const [mensaje, setMensaje] =
    useState('');

  const horas = useMemo(() => {
    const resultado = [];

    for (
      let hora = HORA_INICIO_GRILLA;
      hora < HORA_FIN_GRILLA;
      hora++
    ) {
      resultado.push(hora);
    }

    return resultado;
  }, []);

  useEffect(() => {
    cargarHorarios();
  }, [legajoMedico]);

  async function cargarHorarios() {
    try {
      setCargando(true);
      setError('');
      setMensaje('');

      const horarios =
        await obtenerHorariosMedico(
          legajoMedico,
        );

      const bloques =
        convertirHorariosABloques(
          horarios,
        );

      setBloquesSeleccionados(
        bloques,
      );
    } catch (error) {
      console.error(
        'Error cargando horarios:',
        error,
      );

      setError(
        error.message ||
          'No se pudieron cargar los horarios',
      );
    } finally {
      setCargando(false);
    }
  }

  function alternarBloque(
    dia,
    hora,
  ) {
    const clave = crearClave(
      dia,
      hora,
    );

    setBloquesSeleccionados(
      (actuales) => {
        const nuevos =
          new Set(actuales);

        if (nuevos.has(clave)) {
          nuevos.delete(clave);
        } else {
          nuevos.add(clave);
        }

        return nuevos;
      },
    );

    setMensaje('');
  }

  function seleccionarDiaCompleto(
    dia,
  ) {
    setBloquesSeleccionados(
      (actuales) => {
        const nuevos =
          new Set(actuales);

        const clavesDia =
          horas.map((hora) =>
            crearClave(
              dia,
              hora,
            ),
          );

        const todosSeleccionados =
          clavesDia.every((clave) =>
            nuevos.has(clave),
          );

        for (
          const clave of clavesDia
        ) {
          if (
            todosSeleccionados
          ) {
            nuevos.delete(clave);
          } else {
            nuevos.add(clave);
          }
        }

        return nuevos;
      },
    );

    setMensaje('');
  }

  async function guardar() {
    try {
      setGuardando(true);
      setError('');
      setMensaje('');

      const horarios =
        convertirBloquesAHorarios(
          bloquesSeleccionados,
        );

      await guardarHorariosMedico(
        legajoMedico,
        horarios,
      );

      setMensaje(
        'Horarios guardados correctamente',
      );
    } catch (error) {
      console.error(
        'Error guardando horarios:',
        error,
      );

      setError(
        error.message ||
          'No se pudieron guardar los horarios',
      );
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="grilla-horario__cargando">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Cargando...
          </span>
        </div>

        <span>
          Cargando disponibilidad...
        </span>
      </div>
    );
  }

  return (
    <section className="grilla-horario">
      <header className="grilla-horario__encabezado">
        <div>
          <span className="grilla-horario__etiqueta">
            Agenda semanal
          </span>

          <h2 className="grilla-horario__titulo">
            Disponibilidad del médico
          </h2>

          <p className="grilla-horario__descripcion">
            Seleccioná los bloques horarios
            en los que el médico puede atender.
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

      {mensaje && (
        <div
          className="alert alert-success"
          role="alert"
        >
          {mensaje}
        </div>
      )}

      <div className="grilla-horario__contenedor">
        <div className="grilla-horario__tabla">
          <div className="grilla-horario__esquina">
            Hora
          </div>

          {DIAS.map((dia) => (
            <button
              key={dia}
              type="button"
              className="grilla-horario__dia"
              onClick={() =>
                seleccionarDiaCompleto(
                  dia,
                )
              }
              title="Seleccionar o quitar todo el día"
            >
              {
                ETIQUETAS_DIAS[
                  dia
                ]
              }
            </button>
          ))}

          {horas.map((hora) => (
            <FilaHorario
              key={hora}
              hora={hora}
              bloquesSeleccionados={
                bloquesSeleccionados
              }
              onAlternar={
                alternarBloque
              }
            />
          ))}
        </div>
      </div>

      <div className="grilla-horario__leyenda">
        <div>
          <span className="grilla-horario__muestra grilla-horario__muestra--disponible" />
          Disponible
        </div>

        <div>
          <span className="grilla-horario__muestra" />
          No disponible
        </div>
      </div>

      <footer className="grilla-horario__acciones">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={cargarHorarios}
          disabled={guardando}
        >
          <i className="bi bi-arrow-counterclockwise me-2" />
          Descartar cambios
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={guardar}
          disabled={guardando}
        >
          {guardando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-2" />
              Guardar horarios
            </>
          )}
        </button>
      </footer>
    </section>
  );
}

function FilaHorario({
  hora,
  bloquesSeleccionados,
  onAlternar,
}) {
  return (
    <>
      <div className="grilla-horario__hora">
        {formatearHora(hora)}
      </div>

      {DIAS.map((dia) => {
        const clave =
          crearClave(
            dia,
            hora,
          );

        const seleccionado =
          bloquesSeleccionados.has(
            clave,
          );

        return (
          <button
            key={clave}
            type="button"
            className={`grilla-horario__bloque ${
              seleccionado
                ? 'grilla-horario__bloque--seleccionado'
                : ''
            }`}
            onClick={() =>
              onAlternar(
                dia,
                hora,
              )
            }
            aria-pressed={
              seleccionado
            }
            title={`${dia} ${formatearHora(
              hora,
            )} - ${formatearHora(
              hora + 1,
            )}`}
          >
            {seleccionado && (
              <i className="bi bi-check-lg" />
            )}
          </button>
        );
      })}
    </>
  );
}

function crearClave(
  dia,
  hora,
) {
  return `${dia}-${hora}`;
}

function formatearHora(
  hora,
) {
  return `${String(
    hora,
  ).padStart(2, '0')}:00`;
}

function obtenerHoraDesdeFecha(
  fecha,
) {
  const valor =
    typeof fecha === 'string'
      ? fecha
      : new Date(
          fecha,
        ).toISOString();

  return Number(
    valor.slice(11, 13),
  );
}

function convertirHorariosABloques(
  horarios,
) {
  const bloques =
    new Set();

  for (
    const horario of horarios
  ) {
    const inicio =
      obtenerHoraDesdeFecha(
        horario.horaInicio,
      );

    const fin =
      obtenerHoraDesdeFecha(
        horario.horaFin,
      );

    for (
      let hora = inicio;
      hora < fin;
      hora++
    ) {
      if (
        hora >=
          HORA_INICIO_GRILLA &&
        hora <
          HORA_FIN_GRILLA
      ) {
        bloques.add(
          crearClave(
            horario.diaSemana,
            hora,
          ),
        );
      }
    }
  }

  return bloques;
}

function convertirBloquesAHorarios(
  bloques,
) {
  const horarios = [];

  for (
    const dia of DIAS
  ) {
    const horasSeleccionadas =
      [];

    for (
      let hora =
        HORA_INICIO_GRILLA;
      hora <
      HORA_FIN_GRILLA;
      hora++
    ) {
      if (
        bloques.has(
          crearClave(
            dia,
            hora,
          ),
        )
      ) {
        horasSeleccionadas.push(
          hora,
        );
      }
    }

    if (
      horasSeleccionadas.length ===
      0
    ) {
      continue;
    }

    let inicio =
      horasSeleccionadas[0];

    let anterior =
      horasSeleccionadas[0];

    for (
      let i = 1;
      i <
      horasSeleccionadas.length;
      i++
    ) {
      const actual =
        horasSeleccionadas[i];

      if (
        actual ===
        anterior + 1
      ) {
        anterior = actual;
        continue;
      }

      horarios.push({
        diaSemana: dia,

        horaInicio:
          formatearHora(
            inicio,
          ),

        horaFin:
          formatearHora(
            anterior + 1,
          ),
      });

      inicio = actual;
      anterior = actual;
    }

    horarios.push({
      diaSemana: dia,

      horaInicio:
        formatearHora(
          inicio,
        ),

      horaFin:
        formatearHora(
          anterior + 1,
        ),
    });
  }

  return horarios;
}