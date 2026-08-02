const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function obtenerPacientes() {
  const url = `${API_URL}/pacientes`;

  console.log('GET pacientes:', url);

  const response = await fetch(url, {
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    const texto = await response.text();

    console.error('Respuesta no JSON de pacientes:', {
      url,
      status: response.status,
      contentType,
      texto,
    });

    throw new Error(`Pacientes devolvió contenido no JSON: ${response.status}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'No se pudieron obtener los pacientes');
  }

  return data;
}


export async function actualizarPaciente(dni, datos) {
  const respuesta = await fetch(`${API_URL}/pacientes/${dni}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });

  const contenido = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje =
      contenido?.error ??
      'No se pudieron actualizar los datos del paciente';

    const error = new Error(mensaje);
    error.errores = contenido?.errores ?? {};
    throw error;
  }

  return contenido;
}