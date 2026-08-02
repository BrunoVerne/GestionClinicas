const API_URL = import.meta.env.VITE_BACKEND_URL;


export async function getHistoriaByDni(dni) {
  try {
    const response = await fetch(`${API_URL}/historias/${dni}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;  // No existe historia
      }
      throw new Error('Error al obtener la historia clínica');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getHistoriaByDni:', error);
    throw error;
  }
}