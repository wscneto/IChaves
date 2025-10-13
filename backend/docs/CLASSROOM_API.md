# Classroom API Documentation

## Overview
The Classroom API provides endpoints for managing classrooms in the IChaves system. All endpoints follow RESTful conventions and return consistent JSON responses.

## Base URL
```
/api/classrooms
```

## Endpoints

### Create Classroom
**POST** `/api/classrooms`

Creates a new classroom.

#### Request Body
```json
{
  "Name": "Laboratório de Informática 1",
  "Responsible": "Prof. João Silva",
  "Description": "Laboratório com 30 computadores para aulas práticas",
  "State": "Disponivel",
  "SecretaryNote": "Manutenção programada para próxima semana",
  "Equipment": "30 computadores, 1 projetor, ar condicionado",
  "Capacity": 30
}
```

#### Required Fields
- `Name` (string, 1-100 characters)
- `Responsible` (string)
- `Description` (string, 1-500 characters)
- `State` (string: "Disponivel" | "Em uso" | "Indisponivel")
- `Equipment` (string)
- `Capacity` (positive integer)

#### Optional Fields
- `SecretaryNote` (string)

#### Response
```json
{
  "success": true,
  "data": {
    "IDClassroom": 1,
    "Name": "Laboratório de Informática 1",
    "Responsible": "Prof. João Silva",
    "Description": "Laboratório com 30 computadores para aulas práticas",
    "State": "Disponivel",
    "SecretaryNote": "Manutenção programada para próxima semana",
    "Equipment": "30 computadores, 1 projetor, ar condicionado",
    "Capacity": 30
  },
  "message": "Classroom created successfully"
}
```

### Get All Classrooms
**GET** `/api/classrooms`

Retrieves all classrooms.

#### Response
```json
{
  "success": true,
  "data": [
    {
      "IDClassroom": 1,
      "Name": "Laboratório de Informática 1",
      "Responsible": "Prof. João Silva",
      "Description": "Laboratório com 30 computadores para aulas práticas",
      "State": "Disponivel",
      "SecretaryNote": "Manutenção programada para próxima semana",
      "Equipment": "30 computadores, 1 projetor, ar condicionado",
      "Capacity": 30
    }
  ],
  "count": 1
}
```

### Get Classroom by ID
**GET** `/api/classrooms/:id`

Retrieves a specific classroom by its ID.

#### Parameters
- `id` (integer) - Classroom ID

#### Response
```json
{
  "success": true,
  "data": {
    "IDClassroom": 1,
    "Name": "Laboratório de Informática 1",
    "Responsible": "Prof. João Silva",
    "Description": "Laboratório com 30 computadores para aulas práticas",
    "State": "Disponivel",
    "SecretaryNote": "Manutenção programada para próxima semana",
    "Equipment": "30 computadores, 1 projetor, ar condicionado",
    "Capacity": 30
  }
}
```

### Update Classroom
**PUT** `/api/classrooms/:id`

Updates an existing classroom.

#### Parameters
- `id` (integer) - Classroom ID

#### Request Body
```json
{
  "Name": "Laboratório de Informática 1 - Atualizado",
  "State": "Em uso",
  "Capacity": 35
}
```

All fields are optional for updates.

#### Response
```json
{
  "success": true,
  "data": {
    "IDClassroom": 1,
    "Name": "Laboratório de Informática 1 - Atualizado",
    "Responsible": "Prof. João Silva",
    "Description": "Laboratório com 30 computadores para aulas práticas",
    "State": "Em uso",
    "SecretaryNote": "Manutenção programada para próxima semana",
    "Equipment": "30 computadores, 1 projetor, ar condicionado",
    "Capacity": 35
  },
  "message": "Classroom updated successfully"
}
```

### Delete Classroom
**DELETE** `/api/classrooms/:id`

Deletes a classroom.

#### Parameters
- `id` (integer) - Classroom ID

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Classroom deleted successfully"
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name is required",
    "details": {
      "field": "Name",
      "value": null,
      "expected": "non-empty string"
    },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req-123"
  },
  "success": false
}
```

### Not Found Error (404)
```json
{
  "error": {
    "code": "RECORD_NOT_FOUND",
    "message": "Classroom not found",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req-123"
  },
  "success": false
}
```

### Conflict Error (409)
```json
{
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "Classroom with this name already exists",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req-123"
  },
  "success": false
}
```

### Business Rule Violation (400)
```json
{
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Cannot delete classroom with associated histories",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req-123"
  },
  "success": false
}
```

## Validation Rules

### Name
- Required for creation
- Must be 1-100 characters long
- Must be unique across all classrooms

### Responsible
- Required for creation
- No length restrictions

### Description
- Required for creation
- Must be 1-500 characters long

### State
- Required for creation
- Must be one of: "Disponivel", "Em uso", "Indisponivel"

### Equipment
- Required for creation
- No length restrictions

### Capacity
- Required for creation
- Must be a positive integer

### SecretaryNote
- Optional field
- No length restrictions

## Business Rules

1. **Unique Names**: Classroom names must be unique across the system
2. **Deletion Restrictions**: Classrooms with associated histories cannot be deleted
3. **State Validation**: Only predefined states are allowed
4. **Capacity Validation**: Capacity must be a positive integer

## Testing

You can test the API endpoints using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl
- Any HTTP client

### Example curl commands:

```bash
# Create classroom
curl -X POST http://localhost:3000/api/classrooms \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "Laboratório de Informática 1",
    "Responsible": "Prof. João Silva",
    "Description": "Laboratório com 30 computadores para aulas práticas",
    "State": "Disponivel",
    "Equipment": "30 computadores, 1 projetor, ar condicionado",
    "Capacity": 30
  }'

# Get all classrooms
curl http://localhost:3000/api/classrooms

# Get classroom by ID
curl http://localhost:3000/api/classrooms/1

# Update classroom
curl -X PUT http://localhost:3000/api/classrooms/1 \
  -H "Content-Type: application/json" \
  -d '{
    "State": "Em uso",
    "Capacity": 35
  }'

# Delete classroom
curl -X DELETE http://localhost:3000/api/classrooms/1
```
