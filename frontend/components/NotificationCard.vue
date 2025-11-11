<template>
  <div>
    <div
      v-if="show"
      class="flex flex-col absolute mt-2 bg-white rounded-2xl shadow-lg p-4 z-50 max-w w-96 right-0 left-auto max-h-96 overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-lg font-bold">
          {{ showRead ? "Notificações Lidas" : "Notificações" }}
        </h2>
        <button
          @click="showRead = !showRead"
          class="text-sm text-blue-500 hover:underline"
        >
          {{ showRead ? "Ver não lidas" : "Ver lidas" }}
        </button>
      </div>

      <div v-if="notificationsStore.isLoading" class="text-center py-4">
        <p class="text-gray-500">Carregando...</p>
      </div>

      <!-- Lista de Notificações -->
      <div v-else>
        <!-- Notificações Não Lidas -->
        <ul
          v-if="!showRead && notificationsStore.hasNotifications"
          class="space-y-2"
        >
          <li
            v-for="notification in notificationsStore.unreadNotifications"
            :key="notification.IDNotification"
            class="p-3 bg-gray-100 rounded-lg"
          >
            <div class="flex flex-col gap-2">
              <span class="flex-1 text-sm">
                {{ getNotificationText(notification) }}
              </span>
              <div v-if="needsAdminAction(notification)" class="flex mt-2">
                <button
                  class="w-full px-4 py-1.5 text-sm rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                  @click="openNotificationModal(notification)"
                >
                  Responder
                </button>
              </div>
            </div>
          </li>
        </ul>
        <!-- Notificações Lidas -->
        <ul
          v-else-if="
            showRead && notificationsStore.readNotifications.length > 0 // Agora esta linha funciona
          "
          class="space-y-2"
        >
          <li
            v-for="notification in notificationsStore.readNotifications"
            :key="notification.IDNotification"
            class="p-3 bg-gray-50 rounded-lg"
          >
            <span class="flex-1 text-sm text-gray-500">
              {{ getNotificationText(notification) }}
            </span>
          </li>
        </ul>
        <!-- Mensagem de Nenhuma Notificação -->
        <p v-else class="text-gray-500 text-center py-4">
          {{ showRead ? "Nenhuma notificação lida" : "Nenhuma notificação" }}
        </p>
      </div>
    </div>

    <!-- Notification Modal -->
    <NotificationModal
      :show="isModalOpen"
      :message="modalMessage"
      :show-actions="modalNeedsAction"
      @close="closeModalAndMarkAsRead"
      @action="handleModalAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useNotificationsStore } from "@/stores/notifications";
import { useClassroomsStore } from "@/stores/classrooms"; // Importar a store de salas
import { useAuthStore } from "@/stores/auth";
import { api } from "@/services/api";
import type { Notification } from "@/types/database";
import ConfirmPopUp from "./ConfirmPopUp.vue";
import NotificationModal from "./NotificationModal.vue";

const props = defineProps<{ show: boolean }>();
const notificationsStore = useNotificationsStore();
const classroomsStore = useClassroomsStore(); // Instanciar a store
const authStore = useAuthStore();

const isModalOpen = ref(false);
const modalMessage = ref("");
const modalNeedsAction = ref(false);
const currentNotificationInModal = ref<Notification | null>(null);
const shownModalIds = new Set<number>();
const showRead = ref(false); // Estado para controlar a visualização de notificações lidas

// State for confirmation popup
const isConfirmOpen = ref(false);
const confirmTitle = ref("");
const confirmSubtitle = ref("");
const confirmMessage = ref("");
const showConfirmInput = ref(false);
let onConfirmAction: (() => void) | null = null;

watch(
  () => notificationsStore.unreadNotifications,
  (newNotifications) => {
    if (isModalOpen.value) return; // Don't show new modal if one is already open

    const latestNotification = newNotifications.find(
      (n) => !shownModalIds.has(n.IDNotification)
    );

    if (latestNotification) {
      currentNotificationInModal.value = latestNotification;
      modalMessage.value = getNotificationText(latestNotification);
      modalNeedsAction.value = needsAdminAction(latestNotification);
      isModalOpen.value = true;
      shownModalIds.add(latestNotification.IDNotification);
    }
  },
  { deep: true }
);

function getNotificationText(notification: Notification): string {
  const parsed = notificationsStore.parseNotificationMessage(notification);

  if (parsed.type === "reservation_request") {
    return `${parsed.studentName} pediu a chave da sala ${parsed.classroomName}`;
  } else if (parsed.type === "reservation_approved") {
    return `Sua solicitação para ${parsed.classroomName} foi aprovada!`;
  } else if (parsed.type === "reservation_rejected") {
    return `Sua solicitação para ${parsed.classroomName} foi rejeitada.`;
  } else if (parsed.type === "devolution_request") {
    return `${parsed.studentName} devolveu a chave da sala ${parsed.classroomName}`;
  } else if (parsed.type === "devolution_confirmed") {
    return `Sua devolução da sala ${parsed.classroomName} foi confirmada!`;
  } else if (parsed.type === "devolution_rejected") {
    return `Sua devolução da sala ${parsed.classroomName} não foi confirmada.`;
  } else if (parsed.type === "trade_request") {
    return `${parsed.requestingStudentName} quer trocar a chave da sala ${parsed.classroomName} com você`;
  } else if (parsed.type === "trade_accepted") {
    return `Sua solicitação de troca da sala ${parsed.classroomName} foi aceita!`;
  } else if (parsed.type === "trade_rejected") {
    return `Sua solicitação de troca da sala ${parsed.classroomName} foi rejeitada.`;
  } else if (parsed.type === "request_key") {
    return `${parsed.adminName} solicitou a chave da sala ${parsed.classroomName}`;
  } else if (parsed.type === "key_request_confirmed") {
    return `Sua solicitação de chave da sala ${parsed.classroomName} foi confirmada!`;
  } else if (parsed.type === "key_request_rejected") {
    return `Sua solicitação de chave da sala ${parsed.classroomName} foi rejeitada.`;
  }

  return parsed.message || notification.Message;
}

function needsAdminAction(notification: Notification): boolean {
  const parsed = notificationsStore.parseNotificationMessage(notification);
  // Admin actions
  if (
    (parsed.type === "reservation_request" ||
      parsed.type === "devolution_request") &&
    authStore.userRole === "admin"
  ) {
    return true;
  }
  // Student trade actions
  if (parsed.type === "trade_request") {
    return true;
  }
  // Student key request actions
  if (parsed.type === "request_key") {
    return true;
  }
  return false;
}

function openNotificationModal(notification: Notification) {
  currentNotificationInModal.value = notification;
  modalMessage.value = getNotificationText(notification);
  modalNeedsAction.value = needsAdminAction(notification);
  isModalOpen.value = true;
}

async function handleModalAction(approved: boolean) {
  if (currentNotificationInModal.value) {
    await handleAdminAction(currentNotificationInModal.value, approved);
  }
  isModalOpen.value = false;
}

async function closeModalAndMarkAsRead() {
  isModalOpen.value = false;
  if (currentNotificationInModal.value) {
    // Só marca como lida se a notificação NÃO precisar de uma ação do usuário.
    if (!needsAdminAction(currentNotificationInModal.value)) {
      console.log(
        "Tentando marcar notificação informativa como lida:",
        currentNotificationInModal.value.IDNotification
      );
      try {
        await notificationsStore.markAsRead(
          currentNotificationInModal.value.IDNotification
        );
        console.log(
          "Notificação marcada como lida com sucesso:",
          currentNotificationInModal.value.IDNotification
        );
        if (authStore.user) {
          await notificationsStore.fetchNotifications(authStore.user.IDUser);
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    } else {
      console.log(
        "Modal fechado sem marcar como lida (requer ação do usuário):",
        currentNotificationInModal.value.IDNotification
      );
    }
  } else {
    console.warn("Nenhuma notificação atual no modal para marcar como lida.");
  }
}

function onConfirm() {
  if (onConfirmAction) onConfirmAction();
  isConfirmOpen.value = false;
}

async function handleAdminAction(
  notification: Notification,
  approved: boolean
) {
  const parsed = notificationsStore.parseNotificationMessage(notification);

  try {
    if (parsed.type === "reservation_request") {
      await api.actions.processReservation(
        notification.IDNotification,
        approved
      );
      confirmTitle.value = approved ? "Reserva Aprovada" : "Reserva Rejeitada";
      confirmMessage.value = approved
        ? "A reserva foi aprovada com sucesso!"
        : "A reserva foi rejeitada.";
      isConfirmOpen.value = true;
      onConfirmAction = () => {
        isConfirmOpen.value = false;
      };
    } else if (parsed.type === "devolution_request") {
      await api.actions.processDevolution(
        notification.IDNotification,
        approved
      );
      confirmTitle.value = approved
        ? "Devolução Confirmada"
        : "Devolução Rejeitada";
      confirmMessage.value = approved
        ? "A devolução da chave foi confirmada com sucesso!"
        : "A devolução da chave não foi confirmada.";
      isConfirmOpen.value = true;
      onConfirmAction = () => {
        isConfirmOpen.value = false;
      };
    } else if (parsed.type === "trade_request") {
      await api.actions.processTrade(notification.IDNotification, approved);
      confirmTitle.value = approved ? "Troca Aceita" : "Troca Rejeitada";
      confirmMessage.value = approved
        ? "A solicitação de troca foi aceita com sucesso!"
        : "A solicitação de troca foi rejeitada.";
      isConfirmOpen.value = true;
      onConfirmAction = () => {
        isConfirmOpen.value = false;
      };
    } else if (parsed.type === "request_key") {
      await api.actions.processKeyRequest(
        notification.IDNotification,
        approved
      );
      confirmTitle.value = approved
        ? "Solicitação Aceita"
        : "Solicitação Rejeitada";
      confirmMessage.value = approved
        ? "A solicitação de chave foi aceita."
        : "A solicitação de chave foi rejeitada.";
      isConfirmOpen.value = true;
      onConfirmAction = () => {
        isConfirmOpen.value = false;
      };
    }

    await notificationsStore.markAsRead(notification.IDNotification);

    // ATUALIZA O ESTADO DAS SALAS
    await classroomsStore.fetchClassrooms();

    // Refresh notifications to update the list
    if (authStore.user) {
      await notificationsStore.fetchNotifications(authStore.user.IDUser);
    }
  } catch (error) {
    console.error("Error processing notification:", error);
    confirmTitle.value = "Erro na Operação";
    confirmMessage.value =
      "Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.";
    onConfirmAction = () => {
      isConfirmOpen.value = false;
    };
    isConfirmOpen.value = true;
  }
}
</script>

<style scoped>
/* Adicionando o componente de confirmação que estava faltando */
.confirm-popup-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100; /* Garante que o popup de confirmação fique sobre o modal de notificação */
}
</style>
