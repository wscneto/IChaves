<template>
  <div class="min-h-screen bg-gray-50 px-6 py-12">
    <div class="max-w-5xl mx-auto">
      <BackButton />
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        Sobre o Projeto
      </h1>
      <p class="text-gray-600 mb-12 max-w-2xl mx-auto text-justify">
        O IChaves foi desenvolvido como um projeto acadêmico para auxiliar na gestão de chaves das salas de aula do Instituto de Computação da UFAL. Nosso time é composto por estudantes dedicados que acreditam na tecnologia como facilitadora da vida acadêmica.
      </p>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="member in team"
          :key="member.id"
          class="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
        >
          <img
            :src="member.avatar"
            :alt="member.name"
            class="w-30 h-30 md:w-33 md:h-33 mx-auto rounded-full border border-gray-300 mb-4"
          />

          <h2 class="text-xl font-semibold text-gray-800">
            {{ member.name }}
          </h2>

          <p class="text-sm sm:text-base text-blue-600 font-medium">{{ member.role }}</p>

          <p class="text-sm sm:text-base text-gray-600 mt-2">{{ member.bio }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import walter from '~/assets/images/walter.jpeg'
import andre from '~/assets/images/andre.jpeg'
import john from '~/assets/images/john.jpeg'
import davi from '~/assets/images/davi.jpeg'
import samuel from '~/assets/images/samuel.jpeg'

const team = ref([
  {
    id: 1,
    name: 'Walter Neto',
    role: 'Fullstack Developer',
    bio: 'Responsável pela interface do usuário e integração com banco de dados.',
    avatar: walter
  },
  {
    id: 2,
    name: 'Pedro André',
    role: 'Backend Developer',
    bio: 'Cuida da API e da integração com o banco de dados.',
    avatar: andre
  },
  {
    id: 3,
    name: 'John Wallex',
    role: 'UI/UX Designer',
    bio: 'Planejou o design e a experiência do usuário.',
    avatar: john
  },
  {
    id: 4,
    name: 'Davi William',
    role: 'Project Manager',
    bio: 'Gerencia as tarefas, prazos e comunicação do time.',
    avatar: davi
  },
  {
    id: 5,
    name: 'Samuel Medino',
    role: 'Tester / QA',
    bio: 'Responsável por garantir a qualidade do software.',
    avatar: samuel
  }
])
</script>
