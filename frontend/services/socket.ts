import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth";
import { useNotificationsStore } from "@/stores/notifications";
import { useClassroomsStore } from "@/stores/classrooms";

let socket: Socket | null = null;

export function useSocket() {
  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();
  const classroomsStore = useClassroomsStore();

  const connect = () => {
    if (socket || !authStore.isAuthenticated || !authStore.user) {
      return;
    }

    const runtimeConfig = useRuntimeConfig();
    const socketURL = runtimeConfig.public.apiUrl.replace("/api", ""); // Get the base URL

    socket = io(socketURL, {
      path: "/socket.io",
    });

    socket.on("connect", () => {
      console.log("🔌 Connected to WebSocket server");
      if (authStore.user) {
        socket?.emit("join", authStore.user.IDUser);
      }
    });

    socket.on("new_notification", (notification) => {
      console.log("🎉 New notification received:", notification);
      // Atualiza as notificações
      if (authStore.user) {
        notificationsStore.fetchNotifications(authStore.user.IDUser);
      }
    });

    socket.on("classroom_updated", (classroom) => {
      console.log("🔄 Classroom updated:", classroom);
      classroomsStore.updateClassroom(classroom);
    });

    socket.on("notification_approved_classroom_update", () => {
      console.log(
        "✅ Notification approved, refetching all classrooms for all users"
      );
      if (authStore.user) {
        classroomsStore.fetchClassrooms();
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket server");
    });
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  return {
    connect,
    disconnect,
  };
}
