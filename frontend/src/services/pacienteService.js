const API_URL = import.meta.env.VITE_BACKEND_URL;

async function procesarRespuesta(
  respuesta,
  mensajePredeterminado,
) {
  const tipoContenido =
    respuesta.headers.get('content-type') || '';

  let contenido = null;

  if (tipoContenido.includes('application/json')) {
    contenido = await respuesta.json();
  } else {
    const texto = await respuesta.text();

    console.error('Respuesta no JSON:', {
      url: respuesta.url,
      status: respuesta.status,
      tipoContenido,
      texto,
    });
  }

  if (!respuesta.ok) {
    const error = new Error(
      contenido?.error || mensajePredeterminado,
    );

    error.errores = contenido?.errores || {};

    throw error;
  }

  return contenido;
}

export async function crearPaciente(datosPaciente) {
  const respuesta = await fetch(
    `${API_URL}/pacientes`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosPaciente),
    },
  );

  return procesarRespuesta(
    respuesta,
    'No se pudo crear el paciente',
  );
}

export async function obtenerPacientes() {
  const respuesta = await fetch(
    `${API_URL}/pacientes`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    respuesta,
    'No se pudieron obtener los pacientes',
  );
}

export async function obtenerPacientePorDni(dni) {
  const respuesta = await fetch(
    `${API_URL}/pacientes/${dni}`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    respuesta,
    'No se pudo obtener el paciente',
  );
}

export async function actualizarPaciente(
  dni,
  datosPaciente,
) {
  const respuesta = await fetch(
    `${API_URL}/pacientes/${dni}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosPaciente),
    },
  );

  return procesarRespuesta(
    respuesta,
    'No se pudieron actualizar los datos del paciente',
  );
}

export async function obtenerGeneros() {
  const respuesta = await fetch(
    `${API_URL}/catalogos/generos`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    respuesta,
    'No se pudieron obtener los géneros',
  );
}

export async function obtenerObrasSociales() {
  const respuesta = await fetch(
    `${API_URL}/catalogos/obras-sociales`,
    {
      credentials: 'include',
    },
  );

  return procesarRespuesta(
    respuesta,
    'No se pudieron obtener las obras sociales',
  );
}

export async function obtenerCatalogosPaciente() {
  const [generos, obrasSociales] =
    await Promise.all([
      obtenerGeneros(),
      obtenerObrasSociales(),
    ]);

  return {
    generos,
    obrasSociales,
  };
}

