const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function obtenerPacientes() {
  const url = `${BACKEND_URL}/pacientes`;

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