<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <Icon
      v-if="icon"
      :name="icon"
      :class="iconClasses"
    />
    <span v-if="$slots.default" :class="textClasses">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'green' | 'volcano' | 'red'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'font-funnel-sans',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-6', 'py-3', 'text-lg'],
    xl: ['px-8', 'py-4', 'text-xl']
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-blue-600',
      'text-white',
      'hover:bg-blue-700',
      'focus:ring-blue-500',
      'shadow-sm',
      'hover:shadow-md'
    ],
    green: [
      'bg-green-4',
      'text-gray-10',
      'hover:bg-green-6',
      'focus:ring-green-4',
      'shadow-sm',
      'hover:shadow-md'
    ],
    volcano: [
      'bg-volcano-4',
      'text-gray-10',
      'hover:bg-volcano-6',
      'focus:ring-volcano-4',
      'shadow-sm',
      'hover:shadow-md'
    ],
    red: [
      'bg-red-4',
      'text-gray-10',
      'hover:bg-red-6',
      'focus:ring-red-4',
      'shadow-sm',
      'hover:shadow-md'
    ]
  }

  // Full width class
  const widthClass = props.fullWidth ? ['w-full'] : []

  // Get variant classes with fallback
  const currentVariantClasses = variantClasses[props.variant] || variantClasses.primary
  
  // Debug log
  console.log('Button variant:', props.variant, 'Classes:', currentVariantClasses)

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...currentVariantClasses,
    ...widthClass
  ]
})

const iconClasses = computed(() => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }
  
  return sizeClasses[props.size]
})

const textClasses = computed(() => {
  return 'font-medium'
})
</script>

<style scoped>
.font-funnel-sans {
  font-family: "Funnel Sans", sans-serif;
}
</style>
