import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem('nexapanel-auth') || '{}')
    const token = auth?.state?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message

    if (status === 401) {
      localStorage.removeItem('nexapanel-auth')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    if (status === 429) {
      toast.error('Demasiadas solicitudes. Espera un momento.')
    } else if (status >= 500) {
      toast.error('Error del servidor. Intenta más tarde.')
    } else if (message && status !== 422) {
      toast.error(message)
    }
    return Promise.reject(error)
  }
)

export default api
