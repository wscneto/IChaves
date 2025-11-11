<template>
  <div class="flex flex-col bg-gray-50">
    <!-- Search Input -->
    <div class="p-4">
      <div v-if="classroomsStore.isLoading" class="animate-pulse">
        <div class="h-12 bg-gray-200 rounded-xl" />
      </div>
      <input
        v-else
        v-model="searchQuery"
        type="text"
        placeholder="Busque uma sala..."
        class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-funnel-sans"
      />
    </div>

    <!-- Loading Message -->
    <div v-if="classroomsStore.isLoading" class="px-4 pb-2">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-48" />
      </div>
    </div>

    <!-- Classrooms Grid -->
    <main class="flex-1 p-4">
      <!-- Loading State -->
      <div
        v-if="classroomsStore.isLoading"
        class="grid grid-cols-1 xl:grid-cols-2 gap-5"
      >
        <ClassroomItemSkeleton v-for="n in 8" :key="n" />
      </div>

      <!-- Classrooms Content -->
      <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ClassroomItem
          v-for="classroom in filteredClassrooms"
          :key="classroom.IDClassroom"
          :classroom="classroom"
          :user-role="authStore.userRole || 'student'"
          :is-loading="actionLoading === classroom.IDClassroom"
          @click="goToClassroom"
          @action="handleClassroomAction"
        />
      </div>

      <!-- Empty State -->
      <div
        v-if="!classroomsStore.isLoading && filteredClassrooms.length === 0"
        class="text-center py-12"
      >
        <div class="text-gray-500 text-lg font-funnel-sans">
          Nenhuma sala encontrada
        </div>
        <div class="text-gray-400 text-sm mt-2">Tente ajustar sua busca</div>
      </div>
    </main>

    <!-- Confirmation Popup -->
    <ConfirmPopUp
      :show="isConfirmOpen"
      :title="confirmTitle"
      :subtitle="confirmSubtitle"
      :message="confirmMessage"
      :show-input="showInput"
      :is-info="isInfoPopup"
      :input-label="inputLabel"
      :input-placeholder="inputPlaceholder"
      @confirm="onConfirm"
      @ok="isConfirmOpen = false"
      @cancel="isConfirmOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { Classroom } from "@/types/database";
import ConfirmPopUp from "@/components/ConfirmPopUp.vue";
import ClassroomItem from "@/components/ClassroomItem.vue";
import ClassroomItemSkeleton from "@/components/ClassroomItemSkeleton.vue";
import { useAuthStore } from "@/stores/auth";
import {
  borrowClassroom,
  devolveClassroom,
  suspendClassroom,
  releaseClassroom,
} from "@/data/classrooms";
import { api } from "@/services/api";

import { useClassroomsStore } from "@/stores/classrooms";

useHead({
  title: "IChaves - Gestão de Salas de Aula",
  meta: [
    {
      name: "description",
      content:
        "Encontre e gerencie salas de aula no Instituto de Computação da UFAL. Veja a disponibilidade, reserve e acompanhe o histórico de uso.",
    },
  ],
});

const router = useRouter();
const authStore = useAuthStore();
const classroomsStore = useClassroomsStore();
const searchQuery = ref("");

// State for confirmation popup
const isConfirmOpen = ref(false);
const confirmTitle = ref("");
const confirmSubtitle = ref("");
const confirmMessage = ref("");
const showInput = ref(false);
const isInfoPopup = ref(false);
const inputLabel = ref("");
const inputPlaceholder = ref("");
let onConfirmAction: ((value?: string) => void) | null = null;

// Classrooms data
const actionLoading = ref<number | null>(null); // ID da sala que está sendo processada

const filteredClassrooms = computed(() =>
  classroomsStore.classrooms
    .filter((classroom) =>
      classroom.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => a.Name.localeCompare(b.Name))
);

// Load classrooms on mount
onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "https://pisic.vercel.app/";
    return;
  }
  await classroomsStore.fetchClassrooms();
});

const goToClassroom = (classroom: Classroom) => {
  router.push(`/classrooms/${classroom.IDClassroom}`);
};

const openConfirmPopup = (
  title: string,
  subtitle: string,
  message: string,
  action: (value?: string) => void,
  inputConfig?: { label: string; placeholder: string },
  isInfo = false
) => {
  confirmTitle.value = title;
  confirmSubtitle.value = subtitle;
  confirmMessage.value = message;
  onConfirmAction = action;
  showInput.value = !!inputConfig;
  isInfoPopup.value = isInfo;
  inputLabel.value = inputConfig?.label || "";
  inputPlaceholder.value = inputConfig?.placeholder || "";
  isConfirmOpen.value = true;
};

const showInfoPopup = (title: string, message: string) => {
  // Usa o openConfirmPopup para mostrar uma informação, com o modo 'isInfo' ativado.
  openConfirmPopup(title, "", message, () => {}, undefined, true);
};

const onConfirm = (value?: string) => {
  if (onConfirmAction) {
    onConfirmAction(value);
  }
  isConfirmOpen.value = false;
  onConfirmAction = null;
  isInfoPopup.value = false; // Reset a flag
};

const handleClassroomAction = async (action: string, classroom: Classroom) => {
  // Verificar se o usuário está autenticado
  if (!authStore.isAuthenticated || !authStore.user) {
    showInfoPopup(
      "Ação Requerida",
      "Você precisa fazer login para realizar esta ação."
    );
    return;
  }

  const userId = authStore.user.IDUser;

  switch (action) {
    case "reservar":
      openConfirmPopup(
        classroom.Name,
        classroom.Description,
        `Deseja enviar um pedido de <strong>reserva</strong> para o <strong>administrador</strong>?`,
        async () => {
          try {
            actionLoading.value = classroom.IDClassroom;
            // Request reservation - this now creates a notification for admin approval
            await borrowClassroom(userId, classroom.IDClassroom);
            await classroomsStore.fetchClassrooms(); // ATUALIZA O ESTADO

            showInfoPopup(
              "Solicitação Enviada",
              "Sua solicitação de reserva foi enviada! Aguarde a aprovação do administrador."
            );
          } catch (error) {
            console.error("Erro ao reservar sala:", error);
            showInfoPopup(
              "Erro",
              "Ocorreu um erro ao solicitar a reserva. Por favor, tente novamente."
            );
          } finally {
            actionLoading.value = null;
          }
        }
      );
      break;

    case "trocar":
      openConfirmPopup(
        classroom.Name,
        classroom.Description,
        `Deseja enviar um pedido de <strong>troca</strong> para <strong>${classroom.NameResponsible}</strong>?`,
        async () => {
          try {
            actionLoading.value = classroom.IDClassroom;
            // Request trade - this now creates a notification for the current key holder
            await api.actions.return(userId, classroom.IDClassroom);
            await classroomsStore.fetchClassrooms(); // ATUALIZA O ESTADO

            showInfoPopup(
              "Solicitação Enviada",
              "Sua solicitação de troca foi enviada! Aguarde a resposta do usuário que tem a chave."
            );
          } catch (error) {
            console.error("Erro ao trocar sala:", error);
            showInfoPopup(
              "Erro",
              "Ocorreu um erro ao solicitar a troca. Por favor, tente novamente."
            );
          } finally {
            actionLoading.value = null;
          }
        }
      );
      break;

    case "devolver":
      openConfirmPopup(
        classroom.Name,
        classroom.Description,
        `Deseja enviar um pedido de <strong>devolução</strong> para a <strong>Secretaria</strong>?`,
        async () => {
          try {
            actionLoading.value = classroom.IDClassroom;
            // Request devolution - this now creates a notification for admin confirmation
            await devolveClassroom(userId, classroom.IDClassroom);
            await classroomsStore.fetchClassrooms(); // ATUALIZA O ESTADO

            showInfoPopup(
              "Solicitação Enviada",
              "Sua solicitação de devolução foi enviada! Aguarde a confirmação do administrador."
            );
          } catch (error) {
            console.error("Erro ao devolver sala:", error);
            showInfoPopup(
              "Erro",
              "Ocorreu um erro ao solicitar a devolução. Por favor, tente novamente."
            );
          } finally {
            actionLoading.value = null;
          }
        }
      );
      break;

    case "solicitar":
      openConfirmPopup(
        classroom.Name,
        classroom.Description,
        `Deseja enviar um pedido de <strong>solicitação</strong> para <strong>${classroom.NameResponsible}</strong>?`,
        async () => {
          try {
            actionLoading.value = classroom.IDClassroom;
            // Request key from student - this now creates a notification for the student
            await api.actions.request(userId, classroom.IDClassroom);
            await classroomsStore.fetchClassrooms(); // ATUALIZA O ESTADO

            showInfoPopup(
              "Solicitação Enviada",
              "Sua solicitação de chave foi enviada! Aguarde a resposta do aluno."
            );
          } catch (error) {
            console.error("Erro ao solicitar sala:", error);
            showInfoPopup(
              "Erro",
              "Ocorreu um erro ao solicitar a sala. Por favor, tente novamente."
            );
          } finally {
            actionLoading.value = null;
          }
        }
      );
      break;

    case "suspender":
      openConfirmPopup(
        classroom.Name,
        classroom.Description,
        `Você tem certeza que deseja suspender a sala <strong>${classroom.Name}</strong>?`,
        async (reason) => {
          try {
            actionLoading.value = classroom.IDClassroom;
            // Usar a API real para suspender a sala
            await suspendClassroom(
              classroom.IDClassroom,
              reason || "Suspensão administrativa"
            );
            await classroomsStore.fetchClassrooms(); // ATUALIZA O ESTADO
            showInfoPopup("Sucesso", "A sala foi suspensa com sucesso!");
          } catch (error) {
            console.error("Erro ao suspender sala:", error);
            showInfoPopup(
              "Erro",
              "Ocorreu um erro ao suspender a sala. Por favor, tente novamente."
            );
          } finally {
            actionLoading.value = null;
          }
        },
        {
          label: "Motivo da suspensão:",
          placeholder: "Digite o motivo da suspensão...",
        }
      );
      break;

    case "liberar":
      openConfirmPopup(
        classroom.Name,
        classroom.Description,
        `Você tem certeza que deseja liberar a sala <strong>${classroom.Name}</strong>?`,
        async (reason) => {
          try {
            actionLoading.value = classroom.IDClassroom;
            // Usar a API real para liberar a sala
            await releaseClassroom(
              classroom.IDClassroom,
              reason || "Liberação administrativa"
            );
            await classroomsStore.fetchClassrooms(); // ATUALIZA O ESTADO
            showInfoPopup("Sucesso", "A sala foi liberada com sucesso!");
          } catch (error) {
            console.error("Erro ao liberar sala:", error);
            showInfoPopup(
              "Erro",
              "Ocorreu um erro ao liberar a sala. Por favor, tente novamente."
            );
          } finally {
            actionLoading.value = null;
          }
        },
        {
          label: "Motivo da liberação:",
          placeholder: "Digite o motivo da liberação...",
        }
      );
      break;

    default:
      console.warn("Ação não reconhecida:", action);
  }
};
</script>

<style scoped>
.font-funnel-sans {
  font-family: "Funnel Sans", sans-serif;
}
</style>
