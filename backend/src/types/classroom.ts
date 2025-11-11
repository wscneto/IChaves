/**
 * Types and interfaces for Classroom operations
 * Provides type safety for all classroom-related operations
 */

export type ClassroomState = 'Disponivel' | 'Em uso' | 'Indisponivel';

export interface CreateClassroomRequest {
  Name: string;
  Responsible: string;
  Description: string;
  State: ClassroomState;
  SecretaryNote?: string;
  Equipment: string;
  Capacity: number;
}

export interface UpdateClassroomRequest {
  Name?: string;
  Responsible?: string;
  Description?: string;
  State?: ClassroomState;
  SecretaryNote?: string;
  Equipment?: string;
  Capacity?: number;
}

export interface ClassroomData {
  IDClassroom: number;
  Name: string;
  Responsible: string;
  Description: string;
  State: string;
  SecretaryNote?: string;
  Equipment: string;
  Capacity: number;
}

export interface ClassroomResponse {
  success: boolean;
  data: ClassroomData;
  message: string;
}

export interface ClassroomListResponse {
  success: boolean;
  data: ClassroomData[];
  count: number;
}

export interface CreateClassroomData {
  Name: string;
  Responsible: string;
  Description: string;
  State: ClassroomState;
  SecretaryNote?: string;
  Equipment: string;
  Capacity: number;
}

export interface UpdateClassroomData {
  Name?: string;
  Responsible?: string;
  Description?: string;
  State?: ClassroomState;
  SecretaryNote?: string;
  Equipment?: string;
  Capacity?: number;
}
