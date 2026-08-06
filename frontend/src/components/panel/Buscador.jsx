import '../../styles/panel/buscador.css';

export default function Buscador({
  valor,
  onChange,
  placeholder = 'Buscar...',
  cantidadResultados,
}) {
  function limpiarBusqueda() {
    onChange('');
  }

  return (
    <div className="buscador">
      <div className="buscador__campo">
        <i className="bi bi-search buscador__icono" />

        <input
          type="search"
          className="buscador__input"
          value={valor}
          onChange={(evento) =>
            onChange(evento.target.value)
          }
          placeholder={placeholder}
          aria-label={placeholder}
        />

        {valor && (
          <button
            type="button"
            className="buscador__limpiar"
            onClick={limpiarBusqueda}
            aria-label="Limpiar búsqueda"
          >
            <i className="bi bi-x-lg" />
          </button>
        )}
      </div>

      {valor && typeof cantidadResultados === 'number' && (
        <span className="buscador__resultados">
          {cantidadResultados === 1
            ? '1 resultado'
            : `${cantidadResultados} resultados`}
        </span>
      )}
    </div>
  );
}