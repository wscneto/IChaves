# Documentação da API - IChaves

## Visão Geral

Esta documentação descreve as rotas da API que serão implementadas no backend para o sistema IChaves.

## Base URL

```
http://localhost:3001/api
```

## Autenticação

Todas as rotas requerem autenticação via token JWT no header:

```
Authorization: Bearer <token>
```

## Endpoints

### Usuários

#### GET /users
Lista todos os usuários com paginação e filtros.

**Query Parameters:**
- `page` (number): Página atual (padrão: 1)
- `limit` (number): Itens por página (padrão: 10)
- `course` (string): Filtrar por curso
- `period` (string): Filtrar por período
- `name` (string): Filtrar por nome

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "ID_User": 1,
        "Name": "Walter Soares Costa Neto",
        "Course": "Ciência da Computação",
        "Period": "8º Período",
        "Email": "walter.neto@example.com",
        "Image_Profile": "base64_string"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### GET /users/:id
Busca um usuário específico.

**Nota:** O sistema não suporta criação, atualização ou exclusão de usuários. Apenas operações de leitura são permitidas.

### Salas

**Nota:** O sistema de salas suporta apenas operações de leitura e alteração de estado/nota. Criação, atualização completa e exclusão de salas não estão disponíveis nesta versão.

#### GET /classrooms
Lista todas as salas com paginação e filtros.

**Query Parameters:**
- `page` (number): Página atual
- `limit` (number): Itens por página
- `state` (string): Filtrar por estado
- `responsible` (string): Filtrar por responsável
- `name` (string): Filtrar por nome
- `capacity_min` (number): Capacidade mínima
- `capacity_max` (number): Capacidade máxima

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "ID_Classroom": 1,
        "Name": "Armário 01",
        "Responsible": "Secretaria",
        "Description": "Armário para guardar pertences pessoais",
        "State": "Disponivel",
        "Secretary_Note": "Armário em bom estado",
        "Equipment": [],
        "Capacity": 1
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### GET /classrooms/:id
Busca uma sala específica.

#### PATCH /classrooms/:id/state
Atualiza apenas o estado de uma sala.

**Body:**
```json
{
  "state": "Disponivel"
}
```

#### PATCH /classrooms/:id/note
Atualiza apenas a nota da secretaria de uma sala.

**Body:**
```json
{
  "secretaryNote": "Nova observação da secretaria"
}
```

**Nota:** Os seguintes endpoints não estão disponíveis nesta versão:
- `POST /classrooms` - Criação de salas
- `PUT /classrooms/:id` - Atualização completa de salas  
- `DELETE /classrooms/:id` - Exclusão de salas

### Histórico

#### GET /histories
Lista o histórico de empréstimos.

**Query Parameters:**
- `page` (number): Página atual
- `limit` (number): Itens por página
- `user_id` (number): Filtrar por usuário
- `classroom_id` (number): Filtrar por sala
- `start_date_from` (string): Data de início (from)
- `start_date_to` (string): Data de início (to)
- `return_date_from` (string): Data de devolução (from)
- `return_date_to` (string): Data de devolução (to)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "ID_History": 1,
        "StartDate": "2024-01-15T10:00:00Z",
        "ReturnDate": "2024-01-15T12:00:00Z",
        "ID_User_FK": 1,
        "ID_Classroom_FK": 1,
        "User": {
          "ID_User": 1,
          "Name": "Walter Soares Costa Neto",
          "Course": "Ciência da Computação",
          "Period": "8º Período",
          "Email": "walter.neto@example.com"
        },
        "Classroom": {
          "ID_Classroom": 1,
          "Name": "Armário 01",
          "State": "available"
        }
      }
    ],
    "total": 200,
    "page": 1,
    "limit": 10,
    "totalPages": 20
  }
}
```

#### GET /histories/:id
Busca um histórico específico.

#### POST /histories
Cria um novo registro de histórico (empréstimo).

#### PUT /histories/:id
Atualiza um histórico existente.

#### PATCH /histories/:id/return
Marca uma chave como devolvida.

### Notificações

#### GET /notifications
Lista as notificações de um usuário.

**Query Parameters:**
- `page` (number): Página atual
- `limit` (number): Itens por página
- `user_id` (number): ID do usuário
- `read` (boolean): Filtrar por lidas/não lidas
- `created_at_from` (string): Data de criação (from)
- `created_at_to` (string): Data de criação (to)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "ID_Notification": 1,
        "Message": "Sua chave do Armário 01 foi devolvida com sucesso",
        "CreatedAt": "2024-01-15T12:05:00Z",
        "ReadAt": "2024-01-15T12:10:00Z",
        "ID_User_FK": 1,
        "User": {
          "ID_User": 1,
          "Name": "Walter Soares Costa Neto"
        }
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

#### GET /notifications/:id
Busca uma notificação específica.

#### POST /notifications
Cria uma nova notificação.

#### PUT /notifications/:id
Atualiza uma notificação existente.

#### PATCH /notifications/:id/read
Marca uma notificação como lida.

#### PATCH /notifications/read-all
Marca todas as notificações de um usuário como lidas.

**Body:**
```json
{
  "user_id": 1
}
```

### Estatísticas

#### GET /stats/classrooms
Retorna estatísticas das salas.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "Disponivel": 30,
    "Em uso": 10,
    "Indisponivel": 10
  }
}
```

#### GET /stats/users
Retorna estatísticas dos usuários.

#### GET /stats/histories
Retorna estatísticas do histórico.

### Ações Específicas

#### POST /actions/reservar
Reserva uma sala (ação do estudante).

**Body:**
```json
{
  "ID_User_FK": 1,
  "ID_Classroom_FK": 1,
  "StartDate": "2024-01-15T10:00:00Z"
}
```

#### POST /actions/trocar
Troca uma sala (ação do estudante).

**Body:**
```json
{
  "ID_User_FK": 1,
  "ID_Classroom_FK": 1,
  "ReturnDate": "2024-01-15T12:00:00Z"
}
```

#### POST /actions/solicitar
Solicita uma sala (ação do admin).

**Body:**
```json
{
  "ID_User_FK": 1,
  "ID_Classroom_FK": 1,
  "StartDate": "2024-01-15T10:00:00Z"
}
```

#### POST /actions/suspender
Suspende uma sala (ação do admin).

**Body:**
```json
{
  "ID_Classroom_FK": 1,
  "reason": "Manutenção necessária"
}
```

#### POST /actions/liberar
Libera uma sala suspensa (ação do admin).

**Body:**
```json
{
  "ID_Classroom_FK": 1,
  "reason": "Manutenção concluída"
}
```

#### GET /users/:id/active-borrows
Lista os empréstimos ativos de um usuário.

#### GET /classrooms/:id/current-user
Retorna o usuário atual que possui a chave da sala.

## Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro na requisição
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Código do erro"
}
```

## Estados das Salas

- `Disponivel` - Disponível para uso
- `Em uso` - Atualmente sendo utilizada
- `Indisponivel` - Suspensa/Indisponível para uso

## Ações por Perfil de Usuário

### Estudante
- **Disponivel**: Pode reservar (muda para "Em uso")
- **Em uso**: Pode trocar (muda para "Disponivel")
- **Indisponivel**: Não pode realizar ações (botão desabilitado)

### Admin
- **Disponivel**: Pode suspender (muda para "Indisponivel")
- **Em uso**: Pode solicitar (confirmação)
- **Indisponivel**: Pode liberar (muda para "Disponivel")

## Cores dos Botões

- **Verde**: Ações positivas (Reservar, Liberar)
- **Vermelho**: Ações de bloqueio (Suspender, Suspenso)
- **Laranja**: Ações neutras (Trocar, Solicitar)
