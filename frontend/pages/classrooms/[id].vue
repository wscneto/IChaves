<template>
  <div class="min-h-screen p-4 bg-gray-50">
    <button
      @click="$router.back()"
      class="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
    >
      Voltar
    </button>

    <div class="bg-white p-6 rounded-2xl shadow">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        {{ classroom.name }}
      </h1>
      <StatusBadge :status="classroom.status" />

      <div class="mt-4">
        <p><strong>Capacidade:</strong> {{ classroom.capacity }}</p>
        <p><strong>Equipamentos:</strong> {{ classroom.equipment.join(', ') }}</p>
        <p><strong>Descrição:</strong> {{ classroom.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import StatusBadge from '@/components/StatusBadge.vue'

const route = useRoute()
const classroom = ref<any>({
  id: 0,
  name: '',
  status: 'unknown',
  capacity: 0,
  equipment: [],
  description: ''
})

onMounted(() => {
  const id = Number(route.params.id)
  // TODO: Replace this with real API call
  const classroomsMock = [
    { id: 1, name: 'Lab 01', status: 'in_use', capacity: 25, equipment: ['Projetor', 'Computadores', 'Quadro Branco'], description: 'Sala de tamanho médio' },
    { id: 2, name: 'Lab 02', status: 'in_use', capacity: 25, equipment: ['Computadores', 'Quadro Branco', 'TVs'], description: 'Sala de tamanho médio' },
    { id: 3, name: 'Lab 03', status: 'unknown', capacity: 20, equipment: ['Projetor', 'Computadores', 'Quadro Branco'], description: 'Só tem computador bomba...' },
    { id: 4, name: 'Sala de Convivência' , status: 'available', capacity: 10, equipment: ['Sofá', 'Cafeteira'], description: 'Pequena sala para convivência dos alunos' },
    { id: 5, name: 'Salinha', status: 'available', capacity: 10, equipment: ['Computadores', 'Mesas individuais'], description: 'Sala de estudos' },
  ]
  const found = classroomsMock.find(c => c.id === id)
  if (found) classroom.value = found
})
</script>
