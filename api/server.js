import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

const ESTADOS = ['pendiente', 'preparando', 'entregada']

// 1) Buscar un material por código, con sus ubicaciones
app.get('/api/materiales/:codigo', (req, res) => {
  const codigo = req.params.codigo.toUpperCase()
  const material = db.prepare('SELECT * FROM materiales WHERE codigo = ?').get(codigo)
  if (!material) return res.status(404).json({ error: 'Código no encontrado' })

  material.ubicaciones = db
    .prepare('SELECT zona, cantidad FROM ubicaciones WHERE codigo = ? ORDER BY id')
    .all(codigo)
  res.json(material)
})

// 2) Listar todas las órdenes (con datos del material)
app.get('/api/ordenes', (req, res) => {
  const filas = db
    .prepare(
      `SELECT o.*, m.nombre, m.icono, m.unidad
       FROM ordenes o JOIN materiales m ON m.codigo = o.codigo
       ORDER BY o.rowid DESC`
    )
    .all()
  res.json(filas.map((o) => ({ ...o, urgente: !!o.urgente })))
})

// 3) Crear una orden y descontar inventario (todo o nada)
const crearOrden = db.transaction((d) => {
  const ubi = db
    .prepare('SELECT cantidad FROM ubicaciones WHERE codigo = ? AND zona = ?')
    .get(d.codigo, d.zona)
  if (!ubi) throw new Error('Ubicación no válida')
  if (!Number.isInteger(d.cantidad) || d.cantidad < 1 || d.cantidad > ubi.cantidad)
    throw new Error(`Cantidad inválida (máximo ${ubi.cantidad})`)

  db.prepare('UPDATE ubicaciones SET cantidad = cantidad - ? WHERE codigo = ? AND zona = ?')
    .run(d.cantidad, d.codigo, d.zona)

  const n = db.prepare('SELECT COUNT(*) AS n FROM ordenes').get().n + 1
  const id = 'ORD-' + String(n).padStart(3, '0')
  db.prepare(
    `INSERT INTO ordenes (id, oracle, codigo, zona, cantidad, linea, estado, fecha)
     VALUES (?, ?, ?, ?, ?, ?, 'pendiente', date('now', 'localtime'))`
  ).run(id, d.oracle, d.codigo, d.zona, d.cantidad, d.linea)
  return id
})

app.post('/api/ordenes', (req, res) => {
  const { oracle, codigo, zona, cantidad, linea } = req.body
  if (!oracle || !codigo || !zona || !linea)
    return res.status(400).json({ error: 'Faltan datos' })
  try {
    const id = crearOrden({ oracle: String(oracle), codigo, zona, cantidad: Number(cantidad), linea })
    res.status(201).json({ id })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// 4) Cambiar el estado de una orden
app.patch('/api/ordenes/:id', (req, res) => {
  const { estado } = req.body
  if (!ESTADOS.includes(estado)) return res.status(400).json({ error: 'Estado no válido' })
  const r = db.prepare('UPDATE ordenes SET estado = ? WHERE id = ?').run(estado, req.params.id)
  if (r.changes === 0) return res.status(404).json({ error: 'Orden no encontrada' })
  res.json({ ok: true })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API lista en el puerto ${PORT}`))