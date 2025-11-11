import { defineStore } from "pinia";
import { api } from "@/services/api";
import type { Notification } from "@/types/database";

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  error: any | null;
}

export const useNotificationsStore = defineStore("notifications", {
  state: (): NotificationsState => ({
    notifications: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    // Getter para notificações não lidas
    unreadNotifications(state): Notification[] {
      return state.notifications.filter((n) => !n.ReadAt);
    },

    // Getter para notificações lidas (CORRIGE O ERRO)
    readNotifications(state): Notification[] {
      return state.notifications.filter((n) => !!n.ReadAt);
    },

    // Getter para verificar se existem notificações não lidas
    hasNotifications(state): boolean {
      return this.unreadNotifications.length > 0;
    },
  },

  actions: {
    async fetchNotifications(userId: number) {
      this.isLoading = true;
      this.error = null;
      try {
        // Supondo que a API retorne todas as notificações do usuário
        const response = await api.notifications.getAll({ IDUserFK: userId });
        this.notifications = response.sort(
          (a, b) =>
            new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );
      } catch (error) {
        this.error = error;
        console.error("Error fetching notifications:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async markAsRead(notificationId: number) {
      try {
        await api.notifications.markAsRead(notificationId);
        const notification = this.notifications.find(
          (n) => n.IDNotification === notificationId
        );
        if (notification) {
          notification.ReadAt = new Date().toISOString();
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error; // Re-throw para que o componente possa lidar com isso
      }
    },

    parseNotificationMessage(notification: Notification) {
      try {
        // Tenta analisar a mensagem como JSON
        return JSON.parse(notification.Message);
      } catch (e) {
        // Se falhar, retorna um objeto com a mensagem original
        return { message: notification.Message };
      }
    },
  },
});
