<template>
  <div class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-200 animate-pulse">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <!-- Status indicator skeleton -->
        <div class="w-1 h-8 bg-gray-300 rounded-md flex-shrink-0"></div>
        
        <!-- Content skeleton -->
        <div class="flex-1 min-w-0">
          <!-- Title skeleton -->
          <div class="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          
          <!-- Badge and capacity skeleton -->
          <div class="flex items-center gap-2 mt-1">
            <div class="h-5 bg-gray-200 rounded-full w-20 hidden sm:block"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
      
      <!-- Button skeleton -->
      <div class="w-28 h-10 bg-gray-300 rounded-lg flex-shrink-0"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente de skeleton para ClassroomItem
</script>
