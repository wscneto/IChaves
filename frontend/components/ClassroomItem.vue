<template>
  <div
    class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-200 flex items-center justify-between"
    :class="{
      'cursor-pointer': classroom.status !== 'blocked' && classroom.status !== 'unknown',
      'opacity-70': classroom.status === 'blocked',
      'hover:scale-[1.02]': classroom.status !== 'blocked' && classroom.status !== 'unknown'
    }"
    @click="handleClassroomClick"
  >
    <!-- Left side: Status indicator, name and badge -->
    <div class="flex items-center gap-4 flex-1 min-w-0">
      <!-- Status indicator bar -->
      <div
        class="w-1 h-8 rounded-md flex-shrink-0"
        :class="statusBarColor"
      ></div>
      
      <!-- Classroom info -->
      <div class="flex-1 min-w-0">
        <h2 class="text-lg font-semibold text-gray-800 font-funnel-sans truncate">
          {{ classroom.Name }}
        </h2>
        <div class="flex items-center gap-2 mt-1">
          <StatusBadge :status="classroom.State" class="hidden sm:inline-block" />
          <span v-if="classroom.Capacity" class="text-sm text-gray-500 font-funnel-sans">
            Capacidade: {{ classroom.Capacity }}
          </span>
        </div>
      </div>
    </div>

    <!-- Right side: Action button -->
    <div @click.stop class="flex-shrink-0">
      <Button
        v-if="actionButton"
        :variant="actionButton.variant"
        :icon="actionButton.icon"
        :disabled="actionButton.disabled || isLoading"
        @click="handleAction"
        size="md"
        class="w-35"
      >
        <span v-if="isLoading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </span>
        <span v-else>{{ actionButton.label }}</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Classroom } from '@/types/database'
import StatusBadge from '@/components/StatusBadge.vue'
import Button from '@/components/Button.vue'

interface Props {
  classroom: Classroom
  userRole: 'student' | 'admin'
  isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [classroom: Classroom]
  action: [action: string, classroom: Classroom]
}>()

const statusBarColor = computed(() => {
  switch (props.classroom.State) {
    case 'Disponivel':
      return 'bg-green-500'
    case 'Em uso':
      return 'bg-orange-500'
    case 'Indisponivel':
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
})

const actionButton = computed(() => {
  const { classroom, userRole } = props

  if (userRole === 'admin') {
    switch (classroom.State) {
      case 'Disponivel':
        return {
          type: 'suspender',
          label: 'Suspender',
          variant: 'red' as const,
          icon: 'bx:pause'
        }
      case 'Em uso':
        return {
          type: 'solicitar',
          label: 'Solicitar',
          variant: 'volcano' as const,
          icon: 'bx:plus'
        }
      case 'Indisponivel':
        return {
          type: 'liberar',
          label: 'Liberar',
          variant: 'green' as const,
          icon: 'bx:lock-open-alt'
        }
      default:
        return {
          type: 'solicitar',
          label: 'Suspenso',
          variant: 'ghost' as const,
          disabled: true
        }
    }
  } else {
    // Student actions
    switch (classroom.State) {
      case 'Disponivel':
        return {
          type: 'reservar',
          label: 'Reservar',
          variant: 'green' as const,
          icon: 'bx:calendar-plus'
        }
      case 'Em uso':
        return {
          type: 'trocar',
          label: 'Trocar',
          variant: 'volcano' as const,
          icon: 'bx:refresh'
        }
      case 'Indisponivel':
        return {
          type: 'reservar',
          label: 'Suspenso',
          variant: 'red' as const,
          icon: 'bx:lock-alt',
          disabled: true
        }
      default:
        return {
          type: 'reservar',
          label: 'Suspenso',
          variant: 'ghost' as const,
          disabled: true
        }
    }
  }
})

const handleClassroomClick = () => {
  if (props.classroom.State !== 'Indisponivel') {
    emit('click', props.classroom)
  }
}

const handleAction = () => {
  if (actionButton.value && !actionButton.value.disabled) {
    emit('action', actionButton.value.type, props.classroom)
  }
}
</script>

<style scoped>
.font-funnel-sans {
  font-family: "Funnel Sans", sans-serif;
}
</style>
