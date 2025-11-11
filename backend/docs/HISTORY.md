
# Documentação da API de Histórico

Esta documentação descreve os endpoints da API para gerenciamento de históricos de empréstimo de chaves.

## Endpoints

### 1. Criar Novo Histórico

Cria um novo registro de histórico de empréstimo.

- **Endpoint:** `POST /api/histories`
- **Método:** `POST`
- **Headers:**
  - `Content-Type`: `application/json`

#### Request Body

```json
{
  "IDUserFK": 1,
  "IDClassroomFK": 1
}
```

- `IDUserFK` (number, obrigatório): ID do usuário que está pegando a chave.
- `IDClassroomFK` (number, obrigatório): ID da sala que está sendo emprestada.

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "IDHistory": 1,
    "StartDate": "2025-11-01T10:00:00.000Z",
    "ReturnDate": null,
    "IDUserFK": 1,
    "IDClassroomFK": 1,
    "User": {
      "IDUser": 1,
      "Name": "John Doe",
      "Email": "john.doe@example.com"
    },
    "Classroom": {
      "IDClassroom": 1,
      "Name": "Sala 101",
      "State": "Disponivel"
    }
  },
  "message": "History created successfully"
}
```

### 2. Listar Históricos

Retorna uma lista de históricos, com suporte a filtros e paginação.

- **Endpoint:** `GET /api/histories`
- **Método:** `GET`

#### Query Parameters

- `page` (number, opcional): Número da página (padrão: 1).
- `limit` (number, opcional): Quantidade de itens por página (padrão: 10).
- `user_id` (number, opcional): Filtra por ID do usuário.
- `classroom_id` (number, opcional): Filtra por ID da sala.
- `start_date_from` (string, opcional): Data de início (formato ISO 8601).
- `start_date_to` (string, opcional): Data de fim (formato ISO 8601).
- `return_date_from` (string, opcional): Data de devolução (formato ISO 8601).
- `return_date_to` (string, opcional): Data de devolução (formato ISO 8601).
- `is_active` (boolean, opcional): `true` para empréstimos ativos (sem data de devolução), `false` para inativos.
- `sort_by` (string, opcional): Campo para ordenação (`StartDate` ou `ReturnDate`).
- `sort_order` (string, opcional): Ordem da ordenação (`asc` ou `desc`).

#### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "IDHistory": 1,
      "StartDate": "2025-11-01T10:00:00.000Z",
      "ReturnDate": null,
      "IDUserFK": 1,
      "IDClassroomFK": 1,
      "User": { ... },
      "Classroom": { ... }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 3. Obter Histórico por ID

Retorna um registro de histórico específico.

- **Endpoint:** `GET /api/histories/:id`
- **Método:** `GET`

#### Path Parameters

- `id` (number, obrigatório): ID do histórico.

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "IDHistory": 1,
    "StartDate": "2025-11-01T10:00:00.000Z",
    "ReturnDate": null,
    "IDUserFK": 1,
    "IDClassroomFK": 1,
    "User": { ... },
    "Classroom": { ... }
  }
}
```

### 4. Atualizar Histórico

Atualiza um registro de histórico.

- **Endpoint:** `PUT /api/histories/:id`
- **Método:** `PUT`
- **Headers:**
  - `Content-Type`: `application/json`

#### Path Parameters

- `id` (number, obrigatório): ID do histórico.

#### Request Body

```json
{
  "ReturnDate": "2025-11-01T11:00:00.000Z"
}
```

- `ReturnDate` (string, opcional): Data de devolução da chave (formato ISO 8601).

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "IDHistory": 1,
    "StartDate": "2025-11-01T10:00:00.000Z",
    "ReturnDate": "2025-11-01T11:00:00.000Z",
    "IDUserFK": 1,
    "IDClassroomFK": 1,
    "User": { ... },
    "Classroom": { ... }
  },
  "message": "History updated successfully"
}
```
