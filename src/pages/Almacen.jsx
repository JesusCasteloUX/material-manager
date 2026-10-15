import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { ESTADOS } from '../data/estados'
import OrdenCard from '../components/OrdenCard'

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    osc.frequency.value = 880
    osc.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  } catch {
    // Algunos navegadores bloquean el audio hasta el primer toque
  }
}

export default function Almacen() {
  const { ordenes, cargando, errorRed } = useApp()
  const vistas = useRef(null)          // ids que ya conocíamos
  const [nuevas, setNuevas] = useState([])

  const pendientes = ordenes.filter((o) => o.estado === 'pendiente').length

  // Detectar órdenes nuevas entre una recarga y la siguiente
  useEffect(() => {
    if (cargando) return
    const ids = ordenes.map((o) => o.id)
    if (vistas.current) {
      const llegaron = ids.filter((id) => !vistas.current.includes(id))
      if (llegaron.length) {
        beep()
        setNuevas((n) => [...n, ...llegaron])
        setTimeout(() => setNuevas((n) => n.filter((id) => !llegaron.includes(id))), 8000)
      }
    }
    vistas.current = ids
  }, [ordenes, cargando])

  // Contador de pendientes en el título de la pestaña
  useEffect(() => {
    document.title = pendientes ? `(${pendientes}) Almacén` : 'Almacén'
    return () => { document.title = 'Panel de Control' }
  }, [pendientes])

  if (cargando) return <p>Cargando…</p>
  if (errorRed && ordenes.length === 0) return <p className="error">{errorRed}</p>

  return (
    <div className="tablero">
      {Object.entries(ESTADOS).map(([clave, { texto }]) => {
        const delEstado = ordenes.filter((o) => o.estado === clave)
        return (
          <section className="columna" key={clave}>
            <h3>{texto} ({delEstado.length})</h3>
            {delEstado.length === 0 && <small className="muted">Sin órdenes</small>}
            {delEstado.map((o) => (
              <OrdenCard key={o.id} orden={o} nueva={nuevas.includes(o.id)} />
            ))}
          </section>
        )
      })}
    </div>
  )
}