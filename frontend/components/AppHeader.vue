<template>
  <div>
    <header class="fixed w-full h-[60px] sm:h-[80px] lg:h-[100px] flex items-center justify-between px-4 py-3 bg-white shadow-md">
      <NuxtLink to="/">
        <h1 class="text-xl font-bold text-green-700"><span class="text-blue-600">IC</span>haves</h1>
      </NuxtLink>
      <div class="flex items-center space-x-3">
        <NuxtLink to="/user" class="flex items-center space-x-3">
          <span class="hidden sm:block text-gray-700 font-medium">
            Walter Neto
          </span>
          <img
            src="https://ui-avatars.com/api/?name=Walter+Neto"
            alt="User avatar"
            class="w-8 h-8 rounded-full border border-gray-300"
          />
        </NuxtLink>
      </div>
    </header>
  </div>
</template>
