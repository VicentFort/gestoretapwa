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

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = () => {
      // reader.result es algo como: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
      // Al hacer split(',') separamos el encabezado de los datos reales.
      const base64Clean = reader.result.split(',') // <-- Esto obtiene solo los bytes
      
      resolve(base64Clean)
    }
    
    reader.onerror = (error) => reject(error)
  })
}

const MONTHS_CA = [
  'Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'
];

/**
 * Abreviatura del mes en català (3 lletres)
 * @param {Date|string} date - Data raw (ISO, Date object...)
 * @returns {string}
 */
export function monthLabel(date) {
  const d = date instanceof Date ? date : new Date(date);
  return MONTHS_CA[d.getMonth()] ?? '--';
}

/**
 * Dia del mes amb dos xifres (01, 12, 19...)
 * @param {Date|string} date
 * @returns {string}
 */
export function dayLabel(date) {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();
  return day.toString().padStart(2, '0');
}
