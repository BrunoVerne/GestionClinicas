import { useEffect, useState } from 'react';

import { obtenerPacientes } from '../services/pacienteService';
import { obtenerMedicos } from '../services/medicoService';

export default function useDatosClinica() {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorDatos, setErrorDatos] = useState('');

  const cargarDatos = async () => {
    setCargandoDatos(true);
    setErrorDatos('');

    try {
      const [
        pacientesObtenidos,
        medicosObtenidos,
      ] = await Promise.all([
        obtenerPacientes(),
        obtenerMedicos(),
      ]);

      setPacientes(pacientesObtenidos);
      setMedicos(medicosObtenidos);
    } catch (error) {
      console.error('Error cargando datos:', error);

      setErrorDatos(
        error.message || 'No se pudieron cargar los datos',
      );
    } finally {
      setCargandoDatos(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    pacientes,
    setPacientes,
    medicos,
    setMedicos,
    cargandoDatos,
    errorDatos,
    recargarDatos: cargarDatos,
  };
}