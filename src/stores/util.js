import { computed, toValue } from "vue"

const MONTHS_CA = [
"Gen", "Feb", "Mar",
"Abr", "Mai", "Jun",
"Jul", "Ago", "Set",
"Oct", "Nov", "Des",
]


//FORMAT DE DATES

export const formattedDateTime = (dateString) => {
if (!dateString) return ''
const date = new Date(dateString)
return date.toLocaleString("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})
}

export const formatDate = computed((dateString) => {
if (!dateString) return ''

return new Date(dateString).toLocaleDateString("ca-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})
})

export function useDateFormatter(dateRef) {
const formattedDate = computed(() => {
  const dateVal = toValue(dateRef)
  if (!dateVal) return ''
  const date = new Date(dateVal).toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  return date
})

return { formattedDate }
}


// FORMAT DE ETIQUETES

export function monthLabel(date) {
const d = date instanceof Date ? date : new Date(date)
return MONTHS_CA[d.getMonth()] ?? "--"
}

export function foundationLabel(date) {
if (!date) return ''
const d = date instanceof Date ? date : new Date(date)
return `Fundada el ${d.getFullYear()}`
}

export function dayLabel(date) {
const d = date instanceof Date ? date : new Date(date)
const day = d.getDate()
return day.toString().padStart(2, "0")
}


//GESTIÓ DE IMATGES I ARXIUS

export const fileToBase64 = (file) => {
return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64Clean = reader.result.split(",")
      resolve(base64Clean)
    }
    reader.onerror = (error) => reject(error)
  })
}

export function shieldSrc(shield) {
if (!shield) return null
if (shield.startsWith('data:')) return shield
return `data:image/pngbase64,${shield}`
}

// VALIDACIÓ DE EMAILS;

export const isValidEmail = (email) => {
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
return regex.test(email)
}