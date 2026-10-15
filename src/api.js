const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

async function pedir(ruta, opciones) {
  const r = await fetch(BASE + ruta, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  })
  const datos = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(datos.error || 'Error del servidor')
  return datos
}

export const getMaterial = (codigo) => pedir('/materiales/' + encodeURIComponent(codigo))
export const getOrdenes = () => pedir('/ordenes')
export const postOrden = (datos) => pedir('/ordenes', { method: 'POST', body: JSON.stringify(datos) })
export const patchEstado = (id, estado) =>
  pedir('/ordenes/' + id, { method: 'PATCH', body: JSON.stringify({ estado }) })