const API_URL = import.meta.env.VITE_BACKEND_URL;

async function procesarRespuesta(response, mensajePorDefecto) {
  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    const texto = await response.text();

    console.error('Respuesta no JSON:', {
      url: response.url,
      status: response.status,
      contentType,
      texto,
    });

    throw new Error(
      `El servidor devolvió contenido no JSON: ${response.status}`,
    );
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error || mensajePorDefecto,
    );

    error.errores = data.errores;
    error.status = response.status;

    throw error;
  }

  return data;
}

export async function obtenerMedicos() {
  const response = await fetch(`${API_URL}/medicos`, {
    credentials: 'include',
  });

  return procesarRespuesta(
    response,
    'No se pudieron obtener los médicos',
  );
}

export async function obtenerMedicoPorLegajo(legajo) {
  const response = await fetch(
    `${API_URL}/medicos/${legajo}`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    response,
    'No se pudo obtener el médico',
  );
}

export async function crearMedico(datosMedico) {
  const response = await fetch(`${API_URL}/medicos`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    credentials: 'include',

    body: JSON.stringify(datosMedico),
  });

  return procesarRespuesta(
    response,
    'No se pudo crear el médico',
  );
}

export async function actualizarMedico(
  legajo,
  datosMedico,
) {
  const response = await fetch(
    `${API_URL}/medicos/${legajo}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      credentials: 'include',

      body: JSON.stringify(datosMedico),
    },
  );

  return procesarRespuesta(
    response,
    'No se pudo actualizar el médico',
  );
}

export async function obtenerEspecialidades() {
  const response = await fetch(
    `${API_URL}/catalogos/especialidades`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    response,
    'No se pudieron obtener las especialidades',
  );
}

export async function obtenerGeneros() {
  const response = await fetch(
    `${API_URL}/catalogos/generos`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    response,
    'No se pudieron obtener los géneros',
  );
}

export async function obtenerCatalogosMedico() {
  const [generos, especialidades] =
    await Promise.all([
      obtenerGeneros(),
      obtenerEspecialidades(),
    ]);

  return {
    generos,
    especialidades,
  };
}