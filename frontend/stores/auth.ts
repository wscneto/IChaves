import { defineStore } from 'pinia'
import type { User } from '@/types/database'
import { api } from '@/services/api'
import { useNotificationsStore } from './notifications'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    isLoading: true, // Começa como true para verificar o token
  }),
  getters: {
    userRole: (state) => {
      if (!state.user) return null
      return state.user.Admin ? 'admin' : 'student'
    },
    userName: (state) => {
      return state.user?.Name || ''
    },
    userEmail: (state) => {
      return state.user?.Email || ''
    },
  },
  actions: {
    async initializeAuth() {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
          this.token = storedToken
          await this.fetchUser()
        } else {
          this.isLoading = false
        }
      }
    },
    async fetchUser() {
      if (!this.token) {
        this.isLoading = false
        return
      }
      this.isLoading = true
      try {
        // Presume-se que a API tem um endpoint /users/me para obter o usuário pelo token
        const user = await api.users.getMe()
        if (user) {
          this.user = user
          this.isAuthenticated = true
          const notificationsStore = useNotificationsStore()
          notificationsStore.fetchNotifications(user.IDUser)
        } else {
          this.logout() // Se o token for inválido, desloga
        }
      } catch (error) {
        console.error('❌ Erro ao buscar usuário com token:', error)
        this.logout()
      } finally {
        this.isLoading = false
      }
    },
    async logout() {
      try {
        await api.auth.logout()
      } catch (error) {
        console.error('Error during logout:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.isLoading = false
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          // Redirect to external login after logout
          window.location.href = 'https://pisic.vercel.app/'
        }
        const notificationsStore = useNotificationsStore()
        notificationsStore.notifications = []
      }
    },
    async setToken(token: string) {
      this.token = token
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
      }
      await this.fetchUser()
    },
  },
})