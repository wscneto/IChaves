/**
 * Types and interfaces for Action operations
 * Provides type safety for all action-related operations
 */

import { ClassroomState } from './classroom';

// Action types
export type ActionType = 'reservar' | 'trocar' | 'devolver' | 'solicitar' | 'suspender' | 'liberar';

// User roles
export type UserRole = 'admin' | 'student';

// Action status
export type ActionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

// Base action interface
export interface BaseAction {
  IDAction?: number;
  ActionType: ActionType;
  IDUserFK: number;
  IDClassroomFK: number;
  Status: ActionStatus;
  CreatedAt?: Date;
  CompletedAt?: Date;
  Notes?: string;
}

// Specific action request interfaces
export interface ReservarActionRequest {
  IDClassroomFK: number;
  Notes?: string;
}

export interface TrocarActionRequest {
  IDClassroomFK: number;
  TargetUserID: number; // ID do usuário que receberá a chave
  Notes?: string;
}

export interface DevolverActionRequest {
  IDClassroomFK: number;
  Notes?: string;
}

export interface SolicitarActionRequest {
  IDClassroomFK: number;
  TargetUserID: number; // ID do usuário para quem a chave será solicitada
  Notes?: string;
}

export interface SuspenderActionRequest {
  IDClassroomFK: number;
  Reason: string; // Motivo da suspensão
  Notes?: string;
}

export interface LiberarActionRequest {
  IDClassroomFK: number;
  Notes?: string;
}

// Union type for all action requests
export type ActionRequest = 
  | ReservarActionRequest 
  | TrocarActionRequest 
  | DevolverActionRequest 
  | SolicitarActionRequest 
  | SuspenderActionRequest 
  | LiberarActionRequest;

// Action response interfaces
export interface ActionResponse {
  success: boolean;
  data: ActionData;
  message: string;
}

// Simple action response for controller responses
export interface SimpleActionResponse {
  success: boolean;
  data: {
    actionType: string;
    classroomID: number;
    newState?: ClassroomState;
    message: string;
    targetUserID?: number;
    reason?: string;
  };
  message: string;
}

export interface ActionData {
  IDAction: number;
  ActionType: ActionType;
  IDUserFK: number;
  IDClassroomFK: number;
  Status: ActionStatus;
  CreatedAt: Date;
  CompletedAt?: Date;
  Notes?: string;
  ClassroomName?: string;
  UserName?: string;
}

export interface ActionListResponse {
  success: boolean;
  data: ActionData[];
  count: number;
}

// Validation interfaces
export interface ActionValidationContext {
  userID: number;
  userRole: UserRole;
  classroomID: number;
  classroomState: ClassroomState;
  hasActiveReservation?: boolean;
  targetUserID?: number;
}

// Permission validation
export interface PermissionCheck {
  canReservar: boolean;
  canTrocar: boolean;
  canDevolver: boolean;
  canSolicitar: boolean;
  canSuspender: boolean;
  canLiberar: boolean;
}

// State transition rules
export interface StateTransitionRule {
  from: ClassroomState;
  to: ClassroomState;
  action: ActionType;
  allowedRoles: UserRole[];
}

// Action result interface
export interface ActionResult {
  success: boolean;
  actionID?: number;
  classroomState?: ClassroomState;
  message: string;
  historyRecord?: {
    IDHistory: number;
    StartDate: Date;
    ReturnDate?: Date;
    IDUserFK: number;
    IDClassroomFK: number;
  };
  notification?: {
    IDNotification: number;
    Message: string;
    IDUserFK: number;
  };
}

// Error types for actions
export interface ActionError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

// Action validation result
export interface ActionValidationResult {
  isValid: boolean;
  errors: ActionError[];
  warnings?: string[];
}

// Classroom state validation
export interface ClassroomStateValidation {
  currentState: ClassroomState;
  canTransition: boolean;
  allowedActions: ActionType[];
  reason?: string;
}

// User permission validation
export interface UserPermissionValidation {
  userID: number;
  role: UserRole;
  hasPermission: boolean;
  missingPermissions: string[];
  reason?: string;
}

// Action history interface (for future implementation)
export interface ActionHistory {
  IDHistory: number;
  StartDate: Date;
  ReturnDate?: Date;
  IDUserFK: number;
  IDClassroomFK: number;
  ActionType: ActionType;
  Status: ActionStatus;
  Notes?: string;
}

// Notification interface (for future implementation)
export interface ActionNotification {
  IDNotification: number;
  Message: string;
  CreatedAt: Date;
  ReadAt?: Date;
  IDUserFK: number;
  ActionType: ActionType;
  IDClassroomFK: number;
}

// Constants
export const ACTION_TYPES: ActionType[] = ['reservar', 'trocar', 'devolver', 'solicitar', 'suspender', 'liberar'];

export const USER_ROLES: UserRole[] = ['admin', 'student'];

export const ACTION_STATUSES: ActionStatus[] = ['pending', 'completed', 'failed', 'cancelled'];

export const CLASSROOM_STATES: ClassroomState[] = ['Disponivel', 'Em uso', 'Indisponivel'];

// State transition matrix
export const STATE_TRANSITIONS: StateTransitionRule[] = [
  // Reservar: Disponivel -> Em uso (student only)
  { from: 'Disponivel', to: 'Em uso', action: 'reservar', allowedRoles: ['student'] },
  
  // Trocar: Em uso -> Em uso (student only, transfer to another student)
  { from: 'Em uso', to: 'Em uso', action: 'trocar', allowedRoles: ['student'] },
  
  // Devolver: Em uso -> Disponivel (student only)
  { from: 'Em uso', to: 'Disponivel', action: 'devolver', allowedRoles: ['student'] },
  
  // Solicitar: Disponivel -> Em uso (admin only, assign to student)
  { from: 'Disponivel', to: 'Em uso', action: 'solicitar', allowedRoles: ['admin'] },
  
  // Suspender: any state -> Indisponivel (admin only)
  { from: 'Disponivel', to: 'Indisponivel', action: 'suspender', allowedRoles: ['admin'] },
  { from: 'Em uso', to: 'Indisponivel', action: 'suspender', allowedRoles: ['admin'] },
  { from: 'Indisponivel', to: 'Indisponivel', action: 'suspender', allowedRoles: ['admin'] },
  
  // Liberar: Indisponivel -> Disponivel (admin only)
  { from: 'Indisponivel', to: 'Disponivel', action: 'liberar', allowedRoles: ['admin'] },
];

// Permission matrix
export const PERMISSIONS: Record<UserRole, ActionType[]> = {
  student: ['reservar', 'trocar', 'devolver'],
  admin: ['solicitar', 'suspender', 'liberar']
};
