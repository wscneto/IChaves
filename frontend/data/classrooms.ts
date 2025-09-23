import type { Classroom, User, History, Notification } from '@/types/database'
import { api } from '@/services/api'

// ===========================================
// DADOS MOCKADOS BASEADOS NO ESQUEMA DO BANCO
// ===========================================

export const mockClassrooms: Classroom[] = [
  {
    ID_Classroom: 1,
    Name: 'Armário 01',
    State: 'Disponivel',
    Capacity: 1,
    Equipment: [],
    Description: 'Armário para guardar pertences pessoais',
    Responsible: 'Secretaria',
    Secretary_Note: 'Armário em bom estado'
  },
  {
    ID_Classroom: 2,
    Name: 'Armário 02',
    State: 'Em uso',
    Capacity: 1,
    Equipment: [],
    Description: 'Armário para guardar pertences pessoais',
    Responsible: 'Secretaria',
    Secretary_Note: 'Armário em bom estado'
  },
  {
    ID_Classroom: 3,
    Name: 'Armário 03',
    State: 'Disponivel',
    Capacity: 1,
    Equipment: [],
    Description: 'Armário para guardar pertences pessoais',
    Responsible: 'Secretaria',
    Secretary_Note: 'Armário em bom estado'
  },
  {
    ID_Classroom: 4,
    Name: 'Armário 04',
    State: 'Indisponivel',
    Capacity: 1,
    Equipment: [],
    Description: 'Armário para guardar pertences pessoais',
    Responsible: 'Secretaria',
    Secretary_Note: 'Armário em manutenção'
  },
  {
    ID_Classroom: 5,
    Name: 'Sala de Convivência',
    State: 'Indisponivel',
    Capacity: 10,
    Equipment: ['Sofá', 'Cafeteira', 'Micro-ondas'],
    Description: 'Pequena sala para convivência dos alunos',
    Responsible: 'Coordenação',
    Secretary_Note: 'Em manutenção - problemas no ar condicionado'
  },
  {
    ID_Classroom: 6,
    Name: 'Sala de Estudos',
    State: 'Disponivel',
    Capacity: 15,
    Equipment: ['Computadores', 'Mesas individuais', 'Ar condicionado'],
    Description: 'Sala silenciosa para estudos individuais e em grupo',
    Responsible: 'Biblioteca',
    Secretary_Note: 'Sala com excelente acústica'
  },
  {
    ID_Classroom: 7,
    Name: 'Laboratório 03',
    State: 'Em uso',
    Capacity: 25,
    Equipment: ['Computadores', 'Quadro Branco', 'TVs', 'Projetor'],
    Description: 'Laboratório de informática com equipamentos modernos',
    Responsible: 'Coordenação de Informática',
    Secretary_Note: 'Equipamentos atualizados em 2024'
  },
  {
    ID_Classroom: 8,
    Name: 'Laboratório de Redes',
    State: 'Disponivel',
    Capacity: 20,
    Equipment: ['Roteadores', 'Switches', 'Cabeamento', 'Computadores'],
    Description: 'Laboratório especializado em redes de computadores',
    Responsible: 'Coordenação de Informática',
    Secretary_Note: 'Laboratório para aulas práticas de redes'
  },
  {
    ID_Classroom: 9,
    Name: 'Sala de Reuniões',
    State: 'Disponivel',
    Capacity: 8,
    Equipment: ['Mesa de reunião', 'Projetor', 'Quadro branco'],
    Description: 'Sala para reuniões e apresentações',
    Responsible: 'Direção',
    Secretary_Note: 'Sala climatizada com equipamentos modernos'
  },
  {
    ID_Classroom: 10,
    Name: 'Auditório Pequeno',
    State: 'Indisponivel',
    Capacity: 50,
    Equipment: ['Palco', 'Sistema de som', 'Projetor', 'Ar condicionado'],
    Description: 'Auditório para palestras e eventos',
    Responsible: 'Coordenação de Eventos',
    Secretary_Note: 'Auditório temporariamente suspenso'
  }
]

export const mockUsers: User[] = [
  {
    ID_User: 1,
    Name: 'Walter Soares Costa Neto',
    Course: 'Ciência da Computação',
    Period: '8º Período',
    Email: 'walter.neto@example.com',
    Image_Profile: 'https://ui-avatars.com/api/?name=Walter+Neto'
  },
  {
    ID_User: 2,
    Name: 'John Wallex Kennedy',
    Course: 'Ciência da Computação',
    Period: '8º Período',
    Email: 'john.kennedy@example.com',
    Image_Profile: 'https://ui-avatars.com/api/?name=John+Kennedy'
  },
  {
    ID_User: 3,
    Name: 'Davi William Santos',
    Course: 'Ciência da Computação',
    Period: '8º Período',
    Email: 'davi.santos@example.com',
    Image_Profile: 'https://ui-avatars.com/api/?name=Davi+Santos'
  }
]

export const mockHistories: History[] = [
  {
    ID_History: 1,
    StartDate: '2024-01-15T10:00:00Z',
    ReturnDate: '2024-01-15T12:00:00Z',
    ID_User_FK: 1,
    ID_Classroom_FK: 1,
    User: mockUsers[0],
    Classroom: mockClassrooms[0]
  },
  {
    ID_History: 2,
    StartDate: '2024-01-16T14:00:00Z',
    ReturnDate: undefined, // Empréstimo ativo
    ID_User_FK: 2,
    ID_Classroom_FK: 2,
    User: mockUsers[1],
    Classroom: mockClassrooms[1]
  }
]

export const mockNotifications: Notification[] = [
  {
    ID_Notification: 1,
    Message: 'Sua chave do Armário 01 foi devolvida com sucesso',
    CreatedAt: '2024-01-15T12:05:00Z',
    ReadAt: '2024-01-15T12:10:00Z',
    ID_User_FK: 1,
    User: mockUsers[0]
  },
  {
    ID_Notification: 2,
    Message: 'Lembrete: Você ainda possui a chave do Armário 02',
    CreatedAt: '2024-01-16T16:00:00Z',
    ReadAt: undefined, // Não lida
    ID_User_FK: 2,
    User: mockUsers[1]
  }
]

// ===========================================
// FUNÇÕES DE SIMULAÇÃO (TEMPORÁRIAS)
// ===========================================

// Função para simular busca de salas (futuro: substituir por chamada à API)
export const fetchClassrooms = async (): Promise<Classroom[]> => {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockClassrooms
}

// Função para simular atualização de status (futuro: substituir por chamada à API)
export const updateClassroomStatus = async (id: number, state: Classroom['State']): Promise<Classroom> => {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const classroom = mockClassrooms.find(c => c.ID_Classroom === id)
  if (!classroom) {
    throw new Error('Sala não encontrada')
  }
  
  classroom.State = state
  return classroom
}

// Função para simular busca de usuários
export const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockUsers
}

// Função para simular busca de históricos
export const fetchHistories = async (): Promise<History[]> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  return mockHistories
}

// Função para simular busca de notificações
export const fetchNotifications = async (): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockNotifications
}

// ===========================================
// FUNÇÕES DE TRANSIÇÃO PARA API REAL
// ===========================================

// Função que usa a API real quando disponível, senão usa dados mockados
export const getClassrooms = async (): Promise<Classroom[]> => {
  try {
    // Tenta usar a API real primeiro
    const response = await api.classrooms.getAll()
    return response.data
  } catch (error) {
    console.warn('API não disponível, usando dados mockados:', error)
    // Fallback para dados mockados
    return fetchClassrooms()
  }
}

// Função para atualizar status usando API real ou mock
export const updateClassroomState = async (id: number, state: Classroom['State']): Promise<Classroom> => {
  try {
    // Tenta usar a API real primeiro
    return await api.classrooms.updateState(id, state)
  } catch (error) {
    console.warn('API não disponível, usando dados mockados:', error)
    // Fallback para dados mockados
    return updateClassroomStatus(id, state)
  }
}

// Função para buscar usuários
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.users.getAll()
    return response.data
  } catch (error) {
    console.warn('API não disponível, usando dados mockados:', error)
    return fetchUsers()
  }
}

// Função para buscar históricos
export const getHistories = async (): Promise<History[]> => {
  try {
    const response = await api.histories.getAll()
    return response.data
  } catch (error) {
    console.warn('API não disponível, usando dados mockados:', error)
    return fetchHistories()
  }
}

// Função para buscar notificações
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.notifications.getAll()
    return response.data
  } catch (error) {
    console.warn('API não disponível, usando dados mockados:', error)
    return fetchNotifications()
  }
}
