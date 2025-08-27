<template>
  <footer class="bg-gray-100 text-gray-800 border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
      
      <!-- Institucional -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="border-t-4 border-green-500 rounded-t-md"></div>
        <h2 class="text-lg font-bold text-green-600 mt-2">Institucional</h2>
        <ul class="mt-2 space-y-1 text-sm text-gray-600">
          <li>
            <NuxtLink to="/about" class="hover:text-green-600">Quem somos?</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Comunicação -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="border-t-4 border-blue-500 rounded-t-md"></div>
        <h2 class="text-lg font-bold text-blue-600 mt-2">Comunicação</h2>
        <ul class="mt-2 space-y-1 text-sm text-gray-600">
          <li>
            <NuxtLink to="/contact" class="hover:text-blue-600">Fale Conosco</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Redes sociais -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="border-t-4 border-orange-500 rounded-t-md"></div>
        <h2 class="text-lg font-bold text-orange-600 mt-2">Redes sociais</h2>
        <ul class="mt-2 space-y-1 text-sm text-gray-600">
          <li><a href="#" class="hover:text-orange-600">Instagram</a></li>
          <li><a href="https://github.com/wscneto/IChaves" target="_blank" class="hover:text-orange-600">GitHub</a></li>
          <li><a href="#" class="hover:text-orange-600">Twitter</a></li>
        </ul>
      </div>
    </div>

    <!-- Copyright -->
    <div class="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-500">
      Copyright © 2025 IChaves.
    </div>
  </footer>
</template>
