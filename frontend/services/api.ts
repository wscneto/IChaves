// ===========================================
// SERVIÇO DE API PARA COMUNICAÇÃO COM BACKEND
// ===========================================

import type {
  User,
  Classroom,
  History,
  Notification,
  CreateHistoryRequest,
  UpdateHistoryRequest,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  ApiResponse,
  UserFilters,
  ClassroomFilters,
  HistoryFilters,
  NotificationFilters,
  ClassroomStats,
  UserStats,
  HistoryStats,
  PaginatedResponse,
} from "@/types/database";

// ===========================================
// CONFIGURAÇÃO DA API
// ===========================================

import { useAuthStore } from "~/stores/auth";
import { useErrorStore } from "~/stores/error";

const API_BASE_URL =
  process.env.NUXT_PUBLIC_API_URL || "https://ichaves-backend.onrender.com/api";

console.log("🔧 API_BASE_URL configurada como:", API_BASE_URL);
console.log("🔧 NUXT_PUBLIC_API_URL:", process.env.NUXT_PUBLIC_API_URL);

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const authStore = useAuthStore();
    const errorStore = useErrorStore();

    console.log("🚀 Fazendo requisição HTTP para:", url);
    console.log("🚀 Configuração:", options);

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authStore.token) {
      defaultHeaders["authorization"] = `Bearer ${authStore.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      console.log("📡 Status da resposta:", response.status);
      console.log(
        "📡 Headers da resposta:",
        Object.fromEntries(response.headers.entries())
      );

      const data = await response.json();
      console.log("📡 Dados da resposta:", data);

      if (!response.ok) {
        console.error("❌ Erro HTTP:", response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      console.log("✅ Requisição bem-sucedida");
      return data;
    } catch (error) {
      console.error("❌ API request failed:", error);
      const errorMessage =
        (error as Error).message || "Ocorreu um erro desconhecido.";
      errorStore.showError(errorMessage);
      authStore.logout();
      throw error;
    }
  }

  // ===========================================
  // ENDPOINTS DE USUÁRIO (APENAS LEITURA)
  // ===========================================

  async getUsers(filters?: UserFilters): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.Course) params.append("course", filters.Course);
    if (filters?.Period) params.append("period", filters.Period);
    if (filters?.Name) params.append("name", filters.Name);
    // Removido page e limit pois o backend não suporta paginação ainda

    const response = await this.request<User[]>(`/users?${params}`);
    return response.data || [];
  }

  async getUser(id: number): Promise<User> {
    const response = await this.request<User>(`/users/${id}`);
    return response.data!;
  }

  async getUserByEmail(email: string): Promise<User> {
    console.log(
      "🌐 Fazendo requisição para:",
      `/users/email?email=${encodeURIComponent(email)}`
    );
    const response = await this.request<User>(
      `/users/email?email=${encodeURIComponent(email)}`
    );
    console.log("🌐 Resposta completa da API:", response);
    console.log("🌐 Dados extraídos:", response.data);
    return response.data!;
  }

  async getMe(): Promise<User> {
    const response = await this.request<User>("/auth/me");
    return response.data!;
  }

  async logout(): Promise<void> {
    await this.request<void>("/auth/logout", {
      method: "POST",
    });
  }

  // ===========================================
  // ENDPOINTS DE SALA (APENAS LEITURA E ALTERAÇÃO DE ESTADO/NOTA)
  // ===========================================

  async getClassrooms(filters?: ClassroomFilters): Promise<Classroom[]> {
    const params = new URLSearchParams();
    if (filters?.State) params.append("state", filters.State);
    if (filters?.NameResponsible)
      params.append("name_responsible", filters.NameResponsible);
    if (filters?.IDResponsible)
      params.append("id_responsible", filters.IDResponsible.toString());
    if (filters?.Name) params.append("name", filters.Name);
    if (filters?.Capacity?.min)
      params.append("capacity_min", filters.Capacity.min.toString());
    if (filters?.Capacity?.max)
      params.append("capacity_max", filters.Capacity.max.toString());
    // Removido page e limit pois o backend não suporta paginação ainda

    const response = await this.request<Classroom[]>(`/classrooms?${params}`);
    return response.data || [];
  }

  async getClassroom(id: number): Promise<Classroom> {
    const response = await this.request<Classroom>(`/classrooms/${id}`);
    return response.data!;
  }

  // FUTURA IMPLEMENTAÇÃO - Criação de salas
  // async createClassroom(classroomData: CreateClassroomRequest): Promise<Classroom> {
  //   const response = await this.request<Classroom>('/classrooms', {
  //     method: 'POST',
  //     body: JSON.stringify(classroomData),
  //   })
  //   return response.data!
  // }

  // FUTURA IMPLEMENTAÇÃO - Atualização completa de salas
  // async updateClassroom(id: number, classroomData: UpdateClassroomRequest): Promise<Classroom> {
  //   const response = await this.request<Classroom>(`/classrooms/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(classroomData),
  //   })
  //   return response.data!
  // }

  // FUTURA IMPLEMENTAÇÃO - Exclusão de salas
  // async deleteClassroom(id: number): Promise<void> {
  //   await this.request(`/classrooms/${id}`, {
  //     method: 'DELETE',
  //   })
  // }

  // ===========================================
  // ENDPOINTS DE HISTÓRICO
  // ===========================================

  async getHistories(
    filters?: HistoryFilters
  ): Promise<PaginatedResponse<History>> {
    const params = new URLSearchParams();
    if (filters?.user_id) params.append("user_id", filters.user_id.toString());
    if (filters?.classroom_id)
      params.append("classroom_id", filters.classroom_id.toString());
    if (filters?.start_date_from)
      params.append("start_date_from", filters.start_date_from);
    if (filters?.start_date_to)
      params.append("start_date_to", filters.start_date_to);
    if (filters?.return_date_from)
      params.append("return_date_from", filters.return_date_from);
    if (filters?.return_date_to)
      params.append("return_date_to", filters.return_date_to);
    if (filters?.is_active !== undefined)
      params.append("is_active", filters.is_active.toString());
    if (filters?.sort_by) params.append("sort_by", filters.sort_by);
    if (filters?.sort_order) params.append("sort_order", filters.sort_order);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await this.request<PaginatedResponse<History>>(
      `/histories?${params}`
    );
    return response;
  }

  async getHistory(id: number): Promise<History> {
    const response = await this.request<History>(`/histories/${id}`);
    return response.data!;
  }

  async createHistory(historyData: CreateHistoryRequest): Promise<History> {
    const response = await this.request<History>("/histories", {
      method: "POST",
      body: JSON.stringify(historyData),
    });
    return response.data!;
  }

  async updateHistory(
    id: number,
    historyData: UpdateHistoryRequest
  ): Promise<History> {
    const response = await this.request<History>(`/histories/${id}`, {
      method: "PUT",
      body: JSON.stringify(historyData),
    });
    return response.data!;
  }

  async returnClassroom(historyId: number): Promise<History> {
    const response = await this.request<History>(
      `/histories/${historyId}/return`,
      {
        method: "PATCH",
      }
    );
    return response.data!;
  }

  // ===========================================
  // ENDPOINTS DE NOTIFICAÇÃO
  // ===========================================

  async getNotifications(
    filters?: NotificationFilters
  ): Promise<Notification[]> {
    // Se tem filtro de usuário, usar o endpoint específico
    if (filters?.IDUserFK) {
      const response = await this.request<Notification[]>(
        `/notifications/user/${filters.IDUserFK}`
      );
      return response.data || [];
    }

    // Caso contrário, usar o endpoint geral
    const params = new URLSearchParams();
    if (filters?.ReadAt !== undefined)
      params.append("read", filters.ReadAt.toString());
    if (filters?.CreatedAt?.from)
      params.append("created_at_from", filters.CreatedAt.from);
    if (filters?.CreatedAt?.to)
      params.append("created_at_to", filters.CreatedAt.to);

    const response = await this.request<Notification[]>(
      `/notifications?${params}`
    );
    return response.data || [];
  }

  async getNotification(id: number): Promise<Notification> {
    const response = await this.request<Notification>(`/notifications/${id}`);
    return response.data!;
  }

  async createNotification(
    notificationData: CreateNotificationRequest
  ): Promise<Notification> {
    const response = await this.request<Notification>("/notifications", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
    return response.data!;
  }

  async updateNotification(
    id: number,
    notificationData: UpdateNotificationRequest
  ): Promise<Notification> {
    const response = await this.request<Notification>(`/notifications/${id}`, {
      method: "PUT",
      body: JSON.stringify(notificationData),
    });
    return response.data!;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const response = await this.request<Notification>(
      `/notifications/${id}/read`,
      {
        method: "PATCH",
      }
    );
    return response.data!;
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await this.request(`/notifications/read-all`, {
      method: "PATCH",
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // ===========================================
  // ENDPOINTS DE ESTATÍSTICAS
  // ===========================================

  async getClassroomStats(): Promise<ClassroomStats> {
    const response = await this.request<ClassroomStats>("/stats/classrooms");
    return response.data!;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.request<UserStats>("/stats/users");
    return response.data!;
  }

  async getHistoryStats(): Promise<HistoryStats> {
    const response = await this.request<HistoryStats>("/stats/histories");
    return response.data!;
  }

  // ===========================================
  // ENDPOINTS DE AÇÕES ESPECÍFICAS
  // ===========================================

  async borrowClassroom(userId: number, classroomId: number): Promise<History> {
    const response = await this.request<History>("/actions/reservar", {
      method: "POST",
      body: JSON.stringify({
        IDUserFK: userId,
        IDClassroomFK: classroomId,
        TargetUserID: userId, // Campo obrigatório para reservar
        StartDate: new Date().toISOString(),
      }),
    });
    return response.data!;
  }

  async returnClassroomByUser(
    userId: number,
    classroomId: number
  ): Promise<History> {
    const response = await this.request<History>("/actions/trocar", {
      method: "POST",
      body: JSON.stringify({
        IDUserFK: userId,
        IDClassroomFK: classroomId,
        ReturnDate: new Date().toISOString(),
      }),
    });
    return response.data!;
  }

  async devolveClassroomByUser(
    userId: number,
    classroomId: number
  ): Promise<History> {
    const response = await this.request<History>("/actions/devolver", {
      method: "POST",
      body: JSON.stringify({
        IDUserFK: userId,
        IDClassroomFK: classroomId,
        ReturnDate: new Date().toISOString(),
      }),
    });
    return response.data!;
  }

  async getUserActiveBorrows(userId: number): Promise<History[]> {
    const response = await this.request<History[]>(
      `/users/${userId}/active-borrows`
    );
    return response.data!;
  }

  async processReservationRequest(
    notificationId: number,
    approved: boolean
  ): Promise<History> {
    const response = await this.request<History>(
      "/actions/process-reservation",
      {
        method: "POST",
        body: JSON.stringify({
          notificationId,
          approved,
        }),
      }
    );
    return response.data!;
  }

  async processDevolutionRequest(
    notificationId: number,
    confirmed: boolean
  ): Promise<History> {
    const response = await this.request<History>(
      "/actions/process-devolution",
      {
        method: "POST",
        body: JSON.stringify({
          notificationId,
          confirmed,
        }),
      }
    );
    return response.data!;
  }

  async processKeyRequest(
    notificationId: number,
    confirmed: boolean
  ): Promise<History> {
    const response = await this.request<History>(
      "/actions/process-key-request",
      {
        method: "POST",
        body: JSON.stringify({
          notificationId,
          confirmed,
        }),
      }
    );
    return response.data!;
  }

  async processTradeRequest(
    notificationId: number,
    accepted: boolean
  ): Promise<History> {
    const response = await this.request<History>("/actions/process-trade", {
      method: "POST",
      body: JSON.stringify({
        notificationId,
        accepted,
      }),
    });
    return response.data!;
  }

  // Ações administrativas
  async requestClassroom(
    userId: number,
    classroomId: number
  ): Promise<History> {
    const response = await this.request<History>("/actions/solicitar", {
      method: "POST",
      body: JSON.stringify({
        IDClassroomFK: classroomId,
        userID: userId,
        userRole: "admin",
      }),
    });
    return response.data!;
  }

  async suspendClassroom(
    classroomId: number,
    reason: string = "Suspensão administrativa"
  ): Promise<Classroom> {
    const response = await this.request<Classroom>("/actions/suspender", {
      method: "POST",
      body: JSON.stringify({
        IDClassroomFK: classroomId,
        Reason: reason,
      }),
    });
    return response.data!;
  }

  async releaseClassroom(
    classroomId: number,
    reason: string
  ): Promise<Classroom> {
    const response = await this.request<Classroom>("/actions/liberar", {
      method: "POST",
      body: JSON.stringify({
        IDClassroomFK: classroomId,
        Reason: reason,
      }),
    });
    return response.data!;
  }
}

// ===========================================
// INSTÂNCIA SINGLETON DO SERVIÇO
// ===========================================

export const apiService = new ApiService();

// ===========================================
// FUNÇÕES DE CONVENIÊNCIA
// ===========================================

export const api = {
  // Users (apenas leitura)
  users: {
    getAll: (filters?: UserFilters) => apiService.getUsers(filters),
    getById: (id: number) => apiService.getUser(id),
    getByEmail: (email: string) => apiService.getUserByEmail(email),
    getMe: () => apiService.getMe(),
  },

  auth: {
    logout: () => apiService.logout(),
  },

  // Classrooms (apenas leitura)
  classrooms: {
    getAll: (filters?: ClassroomFilters) => apiService.getClassrooms(filters),
    getById: (id: number) => apiService.getClassroom(id),
    // FUTURA IMPLEMENTAÇÃO - Métodos comentados para implementação futura
    // create: (data: CreateClassroomRequest) => apiService.createClassroom(data),
    // update: (id: number, data: UpdateClassroomRequest) => apiService.updateClassroom(id, data),
    // delete: (id: number) => apiService.deleteClassroom(id),
  },

  // Histories
  histories: {
    getAll: (filters?: HistoryFilters) => apiService.getHistories(filters),
    getById: (id: number) => apiService.getHistory(id),
    create: (data: CreateHistoryRequest) => apiService.createHistory(data),
    update: (id: number, data: UpdateHistoryRequest) =>
      apiService.updateHistory(id, data),
    return: (id: number) => apiService.returnClassroom(id),
  },

  // Notifications
  notifications: {
    getAll: (filters?: NotificationFilters) =>
      apiService.getNotifications(filters),
    getById: (id: number) => apiService.getNotification(id),
    create: (data: CreateNotificationRequest) =>
      apiService.createNotification(data),
    update: (id: number, data: UpdateNotificationRequest) =>
      apiService.updateNotification(id, data),
    markAsRead: (id: number) => apiService.markNotificationAsRead(id),
    markAllAsRead: (userId: number) =>
      apiService.markAllNotificationsAsRead(userId),
  },

  // Stats
  stats: {
    classrooms: () => apiService.getClassroomStats(),
    users: () => apiService.getUserStats(),
    histories: () => apiService.getHistoryStats(),
  },

  // Actions
  actions: {
    borrow: (userId: number, classroomId: number) =>
      apiService.borrowClassroom(userId, classroomId),
    return: (userId: number, classroomId: number) =>
      apiService.returnClassroomByUser(userId, classroomId),
    devolve: (userId: number, classroomId: number) =>
      apiService.devolveClassroomByUser(userId, classroomId),
    request: (userId: number, classroomId: number) =>
      apiService.requestClassroom(userId, classroomId),
    suspend: (classroomId: number, reason?: string) =>
      apiService.suspendClassroom(classroomId, reason),
    release: (classroomId: number, reason: string) =>
      apiService.releaseClassroom(classroomId, reason),
    getUserActiveBorrows: (userId: number) =>
      apiService.getUserActiveBorrows(userId),
    processReservation: (notificationId: number, approved: boolean) =>
      apiService.processReservationRequest(notificationId, approved),
    processDevolution: (notificationId: number, confirmed: boolean) =>
      apiService.processDevolutionRequest(notificationId, confirmed),
    processKeyRequest: (notificationId: number, confirmed: boolean) =>
      apiService.processKeyRequest(notificationId, confirmed),
    processTrade: (notificationId: number, accepted: boolean) =>
      apiService.processTradeRequest(notificationId, accepted),
  },
};
