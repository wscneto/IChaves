import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    pendingRequests: [] as { id: number; student: string; classroom: string }[]
  }),
  actions: {
    addRequest(request: { id: number; student: string; classroom: string }) {
      this.pendingRequests.push(request)
    },
    clearRequests() {
      this.pendingRequests = []
    }
  }
})
