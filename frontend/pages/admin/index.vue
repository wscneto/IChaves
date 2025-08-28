<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Cabeçalho da Área Admin MODIFICADO -->
    <div class="p-4 bg-gray-800 text-white flex justify-between items-center sticky top-0 z-10">
      <h1 class="text-xl font-bold">Área da Secretaria</h1>
      <div class="flex items-center gap-6">
        <!-- Ícone de Notificações -->
        <NotificationBell :count="notificationCount" @open="isNotificationModalVisible = true" />
        <!-- Link de perfil com ícone e nome -->
        <NuxtLink 
          to="/admin/user" 
          class="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg transition"
        >
          <img 
            :src="adminUser.avatar" 
            alt="Avatar da Secretaria" 
            class="w-8 h-8 rounded-full border-2 border-gray-500"
          >
          <span class="font-semibold">{{ adminUser.name }}</span>
        </NuxtLink>
      </div>
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
        <div
          v-for="room in filteredClassrooms"
          :key="room.id"
          class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between"
        >
          <div class="flex items-center gap-10">
            <h2 class="text-lg font-semibold text-gray-800">{{ room.name }}</h2>
            <StatusBadge :status="room.status" />
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="openConfirmationModal(room, 'block')"
              :class="[
                'px-3 py-2 rounded-lg font-medium transition text-white',
                room.status !== 'blocked' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'
              ]"
            >
              {{ room.status !== 'blocked' ? 'Bloquear' : 'Desbloquear' }}
            </button>
            <button
              @click="openConfirmationModal(room, 'take')"
              :disabled="room.status === 'blocked'"
              class="px-3 py-2 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              {{ room.status === 'in_use' ? 'Forçar Devolução' : 'Pegar Chave' }}
            </button>
          </div>
        </div>
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

    <!-- Modal de Notificações para Admin -->
    <NotificationModal
      v-if="isNotificationModalVisible"
      :notifications="adminNotifications"
      :request="adminKeyRequest"
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

// --- LÓGICA DAS NOTIFICAÇÕES DO ADMIN ---
const isNotificationModalVisible = ref(false)

// Exemplo de uma requisição de chave pendente para a secretaria
const adminKeyRequest = ref<KeyRequest>({
  id: 202,
  userName: 'Walter Neto',
  roomName: 'Sala de Estudos',
})

// Notificações normais da secretaria
const adminNotifications = ref<Notification[]>([
  { id: 3, message: 'A chave do Armário 04 foi devolvida por Mickey Mouse.', timestamp: 'há 1 hora' },
])

// Contagem total de notificações para o badge
const notificationCount = computed(() => {
  return (adminKeyRequest.value ? 1 : 0) + adminNotifications.value.length
})

// --- O resto do seu script continua igual ---
interface Room {
  id: number;
  name: string;
  status: 'available' | 'in_use' | 'blocked';
}

const adminUser = ref({
  name: 'Secretaria',
  avatar: 'https://ui-avatars.com/api/?name=Secretaria&background=E1F1FF&color=0D47A1',
})

const searchQuery = ref('')
const classrooms = ref<Room[]>([
  { id: 1, name: 'Armário 01', status: 'available' },
  { id: 2, name: 'Armário 02', status: 'available' },
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

const isModalVisible = ref(false)
const selectedAction = ref<{ room: Room | null, type: 'take' | 'block' }>({ room: null, type: 'take' })
const modalContent = ref({ title: '', message: '', confirmText: '' })

const openConfirmationModal = (room: Room, type: 'take' | 'block') => {
  selectedAction.value = { room, type }
  
  if (type === 'take') {
    const isTaking = room.status === 'available'
    modalContent.value = {
      title: isTaking ? 'Pegar Chave' : 'Forçar Devolução',
      message: `Confirmar a ação para a sala "${room.name}"?`,
      confirmText: 'Sim, confirmar'
    }
  } else if (type === 'block') {
    const isBlocking = room.status !== 'blocked'
    modalContent.value = {
      title: isBlocking ? 'Bloquear Sala' : 'Desbloquear Sala',
      message: `Deseja ${isBlocking ? 'bloquear' : 'desbloquear'} a sala "${room.name}"?`,
      confirmText: isBlocking ? 'Sim, bloquear' : 'Sim, desbloquear'
    }
  }
  isModalVisible.value = true
}

const handleConfirmAction = () => {
  const { room, type } = selectedAction.value
  if (!room) return

  if (type === 'take') {
    room.status = room.status === 'available' ? 'in_use' : 'available'
    alert(`Ação para "${room.name}" concluída!`)
  } else if (type === 'block') {
    room.status = room.status !== 'blocked' ? 'blocked' : 'available'
    alert(`Ação de bloqueio para "${room.name}" concluída!`)
  }
  
  closeModal()
}

const closeModal = () => {
  isModalVisible.value = false
}
</script>
