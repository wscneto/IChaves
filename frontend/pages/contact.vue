<template>
  <div class="min-h-screen bg-gray-50 px-6 py-12">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Fale Conosco
      </h1>
      <p class="text-center text-gray-600 mb-10">
        Tem dúvidas, sugestões ou encontrou algum problema? Preencha o formulário abaixo e nossa equipe entrará em contato.
      </p>

      <div
        v-if="submitted"
        class="mt-6 mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-center"
      >
        Sua mensagem foi enviada com sucesso!
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="bg-white shadow rounded-xl p-8 space-y-6"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
          <input
            v-model="form.subject"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
          <textarea
            v-model="form.message"
            rows="5"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitted = ref(false)

const handleSubmit = () => {
  console.log('Form data:', form.value)
  submitted.value = true
  form.value = { name: '', email: '', subject: '', message: '' }
}
</script>
