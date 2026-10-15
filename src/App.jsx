  import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import SolicitarMaterial from './pages/SolicitarMaterial'
import Almacen from './pages/Almacen'
import Ordenes from './pages/Ordenes'

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<SolicitarMaterial />} />
          <Route path="/almacen" element={<Almacen />} />
          <Route path="/ordenes" element={<Ordenes />} />
        </Routes>
      </main>
    </div>
  )
}
