// ===========================================
// SERVIÇO DE API PARA COMUNICAÇÃO COM BACKEND
// ===========================================

import type {
  User,
  Classroom,
  History,
  Notification,
  CreateClassroomRequest,
  UpdateClassroomRequest,
  CreateHistoryRequest,
  UpdateHistoryRequest,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  ApiResponse,
  PaginatedResponse,
  UserFilters,
  ClassroomFilters,
  HistoryFilters,
  NotificationFilters,
  ClassroomStats,
  UserStats,
  HistoryStats
} from '@/types/database'

// ===========================================
// CONFIGURAÇÃO DA API
// ===========================================

const API_BASE_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // ===========================================
  // ENDPOINTS DE USUÁRIO (APENAS LEITURA)
  // ===========================================

  async getUsers(filters?: UserFilters, page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams()
    if (filters?.Course) params.append('course', filters.Course)
    if (filters?.Period) params.append('period', filters.Period)
    if (filters?.Name) params.append('name', filters.Name)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await this.request<PaginatedResponse<User>>(`/users?${params}`)
    return response.data!
  }

  async getUser(id: number): Promise<User> {
    const response = await this.request<User>(`/users/${id}`)
    return response.data!
  }

  // ===========================================
  // ENDPOINTS DE SALA (APENAS LEITURA E ALTERAÇÃO DE ESTADO/NOTA)
  // ===========================================

  async getClassrooms(filters?: ClassroomFilters, page = 1, limit = 10): Promise<PaginatedResponse<Classroom>> {
    const params = new URLSearchParams()
    if (filters?.State) params.append('state', filters.State)
    if (filters?.Responsible) params.append('responsible', filters.Responsible)
    if (filters?.Name) params.append('name', filters.Name)
    if (filters?.Capacity?.min) params.append('capacity_min', filters.Capacity.min.toString())
    if (filters?.Capacity?.max) params.append('capacity_max', filters.Capacity.max.toString())
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await this.request<PaginatedResponse<Classroom>>(`/classrooms?${params}`)
    return response.data!
  }

  async getClassroom(id: number): Promise<Classroom> {
    const response = await this.request<Classroom>(`/classrooms/${id}`)
    return response.data!
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

  // PERMITIDO - Alteração de estado das salas
  async updateClassroomState(id: number, state: Classroom['State']): Promise<Classroom> {
    const response = await this.request<Classroom>(`/classrooms/${id}/state`, {
      method: 'PATCH',
      body: JSON.stringify({ state }),
    })
    return response.data!
  }

  // PERMITIDO - Alteração da nota da secretaria
  async updateClassroomNote(id: number, secretaryNote: string): Promise<Classroom> {
    const response = await this.request<Classroom>(`/classrooms/${id}/note`, {
      method: 'PATCH',
      body: JSON.stringify({ secretaryNote }),
    })
    return response.data!
  }

  // ===========================================
  // ENDPOINTS DE HISTÓRICO
  // ===========================================

  async getHistories(filters?: HistoryFilters, page = 1, limit = 10): Promise<PaginatedResponse<History>> {
    const params = new URLSearchParams()
    if (filters?.ID_User_FK) params.append('user_id', filters.ID_User_FK.toString())
    if (filters?.ID_Classroom_FK) params.append('classroom_id', filters.ID_Classroom_FK.toString())
    if (filters?.StartDate?.from) params.append('start_date_from', filters.StartDate.from)
    if (filters?.StartDate?.to) params.append('start_date_to', filters.StartDate.to)
    if (filters?.ReturnDate?.from) params.append('return_date_from', filters.ReturnDate.from)
    if (filters?.ReturnDate?.to) params.append('return_date_to', filters.ReturnDate.to)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await this.request<PaginatedResponse<History>>(`/histories?${params}`)
    return response.data!
  }

  async getHistory(id: number): Promise<History> {
    const response = await this.request<History>(`/histories/${id}`)
    return response.data!
  }

  async createHistory(historyData: CreateHistoryRequest): Promise<History> {
    const response = await this.request<History>('/histories', {
      method: 'POST',
      body: JSON.stringify(historyData),
    })
    return response.data!
  }

  async updateHistory(id: number, historyData: UpdateHistoryRequest): Promise<History> {
    const response = await this.request<History>(`/histories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(historyData),
    })
    return response.data!
  }

  async returnClassroom(historyId: number): Promise<History> {
    const response = await this.request<History>(`/histories/${historyId}/return`, {
      method: 'PATCH',
    })
    return response.data!
  }

  // ===========================================
  // ENDPOINTS DE NOTIFICAÇÃO
  // ===========================================

  async getNotifications(filters?: NotificationFilters, page = 1, limit = 10): Promise<PaginatedResponse<Notification>> {
    const params = new URLSearchParams()
    if (filters?.ID_User_FK) params.append('user_id', filters.ID_User_FK.toString())
    if (filters?.ReadAt !== undefined) params.append('read', filters.ReadAt.toString())
    if (filters?.CreatedAt?.from) params.append('created_at_from', filters.CreatedAt.from)
    if (filters?.CreatedAt?.to) params.append('created_at_to', filters.CreatedAt.to)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await this.request<PaginatedResponse<Notification>>(`/notifications?${params}`)
    return response.data!
  }

  async getNotification(id: number): Promise<Notification> {
    const response = await this.request<Notification>(`/notifications/${id}`)
    return response.data!
  }

  async createNotification(notificationData: CreateNotificationRequest): Promise<Notification> {
    const response = await this.request<Notification>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    })
    return response.data!
  }

  async updateNotification(id: number, notificationData: UpdateNotificationRequest): Promise<Notification> {
    const response = await this.request<Notification>(`/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(notificationData),
    })
    return response.data!
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const response = await this.request<Notification>(`/notifications/${id}/read`, {
      method: 'PATCH',
    })
    return response.data!
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await this.request(`/notifications/read-all`, {
      method: 'PATCH',
      body: JSON.stringify({ user_id: userId }),
    })
  }

  // ===========================================
  // ENDPOINTS DE ESTATÍSTICAS
  // ===========================================

  async getClassroomStats(): Promise<ClassroomStats> {
    const response = await this.request<ClassroomStats>('/stats/classrooms')
    return response.data!
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.request<UserStats>('/stats/users')
    return response.data!
  }

  async getHistoryStats(): Promise<HistoryStats> {
    const response = await this.request<HistoryStats>('/stats/histories')
    return response.data!
  }

  // ===========================================
  // ENDPOINTS DE AÇÕES ESPECÍFICAS
  // ===========================================

  async borrowClassroom(userId: number, classroomId: number): Promise<History> {
    const response = await this.request<History>('/actions/borrow', {
      method: 'POST',
      body: JSON.stringify({
        ID_User_FK: userId,
        ID_Classroom_FK: classroomId,
        StartDate: new Date().toISOString(),
      }),
    })
    return response.data!
  }

  async returnClassroomByUser(userId: number, classroomId: number): Promise<History> {
    const response = await this.request<History>('/actions/return', {
      method: 'POST',
      body: JSON.stringify({
        ID_User_FK: userId,
        ID_Classroom_FK: classroomId,
        ReturnDate: new Date().toISOString(),
      }),
    })
    return response.data!
  }

  async getUserActiveBorrows(userId: number): Promise<History[]> {
    const response = await this.request<History[]>(`/users/${userId}/active-borrows`)
    return response.data!
  }

  async getClassroomCurrentUser(classroomId: number): Promise<User | null> {
    const response = await this.request<User | null>(`/classrooms/${classroomId}/current-user`)
    return response.data!
  }
}

// ===========================================
// INSTÂNCIA SINGLETON DO SERVIÇO
// ===========================================

export const apiService = new ApiService()

// ===========================================
// FUNÇÕES DE CONVENIÊNCIA
// ===========================================

export const api = {
  // Users (apenas leitura)
  users: {
    getAll: (filters?: UserFilters, page = 1, limit = 10) => apiService.getUsers(filters, page, limit),
    getById: (id: number) => apiService.getUser(id),
  },

  // Classrooms (apenas leitura e alteração de estado/nota)
  classrooms: {
    getAll: (filters?: ClassroomFilters, page = 1, limit = 10) => apiService.getClassrooms(filters, page, limit),
    getById: (id: number) => apiService.getClassroom(id),
    // FUTURA IMPLEMENTAÇÃO - Métodos comentados para implementação futura
    // create: (data: CreateClassroomRequest) => apiService.createClassroom(data),
    // update: (id: number, data: UpdateClassroomRequest) => apiService.updateClassroom(id, data),
    // delete: (id: number) => apiService.deleteClassroom(id),
    updateState: (id: number, state: Classroom['State']) => apiService.updateClassroomState(id, state),
    updateNote: (id: number, secretaryNote: string) => apiService.updateClassroomNote(id, secretaryNote),
  },

  // Histories
  histories: {
    getAll: (filters?: HistoryFilters, page = 1, limit = 10) => apiService.getHistories(filters, page, limit),
    getById: (id: number) => apiService.getHistory(id),
    create: (data: CreateHistoryRequest) => apiService.createHistory(data),
    update: (id: number, data: UpdateHistoryRequest) => apiService.updateHistory(id, data),
    return: (id: number) => apiService.returnClassroom(id),
  },

  // Notifications
  notifications: {
    getAll: (filters?: NotificationFilters, page = 1, limit = 10) => apiService.getNotifications(filters, page, limit),
    getById: (id: number) => apiService.getNotification(id),
    create: (data: CreateNotificationRequest) => apiService.createNotification(data),
    update: (id: number, data: UpdateNotificationRequest) => apiService.updateNotification(id, data),
    markAsRead: (id: number) => apiService.markNotificationAsRead(id),
    markAllAsRead: (userId: number) => apiService.markAllNotificationsAsRead(userId),
  },

  // Stats
  stats: {
    classrooms: () => apiService.getClassroomStats(),
    users: () => apiService.getUserStats(),
    histories: () => apiService.getHistoryStats(),
  },

  // Actions
  actions: {
    borrow: (userId: number, classroomId: number) => apiService.borrowClassroom(userId, classroomId),
    return: (userId: number, classroomId: number) => apiService.returnClassroomByUser(userId, classroomId),
    getUserActiveBorrows: (userId: number) => apiService.getUserActiveBorrows(userId),
    getClassroomCurrentUser: (classroomId: number) => apiService.getClassroomCurrentUser(classroomId),
  },
}
