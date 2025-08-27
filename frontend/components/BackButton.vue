<template>
  <div>
    <button
      @click="$router.back()"
      class="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer flex items-center"
    >
      <Icon name="bx:arrow-back" class="mr-1" />
      Voltar
    </button>
  </div>
</template>
