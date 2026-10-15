export const ESTADOS = {
  pendiente: { texto: 'Pendiente', color: 'var(--warn)' },
  preparando: { texto: 'En preparación', color: 'var(--blue)' },
  entregada: { texto: 'Entregada', color: 'var(--ok)' },
}

// Qué botón se muestra según el estado actual y a cuál estado pasa
export const SIGUIENTE = {
  pendiente: { texto: 'Empezar a preparar', a: 'preparando' },
  preparando: { texto: 'Marcar como entregada', a: 'entregada' },
}