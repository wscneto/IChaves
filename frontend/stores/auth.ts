import { defineStore } from 'pinia'
import type { User } from '@/types/database'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false
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
    }
  },
  actions: {
    async loginWithEmail(email: string) {
      this.isLoading = true
      try {
        console.log('🔍 Buscando usuário com email:', email)
        const user = await api.users.getByEmail(email)
        
        console.log('📦 Resposta da API:', user)
        console.log('📦 Tipo da resposta:', typeof user)
        console.log('📦 É null?', user === null)
        console.log('📦 É undefined?', user === undefined)
        
        if (!user) {
          console.error('❌ Usuário não encontrado - resposta vazia')
          throw new Error('Usuário não encontrado')
        }
        
        console.log('✅ Usuário encontrado:', user.Name)
        console.log('✅ Dados completos do usuário:', JSON.stringify(user, null, 2))
        
        this.user = user
        this.isAuthenticated = true
        return user
      } catch (error) {
        console.error('❌ Erro ao fazer login:', error)
        console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
        // Limpar estado em caso de erro
        this.user = null
        this.isAuthenticated = false
        throw error
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
    },
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    }
  }
})
