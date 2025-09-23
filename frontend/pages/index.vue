<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Search Input -->
    <div class="p-4">
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-12 bg-gray-200 rounded-xl"></div>
      </div>
      <input
        v-else
        type="text"
        placeholder="Busque uma sala..."
        v-model="searchQuery"
        class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-funnel-sans"
      />
    </div>

    <!-- Loading Message -->
    <div v-if="isLoading" class="px-4 pb-2">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    </div>

    <!-- Classrooms Grid -->
    <main class="flex-1 p-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ClassroomItemSkeleton v-for="n in 8" :key="n" />
      </div>

      <!-- Classrooms Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ClassroomItem
          v-for="classroom in filteredClassrooms"
          :key="classroom.ID_Classroom"
          :classroom="classroom"
          :user-role="authStore.user.role"
          :is-loading="actionLoading === classroom.ID_Classroom"
          @click="goToClassroom"
          @action="handleClassroomAction"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredClassrooms.length === 0" class="text-center py-12">
        <div class="text-gray-500 text-lg font-funnel-sans">
          Nenhuma sala encontrada
        </div>
        <div class="text-gray-400 text-sm mt-2">
          Tente ajustar sua busca
        </div>
      </div>
    </main>

    <!-- Confirmation Popup -->
    <ConfirmPopUp
      :show="isConfirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="onConfirm"
      @cancel="isConfirmOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Classroom } from '@/types/database'
import ConfirmPopUp from '@/components/ConfirmPopUp.vue'
import ClassroomItem from '@/components/ClassroomItem.vue'
import ClassroomItemSkeleton from '@/components/ClassroomItemSkeleton.vue'
import { useAuthStore } from '@/stores/auth'
import { getClassrooms, updateClassroomState } from '@/data/classrooms'

const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')

// State for confirmation popup
const isConfirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
let onConfirmAction: (() => void) | null = null

// Classrooms data
const classrooms = ref<Classroom[]>([])
const isLoading = ref(true) // Começa como true para mostrar skeleton imediatamente
const actionLoading = ref<number | null>(null) // ID da sala que está sendo processada

const filteredClassrooms = computed(() =>
  classrooms.value.filter((classroom) =>
    classroom.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// Load classrooms on mount
onMounted(async () => {
  isLoading.value = true
  try {
    // Delay mínimo para mostrar o skeleton
    const [classroomsData] = await Promise.all([
      getClassrooms(),
      new Promise(resolve => setTimeout(resolve, 500)) // Delay mínimo de 500ms
    ])
    classrooms.value = classroomsData
  } catch (error) {
    console.error('Erro ao carregar salas:', error)
  } finally {
    isLoading.value = false
  }
})

const goToClassroom = (classroom: Classroom) => {
  router.push(`/classrooms/${classroom.ID_Classroom}`)
}

const openConfirmPopup = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title
  confirmMessage.value = message
  onConfirmAction = action
  isConfirmOpen.value = true
}

const onConfirm = () => {
  if (onConfirmAction) {
    onConfirmAction()
  }
  isConfirmOpen.value = false
  onConfirmAction = null
}

const handleClassroomAction = async (action: string, classroom: Classroom) => {
  switch (action) {
    case 'reservar':
      openConfirmPopup(
        'Reservar Sala',
        `Você tem certeza que deseja reservar a sala ${classroom.Name}?`,
        async () => {
          try {
            actionLoading.value = classroom.ID_Classroom
            await updateClassroomState(classroom.ID_Classroom, 'Em uso')
            const index = classrooms.value.findIndex(c => c.ID_Classroom === classroom.ID_Classroom)
            if (index !== -1) {
              classrooms.value[index].State = 'Em uso'
            }
          } catch (error) {
            console.error('Erro ao reservar sala:', error)
            alert('Erro ao reservar a sala. Tente novamente.')
          } finally {
            actionLoading.value = null
          }
        }
      )
      break

    case 'trocar':
      openConfirmPopup(
        'Trocar Sala',
        `Você tem certeza que deseja trocar a sala ${classroom.Name}?`,
        async () => {
          try {
            actionLoading.value = classroom.ID_Classroom
            await updateClassroomState(classroom.ID_Classroom, 'Disponivel')
            const index = classrooms.value.findIndex(c => c.ID_Classroom === classroom.ID_Classroom)
            if (index !== -1) {
              classrooms.value[index].State = 'Disponivel'
            }
          } catch (error) {
            console.error('Erro ao trocar sala:', error)
            alert('Erro ao trocar a sala. Tente novamente.')
          } finally {
            actionLoading.value = null
          }
        }
      )
      break

    case 'solicitar':
      openConfirmPopup(
        'Solicitar Sala',
        `Você tem certeza que deseja solicitar a sala ${classroom.Name}?`,
        async () => {
          try {
            actionLoading.value = classroom.ID_Classroom
            await updateClassroomState(classroom.ID_Classroom, 'Em uso')
            const index = classrooms.value.findIndex(c => c.ID_Classroom === classroom.ID_Classroom)
            if (index !== -1) {
              classrooms.value[index].State = 'Em uso'
            }
          } catch (error) {
            console.error('Erro ao solicitar sala:', error)
            alert('Erro ao solicitar a sala. Tente novamente.')
          } finally {
            actionLoading.value = null
          }
        }
      )
      break

    case 'suspender':
      openConfirmPopup(
        'Suspender Sala',
        `Você tem certeza que deseja suspender a sala ${classroom.Name}?`,
        async () => {
          try {
            actionLoading.value = classroom.ID_Classroom
            await updateClassroomState(classroom.ID_Classroom, 'Indisponivel')
            const index = classrooms.value.findIndex(c => c.ID_Classroom === classroom.ID_Classroom)
            if (index !== -1) {
              classrooms.value[index].State = 'Indisponivel'
            }
          } catch (error) {
            console.error('Erro ao suspender sala:', error)
            alert('Erro ao suspender a sala. Tente novamente.')
          } finally {
            actionLoading.value = null
          }
        }
      )
      break

    case 'liberar':
      openConfirmPopup(
        'Liberar Sala',
        `Você tem certeza que deseja liberar a sala ${classroom.Name}?`,
        async () => {
          try {
            actionLoading.value = classroom.ID_Classroom
            await updateClassroomState(classroom.ID_Classroom, 'Disponivel')
            const index = classrooms.value.findIndex(c => c.ID_Classroom === classroom.ID_Classroom)
            if (index !== -1) {
              classrooms.value[index].State = 'Disponivel'
            }
          } catch (error) {
            console.error('Erro ao liberar sala:', error)
            alert('Erro ao liberar a sala. Tente novamente.')
          } finally {
            actionLoading.value = null
          }
        }
      )
      break

    default:
      console.warn('Ação não reconhecida:', action)
  }
}
</script>

<style scoped>
.font-funnel-sans {
  font-family: "Funnel Sans", sans-serif;
}
</style>
