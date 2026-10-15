import { useState } from 'react'
import { LINEAS } from '../data/catalogo'
import { useApp } from '../context/AppContext'
import { getMaterial } from '../api'
import Seguimiento from '../components/Seguimiento'

export default function SolicitarMaterial() {
  const { ordenes ,crearOrden } = useApp()

  const [linea, setLinea] = useState(LINEAS[0])
  const [oracle, setOracle] = useState('')
  const [codigo, setCodigo] = useState('')
  const [material, setMaterial] = useState(null)
  const [zona, setZona] = useState(null)
  const [cantidad, setCantidad] = useState(100)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [seguimiento, setSeguimiento] = useState(null)

  async function buscar(texto = codigo) {
    const c = texto.trim().toUpperCase()
    if (!c) return
    try {
      setMaterial(await getMaterial(c))
      setError('')
    } catch (e) {
      setMaterial(null)
      setError(e.message)
    }
  }

  function elegirUbicacion(u) {
    if (u.cantidad === 0) return
    setZona(u.zona)
    setError('')
  }

  async function enviar() {
    if (!oracle) return setError('Escribe tu número Oracle')
    if (!zona) return setError('Selecciona una ubicación')

    setEnviando(true)
    try {
      const id = await crearOrden({ linea, oracle, codigo: material.codigo, zona, cantidad })
      setCodigo('')
      setMaterial(null)
      setZona(null)
      setCantidad(100)
      setError('')
      setSeguimiento(id)
    } catch (e) {
      setError(e.message)
      buscar(material.codigo) // refresca las cantidades disponibles
    } finally {
      setEnviando(false)
    }
  }

  if (seguimiento) {
  return (
    <Seguimiento
      orden={ordenes.find((o) => o.id === seguimiento)}
      onNuevo={() => setSeguimiento(null)}
    />
  )
}

  return (
    <div className="card"> 

      <div className="fila">
        <h2 style={{ flex: 1 }}>Pedido</h2>
        <select style={{ flex: '0 0 130px' }} value={linea} onChange={(e) => setLinea(e.target.value)}>
          {LINEAS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>

      <input
        placeholder="Número Oracle"
        inputMode="numeric"
        value={oracle}
        onChange={(e) => setOracle(e.target.value.replace(/\D/g, ''))}
      />

      <label>Código de material</label>
      <div className="fila">
        <input
          placeholder="Ej. MT-52903"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && buscar()}
        />
        <button className="btn btn-outline fit" onClick={() => buscar()}>Buscar</button>
      </div>

      <div className="error">{error}</div>

      {material && (
        <>
          <label>
            {material.nombre} <small className="muted">{material.codigo}</small>
          </label>

          <div className="imagenes">
            <div className="ico">{material.icono}</div>
            <div className="ico">📦</div>
          </div>

          {material.ubicaciones.map((u) => {
            const seleccionada = u.zona === zona
            const sinStock = u.cantidad === 0
            return (
              <div
                key={u.zona}
                className={`ubicacion ${seleccionada ? 'sel' : ''} ${sinStock ? 'no' : ''}`}
                onClick={() => elegirUbicacion(u)}
              >
                <b>{u.zona}</b>
                <span>
                  {sinStock
                    ? 'No disponible'
                    : `Disponible ${u.cantidad} ${material.unidad} ${seleccionada ? '✓' : ''}`}
                </span>
              </div>
            )
          })}

          <div className="cantidad">
            <button onClick={() => setCantidad((c) => Math.max(1, c - 10))}>−</button>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
            <button onClick={() => setCantidad((c) => c + 10)}>+</button>
            <button className="btn" onClick={enviar} disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}