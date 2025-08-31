import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      name: 'Walter Neto',
      role: 'student' as 'student' | 'admin'
    }
  }),
  actions: {
    setRole(role: 'student' | 'admin') {
      this.user.role = role
    }
  }
})
