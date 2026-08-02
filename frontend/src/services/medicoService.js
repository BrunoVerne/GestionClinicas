const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function obtenerMedicos() {
  const url = `${API_URL}/medicos`;

  console.log('GET médicos:', url);

  const response = await fetch(url, {
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    const texto = await response.text();

    console.error('Respuesta no JSON de médicos:', {
      url,
      status: response.status,
      contentType,
      texto,
    });

    throw new Error(`Médicos devolvió contenido no JSON: ${response.status}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'No se pudieron obtener los médicos');
  }

  return data;
}