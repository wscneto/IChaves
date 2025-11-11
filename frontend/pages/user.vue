<template>
  <div v-if="authStore.user" class="min-h-screen p-4 bg-gray-50">
    <div class="flex justify-between items-center">
      <BackButton />
    </div>

    <!-- user info section -->
    <div
      class="flex flex-col sm:flex-row p-6 rounded-2xl shadow items-center space-x-6"
    >
      <img
        :src="user.avatar"
        alt="User Avatar"
        class="w-24 h-24 rounded-full border-4 border-solid flex-shrink-0"
        :style="{ borderColor: 'var(--color-blue-4)' }"
      />
      <!-- profile info -->
      <div class="flex justify-between items-center w-full">
        <div>
          <h1
            class="text-2xl font-bold text-gray-800 mb-2 text-center sm:text-left"
          >
            {{ user.name }}
          </h1>
          <p class="text-gray-600 mb-4">Email: {{ user.email }}</p>
          <div class="flex space-x-4">
            <p><strong>Perfil:</strong> {{ user.role }}</p>
          </div>
        </div>
        <button
          @click="logout"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>

    <!-- History Section -->
    <div class="mt-6 bg-white p-6 rounded-2xl shadow">
      <h2 class="text-xl font-bold text-gray-800 mb-4">
        Histórico de Empréstimos
      </h2>
      <div v-if="isLoading" class="space-y-4">
        <!-- Skeleton Loader -->
        <div
          v-for="i in 3"
          :key="i"
          class="flex items-center justify-between p-4 bg-gray-100 rounded-lg animate-pulse"
        >
          <div class="h-4 bg-gray-300 rounded w-1/3"></div>
          <div class="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
      <div v-else-if="history.length > 0">
        <ul class="space-y-4">
          <HistoryItem
            v-for="item in history"
            :key="item.IDHistory"
            :history-item="item"
            display="classroom"
          />
        </ul>
        <!-- Pagination -->
        <div class="flex justify-center mt-6">
          <div class="flex space-x-2">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="fetchHistory(page)"
              :disabled="currentPage === page"
              class="px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out"
              :class="{
                'text-blue-500 underline': currentPage === page,
                'text-gray-700 hover:text-gray-900': currentPage !== page,
              }"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        <p>Nenhum histórico de empréstimos encontrado.</p>
      </div>
    </div>
  </div>
  <div
    v-else
    class="min-h-screen p-4 bg-gray-50 flex items-center justify-center"
  >
    <p>Carregando...</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import BackButton from "~/components/BackButton.vue";
import { useRouter } from "vue-router";
import type { History } from "@/types/database";
import { api } from "@/services/api";
import HistoryItem from "@/components/HistoryItem.vue";

useHead({
  title: "Perfil do Usuário - IChaves",
  meta: [
    {
      name: "description",
      content:
        "Veja seu perfil de usuário, histórico de empréstimos e gerencie suas informações no IChaves.",
    },
  ],
});

const authStore = useAuthStore();
const router = useRouter();

const history = ref<History[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const totalPages = ref(1);

function logout() {
  authStore.logout();
  router.push("/");
}

const user = computed(() => {
  if (!authStore.user) {
    return {
      name: "Usuário não encontrado",
      email: "",
      role: "",
      avatar:
        "https://ui-avatars.com/api/?name=?&background=0D47A1&color=FFFFFF&font-weight=bold",
    };
  }

  return {
    name: authStore.user.Name,
    email: authStore.user.Email,
    role: authStore.user.Student ? "Aluno" : "Admin",
    avatar: `https://ui-avatars.com/api/?name=${authStore.user.Name.replace(
      " ",
      "+"
    )}&background=0D47A1&color=FFFFFF&font-weight=bold`,
  };
});

const fetchHistory = async (page: number) => {
  if (!authStore.user) return;

  const userId = authStore.user.IDUser;
  if (!userId) {
    console.error("ID do usuário não encontrado.");
    return;
  }

  try {
    isLoading.value = true;
    const response = await api.histories.getAll({
      user_id: userId,
      page: page,
      limit: itemsPerPage.value,
    });
    history.value = response.data || [];
    totalPages.value =
      Math.ceil((response.total || 0) / itemsPerPage.value) || 1;
    currentPage.value = page;
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    history.value = [];
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (authStore.user) {
    fetchHistory(1);
  }
});
</script>
