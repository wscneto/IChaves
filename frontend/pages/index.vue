<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Search Input -->
    <div class="p-4">
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-12 bg-gray-200 rounded-xl" />
      </div>
      <input
        v-else
        v-model="searchQuery"
        type="text"
        placeholder="Busque uma sala..."
        class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-funnel-sans"
      >
    </div>

    <!-- Loading Message -->
    <div v-if="isLoading" class="px-4 pb-2">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-48" />
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
          :key="classroom.IDClassroom"
          :classroom="classroom"
          :user-role="authStore.userRole || 'student'"
          :is-loading="actionLoading === classroom.IDClassroom"
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
import { useRouter, useRoute } from 'vue-router'
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
  // Verificar se há parâmetro email na URL
  const route = useRoute()
  const email = route.query.email as string

  if (!email) {
    // Redirecionar para o site de login se não há email
    console.warn('❌ Email não fornecido na URL, redirecionando para login externo')
    console.log('🔄 Redirecionando em 3 segundos...')
    setTimeout(() => {
      window.location.href = 'https://login-externo.vercel.app/'
    }, 3000)
    return
  }

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.error('❌ Formato de email inválido:', email)
    console.log('🔄 Redirecionando em 3 segundos...')
    setTimeout(() => {
      window.location.href = 'https://login-externo.vercel.app/'
    }, 3000)
    return
  }

  // Tentar fazer login com o email
  try {
    console.log('🚀 Iniciando processo de login com email:', email)
    
    // Teste direto da API primeiro
    console.log('🧪 Testando API diretamente...')
    const testUrl = 'http://localhost:3001/api/users/email?email=' + encodeURIComponent(email)
    console.log('🧪 URL de teste:', testUrl)
    
    try {
      console.log('🧪 Fazendo fetch para:', testUrl)
      const testResponse = await fetch(testUrl)
      console.log('🧪 Status do teste:', testResponse.status)
      console.log('🧪 Headers do teste:', Object.fromEntries(testResponse.headers.entries()))
      
      if (!testResponse.ok) {
        console.error('🧪 ❌ Resposta não OK:', testResponse.status, testResponse.statusText)
        const errorText = await testResponse.text()
        console.error('🧪 ❌ Conteúdo do erro:', errorText)
      } else {
        const testData = await testResponse.json()
        console.log('🧪 ✅ Dados do teste:', testData)
        console.log('🧪 ✅ Tipo dos dados:', typeof testData)
        console.log('🧪 ✅ Dados têm propriedade data?', 'data' in testData)
        if (testData.data) {
          console.log('🧪 ✅ Dados.data:', testData.data)
        }
      }
    } catch (testError) {
      console.error('🧪 ❌ Erro no teste direto:', testError)
      console.error('🧪 ❌ Stack trace:', testError instanceof Error ? testError.stack : 'No stack')
    }
    
    console.log('🔄 Agora tentando via store...')
    await authStore.loginWithEmail(email)
    console.log('✅ Login realizado com sucesso via store')
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack')
    console.log('🔄 Redirecionando em 3 segundos...')
    // Redirecionar para o site de login em caso de erro
    setTimeout(() => {
      window.location.href = 'https://login-externo.vercel.app/'
    }, 3000)
    return
  }

  // Carregar salas após login bem-sucedido
  isLoading.value = true
  try {
    // Delay mínimo para mostrar o skeleton
    const [classroomsData] = await Promise.all([
      getClassrooms(),
      new Promise(resolve => setTimeout(resolve, 500)) // Delay mínimo de 500ms
    ])
    classrooms.value = classroomsData
    console.log('Salas carregadas com sucesso:', classroomsData.length)
  } catch (error) {
    console.error('Erro ao carregar salas:', error)
  } finally {
    isLoading.value = false
  }
})

const goToClassroom = (classroom: Classroom) => {
  router.push(`/classrooms/${classroom.IDClassroom}`)
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
            actionLoading.value = classroom.IDClassroom
            await updateClassroomState(classroom.IDClassroom, 'Em uso')
            const index = classrooms.value.findIndex(c => c.IDClassroom === classroom.IDClassroom)
            if (index !== -1 && classrooms.value[index]) {
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
            actionLoading.value = classroom.IDClassroom
            await updateClassroomState(classroom.IDClassroom, 'Disponivel')
            const index = classrooms.value.findIndex(c => c.IDClassroom === classroom.IDClassroom)
            if (index !== -1 && classrooms.value[index]) {
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
            actionLoading.value = classroom.IDClassroom
            await updateClassroomState(classroom.IDClassroom, 'Em uso')
            const index = classrooms.value.findIndex(c => c.IDClassroom === classroom.IDClassroom)
            if (index !== -1 && classrooms.value[index]) {
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
            actionLoading.value = classroom.IDClassroom
            await updateClassroomState(classroom.IDClassroom, 'Indisponivel')
            const index = classrooms.value.findIndex(c => c.IDClassroom === classroom.IDClassroom)
            if (index !== -1 && classrooms.value[index]) {
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
            actionLoading.value = classroom.IDClassroom
            await updateClassroomState(classroom.IDClassroom, 'Disponivel')
            const index = classrooms.value.findIndex(c => c.IDClassroom === classroom.IDClassroom)
            if (index !== -1 && classrooms.value[index]) {
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
