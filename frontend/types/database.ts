// ===========================================
// TIPOS BASEADOS NO ESQUEMA DO BANCO DE DADOS
// ===========================================

export interface User {
  ID_User: number
  Name: string
  Course: string
  Period: string
  Email: string
  Image_Profile?: string // BLOB convertido para base64 string
}

export interface Classroom {
  ID_Classroom: number
  Name: string
  Responsible: string
  Description: string
  State: 'Disponivel' | 'Em uso' | 'Indisponivel'
  Secretary_Note?: string
  Equipment: string[]
  Capacity: number
}

export interface History {
  ID_History: number
  StartDate: string // ISO date string
  ReturnDate?: string // ISO date string (null se ainda não foi devolvido)
  ID_User_FK: number
  ID_Classroom_FK: number
  // Relacionamentos (populados pela API)
  User?: User
  Classroom?: Classroom
}

export interface Notification {
  ID_Notification: number
  Message: string
  CreatedAt: string // ISO date string
  ReadAt?: string // ISO date string (null se ainda não foi lida)
  ID_User_FK: number
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
  Secretary_Note?: string
  Equipment: string[]
  Capacity: number
}

export interface UpdateClassroomRequest {
  Name?: string
  Responsible?: string
  Description?: string
  State?: Classroom['State']
  Secretary_Note?: string
  Equipment?: string[]
  Capacity?: number
}

export interface CreateHistoryRequest {
  ID_User_FK: number
  ID_Classroom_FK: number
  StartDate: string
}

export interface UpdateHistoryRequest {
  ReturnDate?: string
}

export interface CreateNotificationRequest {
  Message: string
  ID_User_FK: number
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
  ID_User_FK?: number
  ID_Classroom_FK?: number
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
  ID_User_FK?: number
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
