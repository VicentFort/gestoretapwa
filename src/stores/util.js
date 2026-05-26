import { computed, toValue } from "vue"

export const formattedDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    day:'2-digit',
    month:'2-digit',
    year:'numeric',
    hour:'2-digit',
    minute:'2-digit'
  }) // Simplificado para el ejemplo
}

export const formatDate = computed((dateString) => {
    if (!dateString) return ''
    
    // Convertimos el objeto Date a un string legible
    return new Date(dateString).toLocaleDateString('ca-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
})
export function useDateFormatter(dateRef) {
  const formattedDate = computed(() => {
    const dateVal = toValue(dateRef)
    if (!dateVal) return ''   
    const date = new Date(dateVal).toLocaleDateString('ca-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
    return date
  })

  return { formattedDate }
}