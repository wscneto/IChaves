// ===========================================
// TIPOS BASEADOS NO ESQUEMA DO BANCO DE DADOS
// ===========================================

export interface User {
  IDUser: number
  Name: string
  Email: string
  ImageProfile?: string // BLOB convertido para base64 string
  // Relacionamentos
  Student?: {
    Course: string
    Period: string
  }
  Admin?: Record<string, never> // Admin não tem campos extras além da relação
}

export interface Classroom {
  IDClassroom: number
  Name: string
  Responsible: string
  Description: string
  State: 'Disponivel' | 'Em uso' | 'Indisponivel'
  SecretaryNote?: string
  Equipment: string
  Capacity: number
}

export interface History {
  IDHistory: number
  StartDate: string // ISO date string
  ReturnDate?: string // ISO date string (null se ainda não foi devolvido)
  IDUserFK: number
  IDClassroomFK: number
  // Relacionamentos (populados pela API)
  User?: User
  Classroom?: Classroom
}

export interface Notification {
  IDNotification: number
  Message: string
  CreatedAt: string // ISO date string
  ReadAt?: string // ISO date string (null se ainda não foi lida)
  IDUserFK: number
  // Relacionamentos (populados pela API)
  User?: User
}

// ===========================================
// TIPOS PARA REQUISIÇÕES DA API
// ===========================================

// Removido: CreateUserRequest e UpdateUserRequest
// O sistema não permite criação, atualização ou exclusão de usuários

export interface CreateClassroomRequest {
  Name: string
  Responsible: string
  Description: string
  State: Classroom['State']
  SecretaryNote?: string
  Equipment: string
  Capacity: number
}

export interface UpdateClassroomRequest {
  Name?: string
  Responsible?: string
  Description?: string
  State?: Classroom['State']
  SecretaryNote?: string
  Equipment?: string
  Capacity?: number
}

export interface CreateHistoryRequest {
  IDUserFK: number
  IDClassroomFK: number
  StartDate: string
}

export interface UpdateHistoryRequest {
  ReturnDate?: string
}

export interface CreateNotificationRequest {
  Message: string
  IDUserFK: number
}

export interface UpdateNotificationRequest {
  ReadAt?: string
}

// ===========================================
// TIPOS PARA RESPOSTAS DA API
// ===========================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ===========================================
// TIPOS PARA FILTROS E BUSCA
// ===========================================

export interface UserFilters {
  Course?: string
  Period?: string
  Name?: string
}

export interface ClassroomFilters {
  State?: Classroom['State']
  Responsible?: string
  Name?: string
  Capacity?: {
    min?: number
    max?: number
  }
}

export interface HistoryFilters {
  IDUserFK?: number
  IDClassroomFK?: number
  StartDate?: {
    from?: string
    to?: string
  }
  ReturnDate?: {
    from?: string
    to?: string
  }
}

export interface NotificationFilters {
  IDUserFK?: number
  ReadAt?: boolean // true para lidas, false para não lidas, undefined para todas
  CreatedAt?: {
    from?: string
    to?: string
  }
}

// ===========================================
// TIPOS PARA ESTATÍSTICAS
// ===========================================

export interface ClassroomStats {
  total: number
  Disponivel: number
  'Em uso': number
  Indisponivel: number
}

export interface UserStats {
  total: number
  active: number // usuários com histórico recente
  byCourse: Record<string, number>
  byPeriod: Record<string, number>
}

export interface HistoryStats {
  total: number
  active: number // empréstimos ativos (sem ReturnDate)
  byClassroom: Record<string, number>
  byUser: Record<string, number>
  averageDuration: number // em horas
}
