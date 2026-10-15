import { ESTADOS, SIGUIENTE } from '../data/estados'
import { useApp } from '../context/AppContext'

export default function OrdenCard({ orden, nueva }) {
  const { cambiarEstado } = useApp()
  const accion = SIGUIENTE[orden.estado]

  return (
    <div className={`orden ${nueva ? 'nueva' : ''}`} style={{ '--c': ESTADOS[orden.estado].color }}>
      <div className="orden-cab">
        <div className="ico ico-chico">{orden.icono}</div>
        <div>
          <b>{orden.codigo}</b>
          <br />
          <small className="muted">
            {orden.cantidad} {orden.unidad} · {orden.nombre}
          </small>
        </div>
      </div>

      <small className="muted">
        Recoger en {orden.zona} · {orden.linea} · Oracle {orden.oracle}
      </small>

      {orden.urgente && <span className="urgente">Urgente: línea detenida</span>}

      {accion && (
        <button className="btn" onClick={() => cambiarEstado(orden.id, accion.a)}>
          {accion.texto}
        </button>
      )}
    </div>
  )
}