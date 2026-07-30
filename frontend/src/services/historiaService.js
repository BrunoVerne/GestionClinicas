export async function getHistoriaByDni(dni) {
  try {
    const response = await fetch(`http://localhost:3001/historias/${dni}`);
    
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