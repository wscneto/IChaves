# Actions API Documentation

## Overview

The Actions API provides endpoints for managing classroom key operations in the IChaves system. It supports six main actions that can be performed by students and administrators.

## Actions

### Student Actions

#### 1. Reservar (Reserve)
- **Endpoint**: `POST /api/actions/reservar`
- **Description**: Student reserves a key from administration
- **Required Role**: `student`
- **Classroom State**: `Disponivel` → `Em uso`

**Request Body:**
```json
{
  "IDClassroomFK": 1,
  "Notes": "Optional notes about the reservation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "actionType": "reservar",
    "classroomID": 1,
    "newState": "Em uso",
    "message": "Key reserved successfully"
  },
  "message": "Key reserved successfully"
}
```

#### 2. Trocar (Exchange)
- **Endpoint**: `POST /api/actions/trocar`
- **Description**: Student exchanges key with another student
- **Required Role**: `student`
- **Classroom State**: `Em uso` → `Em uso` (transferred to another student)

**Request Body:**
```json
{
  "IDClassroomFK": 1,
  "TargetUserID": 3,
  "Notes": "Optional notes about the transfer"
}
```

#### 3. Devolver (Return)
- **Endpoint**: `POST /api/actions/devolver`
- **Description**: Student returns key to administration
- **Required Role**: `student`
- **Classroom State**: `Em uso` → `Disponivel`

**Request Body:**
```json
{
  "IDClassroomFK": 1,
  "Notes": "Optional notes about the return"
}
```

### Admin Actions

#### 4. Solicitar (Request)
- **Endpoint**: `POST /api/actions/solicitar`
- **Description**: Admin requests key for a student
- **Required Role**: `admin`
- **Classroom State**: `Disponivel` → `Em uso`

**Request Body:**
```json
{
  "IDClassroomFK": 1,
  "TargetUserID": 2,
  "Notes": "Optional notes about the assignment"
}
```

#### 5. Suspender (Suspend)
- **Endpoint**: `POST /api/actions/suspender`
- **Description**: Admin suspends a key
- **Required Role**: `admin`
- **Classroom State**: Any → `Indisponivel`

**Request Body:**
```json
{
  "IDClassroomFK": 1,
  "Reason": "Maintenance required",
  "Notes": "Optional additional notes"
}
```

#### 6. Liberar (Release)
- **Endpoint**: `POST /api/actions/liberar`
- **Description**: Admin releases a key
- **Required Role**: `admin`
- **Classroom State**: `Indisponivel` → `Disponivel`

**Request Body:**
```json
{
  "IDClassroomFK": 1,
  "Notes": "Optional notes about the release"
}
```

## Utility Endpoints

### Get User Permissions
- **Endpoint**: `GET /api/actions/permissions`
- **Description**: Get current user's permissions for all actions

**Response:**
```json
{
  "success": true,
  "data": {
    "userRole": "student",
    "permissions": {
      "canReservar": true,
      "canTrocar": true,
      "canDevolver": true,
      "canSolicitar": false,
      "canSuspender": false,
      "canLiberar": false
    }
  },
  "message": "User permissions retrieved successfully"
}
```

### Get Classroom State Validation
- **Endpoint**: `GET /api/actions/classroom/:id/state`
- **Description**: Get classroom state validation for all actions

**Response:**
```json
{
  "success": true,
  "data": {
    "classroomID": 1,
    "currentState": "Disponivel",
    "stateValidations": {
      "reservar": {
        "currentState": "Disponivel",
        "canTransition": true,
        "allowedActions": ["reservar"]
      },
      "trocar": {
        "currentState": "Disponivel",
        "canTransition": false,
        "allowedActions": [],
        "reason": "Action 'trocar' not allowed from 'Disponivel' state"
      }
    },
    "userRole": "student"
  },
  "message": "Classroom state validation retrieved successfully"
}
```

### Get User Permissions (Specific User)
- **Endpoint**: `GET /api/actions/user/:id/permissions`
- **Description**: Get specific user's permissions

## State Transitions

The system enforces strict state transition rules:

| From State | To State | Action | Allowed Roles |
|------------|----------|--------|---------------|
| Disponivel | Em uso | reservar | student |
| Disponivel | Em uso | solicitar | admin |
| Em uso | Em uso | trocar | student |
| Em uso | Disponivel | devolver | student |
| Any | Indisponivel | suspender | admin |
| Indisponivel | Disponivel | liberar | admin |

## Permission Matrix

| Role | Reservar | Trocar | Devolver | Solicitar | Suspender | Liberar |
|------|----------|--------|----------|-----------|-----------|---------|
| student | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| admin | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Cannot perform 'reservar' action on classroom in 'Em uso' state",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "details": {
      "field": "State",
      "value": "Em uso",
      "expected": "Disponivel"
    }
  },
  "success": false
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Invalid input data
- `BUSINESS_RULE_VIOLATION`: Action not allowed due to business rules
- `FORBIDDEN`: User doesn't have permission for the action
- `RECORD_NOT_FOUND`: Classroom or user not found
- `DATABASE_ERROR`: Internal database error

### Error Examples

#### Validation Errors

**Invalid Classroom ID:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Classroom ID must be a positive integer",
    "details": {
      "field": "IDClassroomFK",
      "value": -1,
      "expected": "positive integer"
    }
  },
  "success": false
}
```

**Missing Required Field:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "IDClassroomFK is required",
    "details": {
      "field": "IDClassroomFK",
      "value": null
    }
  },
  "success": false
}
```

**Invalid Notes Length:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Notes must be no more than 500 characters long",
    "details": {
      "field": "Notes",
      "value": "Very long notes...",
      "expected": "maximum 500 characters"
    }
  },
  "success": false
}
```

**Invalid Suspension Reason:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Suspension reason must be at least 5 characters long",
    "details": {
      "field": "Reason",
      "value": "Hi",
      "expected": "minimum 5 characters"
    }
  },
  "success": false
}
```

#### Business Rule Violations

**Invalid State Transition:**
```json
{
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Cannot perform 'reservar' action on classroom in 'Em uso' state",
    "details": {
      "field": "State",
      "value": "Em uso",
      "expected": "Disponivel"
    }
  },
  "success": false
}
```

**User Already Has Active Reservation:**
```json
{
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "User already has an active reservation for this classroom",
    "details": {
      "field": "IDClassroomFK",
      "value": 1
    }
  },
  "success": false
}
```

**User Doesn't Have Active Reservation:**
```json
{
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "User does not have an active reservation for this classroom",
    "details": {
      "field": "IDClassroomFK",
      "value": 1
    }
  },
  "success": false
}
```

#### Permission Errors

**Insufficient Permissions:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "User role 'student' is not authorized to perform 'suspender' action",
    "details": {
      "field": "Role",
      "value": "student",
      "expected": "admin"
    }
  },
  "success": false
}
```

**Authentication Required:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": {
      "field": "Authorization",
      "value": null
    }
  },
  "success": false
}
```

#### Not Found Errors

**Classroom Not Found:**
```json
{
  "error": {
    "code": "RECORD_NOT_FOUND",
    "message": "Classroom not found",
    "details": {
      "field": "IDClassroomFK",
      "value": 999
    }
  },
  "success": false
}
```

**Target User Not Found:**
```json
{
  "error": {
    "code": "RECORD_NOT_FOUND",
    "message": "Target user not found",
    "details": {
      "field": "TargetUserID",
      "value": 999
    }
  },
  "success": false
}
```

## Authentication

All endpoints require authentication. The user information should be provided in the request headers:

```
X-User-ID: 1
X-User-Role: student
```

## Validation and Middleware

The Actions API includes comprehensive validation and middleware for robust error handling:

### Validation Utils

The system includes enhanced validation utilities in `ValidationUtils`:

- **`validateActionType()`**: Validates action type against allowed values
- **`validateUserRole()`**: Validates user role (admin/student)
- **`validateClassroomID()`**: Validates classroom ID is positive integer
- **`validateUserID()`**: Validates user ID is positive integer
- **`validateTargetUserID()`**: Validates target user ID for transfer actions
- **`validateSuspensionReason()`**: Validates suspension reason length and content
- **`validateNotes()`**: Validates notes field length and type
- **`validateActionRequest()`**: Comprehensive validation for action requests

### State Validation Middleware

Custom middleware for validating classroom states and user permissions:

- **`validateClassroomState()`**: Validates classroom state for specific action
- **`validateUserPermissions()`**: Validates user permissions for action
- **`validateTargetUser()`**: Validates target user for transfer actions
- **`validateActionRequirements()`**: Validates action-specific requirements
- **`validateActiveReservation()`**: Validates user has active reservation
- **`validateClassroomAvailability()`**: Validates classroom is available

### Usage Example

```typescript
import { validateAction } from '../middleware/stateValidationMiddleware';

// Apply validation middleware to route
router.post('/reservar', 
  validateAction('reservar'),
  ActionController.reservar
);
```

## Testing

Use the provided comprehensive test script to test all endpoints and scenarios:

```bash
node scripts/test-action-routes.js
```

### Test Coverage

The test script includes:

- **Basic Action Tests**: All 6 action endpoints
- **Error Scenario Tests**: Invalid inputs, wrong permissions, missing data
- **Integration Tests**: Complete workflow testing
- **Validation Tests**: Field validation, length limits, type checking
- **Permission Tests**: Role-based access control
- **State Transition Tests**: Classroom state validation

### Running Specific Tests

```bash
# Run all tests
node scripts/test-action-routes.js

# Run specific test functions (modify script)
# testReservarAction()
# testReservarActionErrors()
# testCompleteWorkflow()
# testErrorScenarios()
```

## Future Enhancements

The following features are planned for future implementation:

1. **History Tracking**: Automatic creation of history records for all actions
2. **Notifications**: Real-time notifications for action events
3. **Audit Logging**: Detailed logging of all action attempts
4. **Bulk Operations**: Support for multiple classroom operations
5. **Scheduling**: Scheduled actions and automatic state changes
6. **Analytics**: Action statistics and reporting

## Notes

- All timestamps are in ISO 8601 format
- All IDs are positive integers
- Notes fields are optional and limited to 500 characters
- Reason field for suspension is required and limited to 200 characters
- The system validates user permissions and classroom states before executing actions
