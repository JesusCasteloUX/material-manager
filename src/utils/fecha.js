// Convierte "2026-09-16" en "16 sept 2026"
export function formatearFecha(iso) {
  return new Date(iso + 'T12:00').toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}