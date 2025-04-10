import axios from 'axios'

// Création d'une instance axios préconfigurée
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Défini dans .env.local
  withCredentials: true, // Nécessaire si tu utilises des cookies pour l'auth
})

// Tu peux ajouter ici des interceptors plus tard si tu veux gérer les erreurs globales

export default api
