<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
// 1. Importe o componente do modal
import ConfirmationModal from '@/components/ConfirmationModal.vue'

// Definição do tipo para garantir consistência
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

// --- LÓGICA DO MODAL ---

// 2. Crie as variáveis de estado para controlar o modal
const isModalVisible = ref(false)
const selectedRoom = ref<Room | null>(null)
const modalContent = ref({
  title: '',
  message: '',
  confirmText: ''
})

// 3. Função para ABRIR o modal com os dados corretos
const openConfirmationModal = (room: Room) => {
  if (room.status === 'blocked') return; // Segurança extra

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

// 4. Função que executa a ação DEPOIS da confirmação no modal
const handleConfirmAction = () => {
  if (!selectedRoom.value) return

  const room = selectedRoom.value
  if (room.status === 'available') {
    room.status = 'in_use'
    // Você pode substituir o alert por uma notificação mais elegante no futuro
    alert(`Você pegou a chave de ${room.name}!`)
  } else if (room.status === 'in_use') {
    alert(`Você trocou a chave de ${room.name}.`)
  }
  
  closeModal()
}

// 5. Função para FECHAR e resetar o modal
const closeModal = () => {
  isModalVisible.value = false
  selectedRoom.value = null
}
</script>
