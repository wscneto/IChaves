import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', {
  state: () => ({
    show: false,
    message: '',
  }),
  actions: {
    showError(message: string) {
      this.show = true
      this.message = message
    },
    hideError() {
      this.show = false
      this.message = ''
    },
  },
})
