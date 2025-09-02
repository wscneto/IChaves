import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    pendingRequests: [] as { id: number; student: string; classroom: string }[],
  }),
  actions: {
    addRequest(req: { id: number; student: string; classroom: string }) {
      this.pendingRequests.push(req)
    },
    removeRequest(id: number) {
      this.pendingRequests = this.pendingRequests.filter((r) => r.id !== id)
    },
    seed() {
      if (this.pendingRequests.length === 0) {
        this.addRequest({ id: 1, student: 'Jubileu', classroom: 'Lab 01' })
      }
    },
  },
})
