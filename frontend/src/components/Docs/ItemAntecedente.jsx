import { useState } from 'react';

import {
  eliminarAntecedente,
} from '../../services/antecedenteService';

import '../../styles/itemAntecedente.css';

export default function ItemAntecedente({
  antecedente,
  onAntecedenteEliminado,
}) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState('');

  const borrarAntecedente = async () => {
    const confirmado = window.confirm(
      '¿Seguro que querés eliminar este antecedente?',
    );

    if (!confirmado) {
      return;
    }

    setEliminando(true);
    setError('');

    try {
      await eliminarAntecedente(antecedente.id);

      onAntecedenteEliminado?.(antecedente.id);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo eliminar el antecedente',
      );
    } finally {
      setEliminando(false);
    }
  };

  return (
    <article className="item-antecedente">
      <div className="item-antecedente__contenido">
        <div className="item-antecedente__informacion">
          <div className="item-antecedente__icono">
            <i className="bi bi-clock-history" />
          </div>

          <div className="item-antecedente__detalle">
            <span className="item-antecedente__tipo">
              {antecedente.tipo}
            </span>

            <p className="item-antecedente__descripcion">
              {antecedente.descripcion}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="item-antecedente__boton-eliminar"
          disabled={eliminando}
          onClick={borrarAntecedente}
        >
          {eliminando ? (
            <>
              <span
                className="item-antecedente__spinner"
                aria-hidden="true"
              />
              Eliminando...
            </>
          ) : (
            <>
              <i className="bi bi-trash" />
              Eliminar
            </>
          )}
        </button>
      </div>

      {error && (
        <div
          className="item-antecedente__error"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle" />
          <span>{error}</span>
        </div>
      )}
    </article>
  );
}
