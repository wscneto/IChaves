<template>
  <div class="min-h-screen p-4 bg-gray-50">
    <BackButton />

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white p-6 rounded-2xl shadow">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-48 mb-4" />
        <div class="h-6 bg-gray-200 rounded w-24 mb-4" />
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded w-full" />
          <div class="h-4 bg-gray-200 rounded w-3/4" />
          <div class="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>

    <!-- Classroom Details -->
    <div v-else-if="classroom" class="bg-white p-6 rounded-2xl shadow">
      <div class="flex justify-between mt-6 space-x-4">
        <div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">
              {{ classroom.Name }}
            </h1>
            <StatusBadge :status="classroom.State" />
          </div>
          <div class="w-2/3 space-y-4">
            <div class="h-full flex flex-col">
              <p class="text-gray-600">
                <strong>Capacidade:</strong> {{ classroom.Capacity }} pessoas
              </p>
              <p class="text-gray-600">
                <strong>Responsável:</strong> {{ classroom.NameResponsible }}
              </p>
              <p class="text-gray-600">
                <strong>Equipamentos:</strong>
                {{ classroom.Equipment || "Nenhum" }}
              </p>
              <p class="text-gray-600">
                <strong>Descrição:</strong> {{ classroom.Description }}
              </p>
            </div>
          </div>
        </div>

        <div class="w-1/3 h-[200px] bg-gray-100 p-4 rounded-lg flex flex-col">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">
            Nota da Secretaria
          </h2>
          <p class="text-gray-600 flex-grow">
            {{ classroom.SecretaryNote || "Nenhuma nota da secretaria" }}
          </p>
        </div>
      </div>

      <!-- History Section -->
      <div v-if="history.length > 0" class="mt-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          Histórico de Uso
        </h2>
        <div class="space-y-4">
          <HistoryItem
            v-for="item in history"
            :key="item.IDHistory"
            :history-item="item"
            display="user"
          />
        </div>
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
                'text-gray-700 hover:text-gray-900':
                  currentPage !== page,
              }"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty History State -->
      <div v-else class="mt-8 text-center py-8 text-gray-500">
        <p>Nenhum histórico de uso encontrado para esta sala.</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-white p-6 rounded-2xl shadow text-center">
      <h1 class="text-xl font-bold text-red-600 mb-2">Erro</h1>
      <p class="text-gray-600">
        Sala não encontrada ou erro ao carregar dados.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Classroom, History } from "@/types/database";
import StatusBadge from "@/components/StatusBadge.vue";
import HistoryItem from "@/components/HistoryItem.vue";

import { api } from "@/services/api";

useHead({
  title: "Detalhes da Sala",
  meta: [
    {
      name: "description",
      content: "Detalhes, histórico e informações da sala.",
    },
  ],
});

const route = useRoute();
const classroom = ref<Classroom | null>(null);
const history = ref<History[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const totalPages = ref(1);

const fetchHistory = async (page: number) => {
  const id = Number(route.params.id);
  if (!id || isNaN(id)) {
    console.error("ID da sala inválido:", route.params.id);
    return;
  }

  try {
    isLoading.value = true;
    const response = await api.histories.getAll({
      classroom_id: id,
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



onMounted(async () => {
  const id = Number(route.params.id);

  if (!id || isNaN(id)) {
    console.error("ID da sala inválido:", route.params.id);
    isLoading.value = false;
    return;
  }

  try {
    // Carregar dados da sala
    classroom.value = await api.classrooms.getById(id);
    await fetchHistory(1); // Carregar a primeira página do histórico

    console.log("Dados da sala carregados:", classroom.value);
    console.log("Histórico carregado:", history.value);
  } catch (error) {
    console.error("Erro ao carregar dados da sala ou histórico:", error);
    // Em caso de erro, tentar usar dados mockados como fallback
    try {
      const { getClassrooms, getHistories } = await import("@/data/classrooms");
      const classroomsData = await getClassrooms();
      const historiesData = await getHistories();

      classroom.value =
        classroomsData.find((c) => c.IDClassroom === id) || null;
      // Mocked history doesn't support pagination, so we'll just filter
      history.value = historiesData.filter((h) => h.IDClassroomFK === id);
      totalPages.value = 1; // For mocked data, assume one page
    } catch (fallbackError) {
      console.error("Erro no fallback:", fallbackError);
    }
  } finally {
    isLoading.value = false;
  }
});
</script>
