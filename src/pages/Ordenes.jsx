import { useApp } from '../context/AppContext'
import { ESTADOS } from '../data/estados'
import { formatearFecha } from '../utils/fecha'

export default function Ordenes() {
  const { ordenes, cargando, errorRed } = useApp()

  if (cargando) return <p>Cargando…</p>
  if (errorRed && ordenes.length === 0) return <p className="error">{errorRed}</p>

  return (
    <div className="card wide">
      <h2>Órdenes</h2>
      <div className="muted" style={{ marginBottom: 12 }}>
        Todas las órdenes de la línea
      </div>

      <div className="tabla-scroll">
        <table>
          <thead>
            <tr>
              <th>Orden</th>
              <th>Oracle</th>
              <th>Material</th>
              <th>Ubicación</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o) => (
              <tr key={o.id}>
                <td data-label="Orden" className="orden-id">#{o.id}</td>
                <td data-label="Oracle">{o.oracle}</td>
                <td data-label="Material">{o.nombre}</td>
                <td data-label="Ubicación">{o.zona}</td>
                <td data-label="Cantidad">
                  <b>{o.cantidad} {o.unidad}</b>
                </td>
                <td data-label="Estado">
                  <span className="pill" style={{ color: ESTADOS[o.estado].color }}>
                    {ESTADOS[o.estado].texto.toLowerCase()}
                  </span>
                </td>
                <td data-label="Fecha">{formatearFecha(o.fecha)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}