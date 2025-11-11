import type { Classroom, User, History, Notification } from "@/types/database";
import { api } from "@/services/api";

// ===========================================
// DADOS MOCKADOS BASEADOS NO ESQUEMA DO BANCO
// ===========================================

export const mockClassrooms: Classroom[] = [
  {
    IDClassroom: 1,
    Name: "Armário 01",
    State: "Disponivel",
    Capacity: 1,
    Equipment: "",
    Description: "Armário para guardar pertences pessoais",
    NameResponsible: "Secretaria",
    IDResponsible: 0,
    SecretaryNote: "Armário em bom estado",
  },
  {
    IDClassroom: 2,
    Name: "Armário 02",
    State: "Em uso",
    Capacity: 1,
    Equipment: "",
    Description: "Armário para guardar pertences pessoais",
    NameResponsible: "Secretaria",
    IDResponsible: 0,
    SecretaryNote: "Armário em bom estado",
  },
  {
    IDClassroom: 3,
    Name: "Armário 03",
    State: "Disponivel",
    Capacity: 1,
    Equipment: "",
    Description: "Armário para guardar pertences pessoais",
    NameResponsible: "Secretaria",
    IDResponsible: 0,
    SecretaryNote: "Armário em bom estado",
  },
  {
    IDClassroom: 4,
    Name: "Armário 04",
    State: "Indisponivel",
    Capacity: 1,
    Equipment: "",
    Description: "Armário para guardar pertences pessoais",
    NameResponsible: "Secretaria",
    IDResponsible: 0,
    SecretaryNote: "Armário em manutenção",
  },
  {
    IDClassroom: 5,
    Name: "Armário 05",
    State: "Disponivel",
    Capacity: 1,
    Equipment: "",
    Description: "Armário para guardar pertences pessoais",
    NameResponsible: "Secretaria",
    IDResponsible: 0,
    SecretaryNote: "Armário em bom estado",
  },
  {
    IDClassroom: 6,
    Name: "Armário 06",
    State: "Em uso",
    Capacity: 1,
    Equipment: "",
    Description: "Armário para guardar pertences pessoais",
    NameResponsible: "Secretaria",
    IDResponsible: 0,
    SecretaryNote: "Armário em bom estado",
  },
  {
    IDClassroom: 7,
    Name: "Laboratório 03",
    State: "Disponivel",
    Capacity: 25,
    Equipment: "Computadores, Quadro Branco, TVs, Projetor",
    Description: "Laboratório de informática com equipamentos modernos",
    NameResponsible: "Coordenação de Informática",
    IDResponsible: 0,
    SecretaryNote: "Equipamentos atualizados em 2024",
  },

  {
    IDClassroom: 8,
    Name: "Sala de Convivência",
    State: "Indisponivel",
    Capacity: 10,
    Equipment: "Sofá, Cafeteira, Micro-ondas",
    Description: "Pequena sala para convivência dos alunos",
    NameResponsible: "Coordenação",
    IDResponsible: 0,
    SecretaryNote: "Em manutenção - problemas no ar condicionado",
  },
  {
    IDClassroom: 9,
    Name: "Sala de Estudos",
    State: "Disponivel",
    Capacity: 15,
    Equipment: "Computadores, Mesas individuais, Ar condicionado",
    Description: "Sala silenciosa para estudos individuais e em grupo",
    NameResponsible: "Biblioteca",
    IDResponsible: 0,
    SecretaryNote: "Sala com excelente acústica",
  },
];

export const mockUsers: User[] = [
  {
    IDUser: 1,
    Name: "Walter Soares Costa Neto",
    Email: "wscn@ichaves.com",
    ImageProfile: "https://ui-avatars.com/api/?name=Walter+Neto",
    Student: {
      Course: "Ciência da Computação",
      Period: "3",
    },
  },
  {
    IDUser: 2,
    Name: "Admin Sistema",
    Email: "admin@ichaves.com",
    ImageProfile: "https://ui-avatars.com/api/?name=Admin+Sistema",
    Admin: {},
  },
  {
    IDUser: 3,
    Name: "João Silva",
    Email: "joao@example.com",
    ImageProfile: "https://ui-avatars.com/api/?name=Joao+Silva",
    Student: {
      Course: "Engenharia de Software",
      Period: "5",
    },
  },
];

export const mockHistories: History[] = [
  {
    IDHistory: 1,
    StartDate: "2024-01-15T10:00:00Z",
    ReturnDate: "2024-01-15T12:00:00Z",
    IDUserFK: 1,
    IDClassroomFK: 1,
    User: mockUsers[0],
    Classroom: mockClassrooms[0],
  },
  {
    IDHistory: 2,
    StartDate: "2024-01-16T14:00:00Z",
    ReturnDate: undefined, // Empréstimo ativo
    IDUserFK: 2,
    IDClassroomFK: 2,
    User: mockUsers[1],
    Classroom: mockClassrooms[1],
  },
];

export const mockNotifications: Notification[] = [
  {
    IDNotification: 1,
    Message: "Sua chave do Armário 01 foi devolvida com sucesso",
    CreatedAt: "2024-01-15T12:05:00Z",
    ReadAt: "2024-01-15T12:10:00Z",
    IDUserFK: 1,
    User: mockUsers[0],
  },
  {
    IDNotification: 2,
    Message: "Lembrete: Você ainda possui a chave do Armário 02",
    CreatedAt: "2024-01-16T16:00:00Z",
    ReadAt: undefined, // Não lida
    IDUserFK: 2,
    User: mockUsers[1],
  },
];

// ===========================================
// FUNÇÕES DE SIMULAÇÃO (TEMPORÁRIAS)
// ===========================================

// Função para simular busca de salas (futuro: substituir por chamada à API)
export const fetchClassrooms = async (): Promise<Classroom[]> => {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockClassrooms;
};

// Função para simular atualização de status (futuro: substituir por chamada à API)
export const updateClassroomStatus = async (
  id: number,
  state: Classroom["State"]
): Promise<Classroom> => {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300));

  const classroom = mockClassrooms.find((c) => c.IDClassroom === id);
  if (!classroom) {
    throw new Error("Sala não encontrada");
  }

  classroom.State = state;
  return classroom;
};

// Função para simular busca de usuários
export const fetchUsers = async (): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockUsers;
};

// Função para simular busca de históricos
export const fetchHistories = async (): Promise<History[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockHistories;
};

// Função para simular busca de notificações
export const fetchNotifications = async (): Promise<Notification[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockNotifications;
};

// ===========================================
// FUNÇÕES DE TRANSIÇÃO PARA API REAL
// ===========================================

// Função que usa a API real quando disponível, senão usa dados mockados
export const getClassrooms = async (): Promise<Classroom[]> => {
  try {
    // Tenta usar a API real primeiro
    const classrooms = await api.classrooms.getAll();
    return classrooms;
  } catch (error) {
    console.warn("API não disponível, usando dados mockados:", error);
    // Fallback para dados mockados
    return fetchClassrooms();
  }
};

// Função para atualizar status usando API real
export const updateClassroomState = async (
  id: number,
  state: Classroom["State"]
): Promise<Classroom> => {
  try {
    console.log(`🔄 Atualizando estado da sala ${id} para: ${state} via API`);
    // Tentar usar a API real primeiro
    const response = await fetch(
      `${
        process.env.NUXT_PUBLIC_API_URL ||
        "https://ichaves-backend.onrender.com/api"
      }/classrooms/${id}/state`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.data || data;
  } catch (error) {
    console.warn(
      "API não disponível para atualização de estado, usando dados mockados:",
      error
    );
    // Fallback para dados mockados
    return updateClassroomStatus(id, state);
  }
};

// Função para atualizar nota da secretaria usando API real
export const updateClassroomNote = async (
  id: number,
  secretaryNote: string
): Promise<Classroom> => {
  try {
    console.log(`🔄 Atualizando nota da sala ${id} via API`);
    // Tentar usar a API real primeiro
    const response = await fetch(
      `${
        process.env.NUXT_PUBLIC_API_URL ||
        "https://ichaves-backend.onrender.com/api"
      }/classrooms/${id}/note`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secretaryNote }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.data || data;
  } catch (error) {
    console.warn(
      "API não disponível para atualização de nota, usando dados mockados:",
      error
    );
    // Fallback para dados mockados
    await new Promise((resolve) => setTimeout(resolve, 300));

    const classroom = mockClassrooms.find((c) => c.IDClassroom === id);
    if (!classroom) {
      throw new Error("Sala não encontrada");
    }

    classroom.SecretaryNote = secretaryNote;
    return classroom;
  }
};

// Função para buscar usuários
export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await api.users.getAll();
    return users;
  } catch (error) {
    console.warn("API não disponível, usando dados mockados:", error);
    return fetchUsers();
  }
};

// Função para buscar históricos
export const getHistories = async (): Promise<History[]> => {
  try {
    const response = await api.histories.getAll();
    return response.data;
  } catch (error) {
    console.warn("API não disponível, usando dados mockados:", error);
    return fetchHistories();
  }
};

// Função para buscar notificações
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const notifications = await api.notifications.getAll();
    return notifications;
  } catch (error) {
    console.warn("API não disponível, usando dados mockados:", error);
    return fetchNotifications();
  }
};

// ===========================================
// FUNÇÕES DE AÇÕES DAS SALAS
// ===========================================

// Função para emprestar uma sala (reservar)
export const borrowClassroom = async (
  userId: number,
  classroomId: number
): Promise<History> => {
  try {
    console.log(
      `🔄 Emprestando sala ${classroomId} para usuário ${userId} via API`
    );
    const history = await api.actions.borrow(userId, classroomId);

    return history;
  } catch (error) {
    console.error("❌ Erro ao emprestar sala via API:", error);
    throw error;
  }
};

// Função para trocar uma sala
export const returnClassroom = async (
  userId: number,
  classroomId: number
): Promise<History> => {
  try {
    console.log(`🔄 Trocando sala ${classroomId} do usuário ${userId} via API`);
    const history = await api.actions.return(userId, classroomId);

    return history;
  } catch (error) {
    console.error("❌ Erro ao trocar sala via API:", error);
    throw error;
  }
};

// Função para devolver uma sala
export const devolveClassroom = async (
  userId: number,
  classroomId: number
): Promise<History> => {
  try {
    console.log(
      `🔄 Devolvendo sala ${classroomId} do usuário ${userId} via API`
    );
    const history = await api.actions.devolve(userId, classroomId);

    return history;
  } catch (error) {
    console.error("❌ Erro ao devolver sala via API:", error);
    throw error;
  }
};

// Função para solicitar uma sala (admin)
export const requestClassroom = async (
  userId: number,
  classroomId: number
): Promise<History> => {
  try {
    console.log(
      `🔄 Solicitando sala ${classroomId} para usuário ${userId} via API`
    );
    const history = await api.actions.request(userId, classroomId);

    return history;
  } catch (error) {
    console.error("❌ Erro ao solicitar sala via API:", error);
    throw error;
  }
};

// Função para suspender uma sala (admin)
export const suspendClassroom = async (
  classroomId: number,
  reason?: string
): Promise<Classroom> => {
  try {
    console.log(`🔄 Suspendo sala ${classroomId} via API`);
    const classroom = await api.actions.suspend(classroomId, reason);

    return classroom;
  } catch (error) {
    console.error("❌ Erro ao suspender sala via API:", error);
    throw error;
  }
};

// Função para liberar uma sala (admin)
export const releaseClassroom = async (
  classroomId: number,
  reason: string
): Promise<Classroom> => {
  try {
    console.log(`🔄 Liberando sala ${classroomId} via API`);
    const classroom = await api.actions.release(classroomId, reason);

    return classroom;
  } catch (error) {
    console.error("❌ Erro ao liberar sala via API:", error);
    throw error;
  }
};

// Função para buscar empréstimos ativos de um usuário
export const getUserActiveBorrows = async (
  userId: number
): Promise<History[]> => {
  try {
    console.log(`🔄 Buscando empréstimos ativos do usuário ${userId} via API`);
    const borrows = await api.actions.getUserActiveBorrows(userId);

    return borrows;
  } catch (error) {
    console.error("❌ Erro ao buscar empréstimos ativos via API:", error);
    throw error;
  }
};
