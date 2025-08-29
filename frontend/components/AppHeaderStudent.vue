<template>
  <header class="fixed w-full h-[60px] sm:h-[80px] lg:h-[100px] flex items-center justify-between px-4 py-3 bg-white shadow-md z-100">
    <NuxtLink to="/">
      <h1 class="text-2xl font-bold text-gray-700"><span class="text-blue-600">IC</span>haves</h1>
    </NuxtLink>
    <div class="flex items-center space-x-3">
      <NuxtLink to="/user" class="flex items-center space-x-3">
        <span class="hidden sm:block text-gray-700 font-medium text-xl ">
          Walter Neto
        </span>
        <img
          src="https://ui-avatars.com/api/?name=Walter+Neto"
          alt="User avatar"
          class="w-10 h-10 rounded-full border border-gray-300"
        />
      </NuxtLink>
    </div>
  </header>
</template>
