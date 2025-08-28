<template>
  <div class="min-h-screen p-4 bg-gray-50">

    <BackButton />

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
    { id: 1, name: 'Armário 01', status: 'available', capacity: 1, equipment: [], description: 'Armário para guardar pertences.' },
    { id: 2, name: 'Armário 02', status: 'available', capacity: 1, equipment: [], description: 'Armário para guardar pertences.' },
    { id: 3, name: 'Armário 03', status: 'available', capacity: 1, equipment: [], description: 'Armário para guardar pertences.' },
    { id: 4, name: 'Armário 04', status: 'available', capacity: 1, equipment: [], description: 'Armário para guardar pertences.' },
    { id: 5, name: 'Sala de Convivência' , status: 'blocked', capacity: 10, equipment: ['Sofá', 'Cafeteira'], description: 'Pequena sala para convivência dos alunos' },
    { id: 6, name: 'Sala de Estudos', status: 'available', capacity: 10, equipment: ['Computadores', 'Mesas individuais'], description: 'Sala de estudos' },
    { id: 7, name: 'Laboratório 03', status: 'in_use', capacity: 25, equipment: ['Computadores', 'Quadro Branco', 'TVs'], description: 'Sala de tamanho médio' },
  ]
  const found = classroomsMock.find(c => c.id === id)
  if (found) classroom.value = found
})
</script>
