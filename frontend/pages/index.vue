<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Cabeçalho da Página -->
    <header class="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 class="text-xl font-bold text-gray-800">Portal do Aluno</h1>
      <div class="flex items-center gap-6">
        <!-- Ícone de Notificações com contagem atualizada -->
        <NotificationBell :count="notificationCount" @open="isNotificationModalVisible = true" />
        <!-- Perfil do Usuário -->
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
       <!-- O conteúdo da lista de salas continua o mesmo -->
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

            <button
              @click.prevent.stop="openConfirmationModal(room)"
              :disabled="room.status === 'blocked'"
              :class="[
                'ml-4 px-4 py-2 rounded-lg font-medium transition',
                room.status === 'available'
                  ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                  : room.status === 'in_use'
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              ]"
            >
              {{
                room.status === 'available'
                  ? 'Pegar chave'
                  : room.status === 'in_use'
                  ? 'Trocar chave'
                  : 'Indisponível'
              }}
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
    
    <!-- Modal de Notificações agora recebe a requisição -->
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
// Importe os tipos atualizados do modal
import NotificationModal, { type Notification, type KeyRequest } from '@/components/NotificationModal.vue'

// --- LÓGICA DAS NOTIFICAÇÕES ---
const isNotificationModalVisible = ref(false)

// Exemplo de uma requisição de chave pendente que aparecerá no modal
const keyRequest = ref<KeyRequest>({
  id: 101,
  userName: 'Secretaria',
  roomName: 'Laboratório 03',
})

// Notificações normais que também aparecerão
const notifications = ref<Notification[]>([
  { id: 2, message: 'A chave do Armário 02 foi devolvida com sucesso.', timestamp: 'há 2 horas' },
])

// Contagem total de notificações para o badge (soma a requisição + as notificações normais)
const notificationCount = computed(() => {
  return (keyRequest.value ? 1 : 0) + notifications.value.length
})


// --- O resto do seu script continua igual ---
interface Room {
  id: number;
  name: string;
  status: 'available' | 'in_use' | 'blocked';
}

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
const selectedRoom = ref<Room | null>(null)
const modalContent = ref({ title: '', message: '', confirmText: '' })

const openConfirmationModal = (room: Room) => {
  if (room.status === 'blocked') return;
  selectedRoom.value = room
  if (room.status === 'available') {
    modalContent.value = {
      title: 'Pegar Chave',
      message: `Você tem certeza que deseja pegar a chave de "${room.name}"?`,
      confirmText: 'Sim, pegar'
    }
  } else if (room.status === 'in_use') {
    modalContent.value = {
      title: 'Trocar Chave',
      message: `Você confirma a troca de chave de "${room.name}"?`,
      confirmText: 'Sim, trocar'
    }
  }
  isModalVisible.value = true
}

const handleConfirmAction = () => {
  if (!selectedRoom.value) return
  const room = selectedRoom.value
  if (room.status === 'available') {
    room.status = 'in_use'
    alert(`Você pegou a chave de ${room.name}!`)
  } else if (room.status === 'in_use') {
    alert(`Você trocou a chave de ${room.name}.`)
  }
  closeModal()
}

const closeModal = () => {
  isModalVisible.value = false
  selectedRoom.value = null
}
</script>
