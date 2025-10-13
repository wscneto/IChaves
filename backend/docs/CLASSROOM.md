# Classroom API

Base path: `/api/classrooms`

## Endpoints

### POST `/api/classrooms`
Create a classroom.

Request body:
```
{
  "Name": "Sala 101",
  "Responsible": "Prof. Maria",
  "Description": "Sala principal",
  "State": "Disponivel" | "Em uso" | "Indisponivel",
  "SecretaryNote": "opcional",
  "Equipment": "Projetor, Quadro",
  "Capacity": 30
}
```

- Validations:
  - `Name`, `Responsible`, `Description`, `Equipment`, `Capacity`, `State` são obrigatórios
  - `Name`: 1-100 caracteres
  - `Description`: 1-500 caracteres
  - `State`: um de `Disponivel`, `Em uso`, `Indisponivel`
  - `Capacity`: inteiro positivo (> 0)

Responses:
- 201 Created
```
{
  "success": true,
  "data": { "IDClassroom": 1, ... },
  "message": "Classroom created successfully"
}
```
- 400 Validation error
- 409 Conflict (nome duplicado)

### GET `/api/classrooms`
Lista todas as salas.

Responses:
- 200 OK
```
{
  "success": true,
  "data": [ { "IDClassroom": 1, ... } ],
  "count": 1
}
```

### GET `/api/classrooms/:id`
Busca sala por ID.

Responses:
- 200 OK
- 404 Not found

### PUT `/api/classrooms/:id`
Atualiza campos da sala.

Request body (parcial):
```
{
  "Name?": string,
  "Responsible?": string,
  "Description?": string,
  "State?": "Disponivel" | "Em uso" | "Indisponivel",
  "SecretaryNote?": string,
  "Equipment?": string,
  "Capacity?": number
}
```

- Validations aplicadas aos campos fornecidos:
  - `Name`: 1-100 caracteres
  - `Description`: 1-500 caracteres
  - `State`: um de `Disponivel`, `Em uso`, `Indisponivel`
  - `Capacity`: inteiro positivo

Responses:
- 200 OK
- 400 Validation error
- 404 Not found
- 409 Conflict (nome duplicado)

### DELETE `/api/classrooms/:id`
Remove sala.

Responses:
- 200 OK
```
{
  "success": true,
  "data": { "message": "Classroom deleted successfully" }
}
```
- 400 Business rule violation (possui históricos)
- 404 Not found

## Observações
- Erros seguem o formato padronizado do backend, com `code`, `message` e `details` quando aplicável.



