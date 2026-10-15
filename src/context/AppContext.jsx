import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getOrdenes, postOrden, patchEstado } from '../api'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorRed, setErrorRed] = useState('')

  const recargar = useCallback(async () => {
    try {
      setOrdenes(await getOrdenes())
      setErrorRed('')
    } catch {
      setErrorRed('No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
    const t = setInterval(recargar, 3000)
    return () => clearInterval(t)
  }, [recargar])

  // Lanza un error con el mensaje del servidor si algo no es válido
  async function crearOrden(datos) {
    const { id } = await postOrden(datos)
    await recargar()
    return id
  }

  async function cambiarEstado(id, estado) {
    await patchEstado(id, estado)
    await recargar()
  }

  return (
    <AppContext.Provider value={{ ordenes, cargando, errorRed, crearOrden, cambiarEstado }}>
      {children}
    </AppContext.Provider>
  )
}