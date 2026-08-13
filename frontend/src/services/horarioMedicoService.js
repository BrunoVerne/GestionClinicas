const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

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
      data?.error ||
        mensajePorDefecto,
    );

    error.status = response.status;
    error.errores =
      data?.errores || null;

    throw error;
  }

  return data;
}

export async function obtenerHorariosMedico(
  legajo,
) {
  const response = await fetch(
    `${BACKEND_URL}/horarios-medicos/${legajo}`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    response,
    'No se pudieron obtener los horarios del médico',
  );
}

export async function guardarHorariosMedico(
  legajo,
  horarios,
) {
  const response = await fetch(
    `${BACKEND_URL}/horarios-medicos/${legajo}`,
    {
      method: 'PUT',

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        horarios,
      }),
    },
  );

  return procesarRespuesta(
    response,
    'No se pudieron guardar los horarios del médico',
  );
}