<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- ... (o cabeçalho com notificações continua o mesmo) ... -->
    <header class="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 class="text-xl font-bold text-gray-800">Portal do Aluno</h1>
      <div class="flex items-center gap-6">
        <NotificationBell :count="notificationCount" @open="isNotificationModalVisible = true" />
        <NuxtLink to="/user" class="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
          <img src="https://ui-avatars.com/api/?name=Walter+Neto" alt="Avatar" class="w-8 h-8 rounded-full">
          <span class="font-semibold text-gray-700 hidden sm:block">Walter Neto</span>
        </NuxtLink>
      </div>
    </header>
    
    <div class="p-4 bg-blue-600 text-white text-center">
      <p>
        Esta é a visão do aluno.
        <NuxtLink to="/admin" class="font-bold underline hover:text-blue-200">
          Clique aqui para acessar a área da Secretaria.
        </NuxtLink>
      </p>
    </div>

    <div class="p-4">
      <input
        type="text"
        placeholder="Busque uma sala..."
        v-model="searchQuery"
        class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <main class="flex-1 p-4">
      <div class="flex flex-col gap-5">
        <NuxtLink
          v-for="room in filteredClassrooms"
          :key="room.id"
          :to="`/classrooms/${room.id}`"
          class="block"
        >
          <div
            class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between"
          >
            <div class="flex items-center gap-10">
              <h2 class="text-lg font-semibold text-gray-800">
                {{ room.name }}
              </h2>
              <StatusBadge :status="room.status" />
            </div>

            <!-- Botão com texto e cor dinâmicos baseados na nova lógica -->
            <button
              @click.prevent.stop="openConfirmationModal(room)"
              :disabled="room.status === 'blocked' || room.status === 'in_use'"
              :class="getButtonClass(room.status)"
            >
              {{ getButtonText(room.status) }}
            </button>
          </div>
        </NuxtLink>
      </div>
    </main>

    <ConfirmationModal
      v-if="isModalVisible"
      :title="modalContent.title"
      :message="modalContent.message"
      :confirm-text="modalContent.confirmText"
      @confirm="handleConfirmAction"
      @close="closeModal"
    />
    
    <NotificationModal
      v-if="isNotificationModalVisible"
      :notifications="notifications"
      :request="keyRequest"
      @close="isNotificationModalVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import NotificationModal, { type Notification, type KeyRequest } from '@/components/NotificationModal.vue'

// 1. ATUALIZE A INTERFACE Room para incluir 'reserved'
interface Room {
  id: number;
  name: string;
  status: 'available' | 'in_use' | 'blocked' | 'reserved';
}

// ... (lógica de notificações continua a mesma) ...
const isNotificationModalVisible = ref(false)
const keyRequest = ref<KeyRequest>({ id: 101, userName: 'Secretaria', roomName: 'Laboratório 03' })
const notifications = ref<Notification[]>([{ id: 2, message: 'A chave do Armário 02 foi devolvida com sucesso.', timestamp: 'há 2 horas' }])
const notificationCount = computed(() => (keyRequest.value ? 1 : 0) + notifications.value.length)

const searchQuery = ref('')
const classrooms = ref<Room[]>([
  { id: 1, name: 'Armário 01', status: 'available' },
  { id: 2, name: 'Armário 02', status: 'reserved' }, // Exemplo de sala já reservada
  { id: 3, name: 'Armário 03', status: 'available' },
  { id: 4, name: 'Armário 04', status: 'available' },
  { id: 5, name: 'Sala de Convivência', status: 'blocked' },
  { id: 6, name: 'Sala de Estudos', status: 'available' },
  { id: 7, name: 'Laboratório 03', status: 'in_use' },
])

const filteredClassrooms = computed(() =>
  classrooms.value.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// 2. FUNÇÕES AUXILIARES PARA O BOTÃO
const getButtonText = (status: Room['status']) => {
  if (status === 'available') return 'Pegar chave'
  if (status === 'reserved') return 'Devolver'
  if (status === 'in_use') return 'Trocar chave'
  return 'Indisponível'
}

const getButtonClass = (status: Room['status']) => {
  const baseClass = 'ml-4 px-4 py-2 rounded-lg font-medium transition'
  if (status === 'available') return `${baseClass} bg-green-500 text-white hover:bg-green-600 cursor-pointer`
  if (status === 'reserved') return `${baseClass} bg-blue-500 text-white hover:bg-blue-600 cursor-pointer`
  if (status === 'in_use') return `${baseClass} bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer`
  return `${baseClass} bg-gray-300 text-gray-600 cursor-not-allowed`
}

// --- LÓGICA DO MODAL ATUALIZADA ---
const isModalVisible = ref(false)
const selectedRoom = ref<Room | null>(null)
const modalContent = ref({ title: '', message: '', confirmText: '' })

// 3. ATUALIZE A LÓGICA PARA ABRIR O MODAL
const openConfirmationModal = (room: Room) => {
  if (room.status === 'blocked' || room.status === 'in_use') return;

  selectedRoom.value = room
  if (room.status === 'available') {
    modalContent.value = {
      title: 'Pegar Chave',
      message: `Você tem certeza que deseja reservar a chave de "${room.name}"?`,
      confirmText: 'Sim, reservar'
    }
  } else if (room.status === 'reserved') {
    modalContent.value = {
      title: 'Devolver Chave',
      message: `Você confirma a devolução da chave de "${room.name}"?`,
      confirmText: 'Sim, devolver'
    }
  }
  isModalVisible.value = true
}

// 4. ATUALIZE A LÓGICA DA AÇÃO
const handleConfirmAction = () => {
  if (!selectedRoom.value) return
  const room = selectedRoom.value

  if (room.status === 'available') {
    room.status = 'reserved' // Muda para 'reserved'
    alert(`Você reservou a chave de ${room.name}!`)
  } else if (room.status === 'reserved') {
    room.status = 'available' // Muda de volta para 'available'
    alert(`Você devolveu a chave de ${room.name}.`)
  }
  
  closeModal()
}

const closeModal = () => {
  isModalVisible.value = false
  selectedRoom.value = null
}
</script>
