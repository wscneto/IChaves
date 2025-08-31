<template>
  <header class="fixed w-full h-[60px] sm:h-[80px] lg:h-[100px] flex items-center justify-between px-4 py-3 bg-gray-100 shadow-md z-100">
    <NuxtLink to="/" class="flex items-center">
      <img
        src="@/assets/images/ichaves-logo.svg"
        alt="IChaves Logo"
        class="h-8 sm:h-10 lg:h-12 w-auto"
      />
    </NuxtLink>

    <div class="flex items-center space-x-3">
      <NotificationBell />

      <NuxtLink to="/user" class="flex items-center space-x-3">
        <span class="hidden sm:block text-gray-700 font-medium text-xl">
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
