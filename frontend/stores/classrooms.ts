import { defineStore } from 'pinia'
import type { Classroom } from '@/types/database'
import { getClassrooms } from '@/data/classrooms'

export const useClassroomsStore = defineStore('classrooms', {
  state: () => ({
    classrooms: [] as Classroom[],
    isLoading: true,
  }),
  actions: {
    async fetchClassrooms() {
      this.isLoading = true
      try {
        const classroomsData = await getClassrooms()
        this.classrooms = classroomsData
      } catch (error) {
        console.error('❌ Erro ao carregar salas:', error)
      } finally {
        this.isLoading = false
      }
    },
    updateClassroom(updatedClassroom: Classroom) {
      const index = this.classrooms.findIndex(c => c.IDClassroom === updatedClassroom.IDClassroom)
      if (index !== -1) {
        this.classrooms[index] = updatedClassroom
      }
    },
  },
})
