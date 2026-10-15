import Database from 'better-sqlite3'

const db = new Database('materiales.db')
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS materiales (
    codigo TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    icono  TEXT,
    unidad TEXT DEFAULT 'pzas'
  );
  CREATE TABLE IF NOT EXISTS ubicaciones (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo   TEXT NOT NULL REFERENCES materiales(codigo),
    zona     TEXT NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS ordenes (
    id       TEXT PRIMARY KEY,
    oracle   TEXT NOT NULL,
    codigo   TEXT NOT NULL REFERENCES materiales(codigo),
    zona     TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    linea    TEXT NOT NULL,
    estado   TEXT NOT NULL DEFAULT 'pendiente',
    fecha    TEXT NOT NULL,
    urgente  INTEGER NOT NULL DEFAULT 0
  );
`)

// Datos de ejemplo (solo si la base está vacía)
if (db.prepare('SELECT COUNT(*) AS n FROM materiales').get().n === 0) {
  const addMat = db.prepare('INSERT INTO materiales (codigo, nombre, icono) VALUES (?, ?, ?)')
  const addUbi = db.prepare('INSERT INTO ubicaciones (codigo, zona, cantidad) VALUES (?, ?, ?)')
  const addOrd = db.prepare(
    'INSERT INTO ordenes (id, oracle, codigo, zona, cantidad, linea, estado, fecha, urgente) VALUES (?,?,?,?,?,?,?,?,?)'
  )

  db.transaction(() => {
    addMat.run('MT-52903', 'Empaque antiestático', '⚡')
    addUbi.run('MT-52903', 'RB108', 502)
    addUbi.run('MT-52903', 'CART09', 278)
    addUbi.run('MT-52903', 'RB512', 0)

    addMat.run('MT-61120', 'Tornillo M4 12 mm', '🔩')
    addUbi.run('MT-61120', 'RB113', 1800)
    addUbi.run('MT-61120', 'RB220', 0)

    addMat.run('MT-70455', 'Cinta adhesiva', '⭕')
    addUbi.run('MT-70455', 'RB190', 96)

    addOrd.run('ORD-001', '908285', 'MT-61120', 'RB113', 600, 'Línea ATS', 'preparando', '2026-09-16', 1)
    addOrd.run('ORD-002', '861467', 'MT-70455', 'RB190', 2, 'Línea ATS', 'entregada', '2026-09-14', 0)
    addOrd.run('ORD-003', '708914', 'MT-52903', 'RB108', 80, 'Línea 2', 'pendiente', '2026-09-12', 0)
  })()
}

export default db