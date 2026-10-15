import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">FEATON</div>
      <div className="subtitle">Panel de Control</div>
      <nav>
        <NavLink to="/">Solicitar material</NavLink>
        <NavLink to="/almacen">Almacén</NavLink>
        <NavLink to="/ordenes">Órdenes</NavLink>
      </nav>
    </aside>
  )
}