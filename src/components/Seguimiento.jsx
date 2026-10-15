import { ESTADOS } from '../data/estados'

const PASOS = ['pendiente', 'preparando', 'entregada']

const MENSAJES = {
  pendiente: 'Tu pedido llegó a almacén y está en espera.',
  preparando: 'Almacén está preparando tu material.',
  entregada: 'Tu material ya fue entregado.',
}

export default function Seguimiento({ orden, onNuevo }) {
  // Si la orden todavía no aparece en la lista (recarga en camino), mostramos "pendiente"
  const estado = orden?.estado ?? 'pendiente'
  const actual = PASOS.indexOf(estado)

  return (
    <div className="card">
      <h2>Tu pedido</h2>
      {orden && (
        <div className="muted" style={{ marginBottom: 16 }}>
          {orden.id} · {orden.cantidad} {orden.unidad} de {orden.nombre} · {orden.zona}
        </div>
      )}

      <ol className="pasos">
        {PASOS.map((p, i) => (
          <li
            key={p}
            className={i < actual ? 'hecho' : i === actual ? 'actual' : ''}
            style={{ '--c': ESTADOS[p].color }}
          >
            <span className="punto">{i < actual ? '✓' : i + 1}</span>
            <span>{ESTADOS[p].texto}</span>
          </li>
        ))}
      </ol>

      <p className={`seg-msg ${estado === 'entregada' ? 'ok' : ''}`}>{MENSAJES[estado]}</p>

      <button className="btn" style={{ width: '100%' }} onClick={onNuevo}>
        {estado === 'entregada' ? 'Hacer otro pedido' : 'Hacer otro pedido mientras tanto'}
      </button>
    </div>
  )
}