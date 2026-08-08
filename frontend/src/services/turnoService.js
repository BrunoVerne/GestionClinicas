const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

async function procesarRespuesta(
  response,
  mensajePorDefecto,
) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.error || mensajePorDefecto,
    );

    error.status = response.status;
    error.errores = data?.errores || null;

    throw error;
  }

  return data;
}

export async function obtenerTurnos() {
  const response = await fetch(
    `${BACKEND_URL}/turnos`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    response,
    'Error al obtener los turnos',
  );
}

export async function obtenerTurnoPorNumero(
  numeroTurno,
) {
  const response = await fetch(
    `${BACKEND_URL}/turnos/${numeroTurno}`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    response,
    'Error al obtener el turno',
  );
}

export async function crearTurno(datos) {
  const response = await fetch(
    `${BACKEND_URL}/turnos`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      credentials: 'include',

      body: JSON.stringify(datos),
    },
  );

  return procesarRespuesta(
    response,
    'Error al crear el turno',
  );
}

export async function actualizarTurno(
  numeroTurno,
  datos,
) {
  const response = await fetch(
    `${BACKEND_URL}/turnos/${numeroTurno}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      credentials: 'include',

      body: JSON.stringify(datos),
    },
  );

  return procesarRespuesta(
    response,
    'Error al actualizar el turno',
  );
}

export async function cancelarTurno(
  numeroTurno,
) {
  const response = await fetch(
    `${BACKEND_URL}/turnos/${numeroTurno}/cancelar`,
    {
      method: 'PATCH',
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    response,
    'Error al cancelar el turno',
  );
}

export async function obtenerMedicosDisponibles({
  especialidad,
  fechaInicio,
  fechaFin,
}) {
  const parametros = new URLSearchParams({
    especialidad,
    fechaInicio,
    fechaFin,
  });

  const response = await fetch(
    `${BACKEND_URL}/agenda/disponibilidad?${parametros.toString()}`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    response,
    'Error al consultar la disponibilidad de médicos',
  );
}