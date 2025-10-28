import { PrismaClient } from '@prisma/client';
import { AppError, ErrorCode } from '../types/errors';
import { 
  ActionType, 
  UserRole, 
  ActionStatus,
  ReservarActionRequest,
  TrocarActionRequest,
  DevolverActionRequest,
  SolicitarActionRequest,
  SuspenderActionRequest,
  LiberarActionRequest,
  ActionRequest,
  ActionResult,
  ActionValidationContext,
  PermissionCheck,
  StateTransitionRule,
  ClassroomStateValidation,
  UserPermissionValidation,
  STATE_TRANSITIONS,
  PERMISSIONS,
  CLASSROOM_STATES
} from '../types/actions';
import { ClassroomState } from '../types/classroom';

const prisma = new PrismaClient();

export class ActionService {
  /**
   * Execute reservar action (student reserves key from administration)
   */
  static async reservar(userID: number, userRole: UserRole, request: ReservarActionRequest): Promise<ActionResult> {
    try {
      // Validate permissions
      this.validatePermission(userRole, 'reservar');

      // Get classroom and validate state
      const classroom = await this.getClassroomAndValidate(request.IDClassroomFK);
      this.validateClassroomState(classroom.State, 'reservar', userRole);

      // Check if user already has an active reservation
      const activeReservation = await this.getActiveReservation(userID, request.IDClassroomFK);
      if (activeReservation) {
        throw new AppError(
          ErrorCode.BUSINESS_RULE_VIOLATION,
          'User already has an active reservation for this classroom',
          400
        );
      }

      // Update classroom state
      await this.updateClassroomState(request.IDClassroomFK, 'Em uso');

      // Create history record (commented for future implementation)
      // const historyRecord = await this.createHistoryRecord(userID, request.IDClassroomFK, 'reservar');

      // Create notification (commented for future implementation)
      // const notification = await this.createNotification(userID, 'Key reserved successfully', 'reservar', request.IDClassroomFK);

      return {
        success: true,
        classroomState: 'Em uso',
        message: 'Key reserved successfully',
        // historyRecord,
        // notification
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to execute reservar action',
        500
      );
    }
  }

  /**
   * Execute trocar action (student exchanges key with another student)
   */
  static async trocar(userID: number, userRole: UserRole, request: TrocarActionRequest): Promise<ActionResult> {
    try {
      // Validate permissions
      this.validatePermission(userRole, 'trocar');

      // Get classroom and validate state
      const classroom = await this.getClassroomAndValidate(request.IDClassroomFK);
      this.validateClassroomState(classroom.State, 'trocar', userRole);

      // Check if user has active reservation for this classroom
      const activeReservation = await this.getActiveReservation(userID, request.IDClassroomFK);
      if (!activeReservation) {
        throw new AppError(
          ErrorCode.BUSINESS_RULE_VIOLATION,
          'User does not have an active reservation for this classroom',
          400
        );
      }

      // Validate target user exists and is a student
      const targetUser = await this.validateTargetUser(request.TargetUserID, 'student');

      // Update history record to transfer ownership (commented for future implementation)
      // await this.transferHistoryRecord(activeReservation.IDHistory, request.TargetUserID);

      // Create notification for target user (commented for future implementation)
      // await this.createNotification(request.TargetUserID, 'Key transferred to you', 'trocar', request.IDClassroomFK);

      return {
        success: true,
        classroomState: 'Em uso',
        message: 'Key transferred successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to execute trocar action',
        500
      );
    }
  }

  /**
   * Execute devolver action (student returns key to administration)
   */
  static async devolver(userID: number, userRole: UserRole, request: DevolverActionRequest): Promise<ActionResult> {
    try {
      // Validate permissions
      this.validatePermission(userRole, 'devolver');

      // Get classroom and validate state
      const classroom = await this.getClassroomAndValidate(request.IDClassroomFK);
      this.validateClassroomState(classroom.State, 'devolver', userRole);

      // Check if user has active reservation for this classroom
      const activeReservation = await this.getActiveReservation(userID, request.IDClassroomFK);
      if (!activeReservation) {
        throw new AppError(
          ErrorCode.BUSINESS_RULE_VIOLATION,
          'User does not have an active reservation for this classroom',
          400
        );
      }

      // Update classroom state
      await this.updateClassroomState(request.IDClassroomFK, 'Disponivel');

      // Close history record (commented for future implementation)
      // await this.closeHistoryRecord(activeReservation.IDHistory);

      // Create notification (commented for future implementation)
      // await this.createNotification(userID, 'Key returned successfully', 'devolver', request.IDClassroomFK);

      return {
        success: true,
        classroomState: 'Disponivel',
        message: 'Key returned successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to execute devolver action',
        500
      );
    }
  }

  /**
   * Execute solicitar action (admin requests key for student)
   */
  static async solicitar(userID: number, userRole: UserRole, request: SolicitarActionRequest): Promise<ActionResult> {
    try {
      // Validate permissions
      this.validatePermission(userRole, 'solicitar');

      // Get classroom and validate state
      const classroom = await this.getClassroomAndValidate(request.IDClassroomFK);
      this.validateClassroomState(classroom.State, 'solicitar', userRole);

      // Validate target user exists and is a student
      const targetUser = await this.validateTargetUser(request.TargetUserID, 'student');

      // Check if target user already has an active reservation
      const activeReservation = await this.getActiveReservation(request.TargetUserID, request.IDClassroomFK);
      if (activeReservation) {
        throw new AppError(
          ErrorCode.BUSINESS_RULE_VIOLATION,
          'Target user already has an active reservation for this classroom',
          400
        );
      }

      // Update classroom state
      await this.updateClassroomState(request.IDClassroomFK, 'Em uso');

      // Create history record for target user (commented for future implementation)
      // const historyRecord = await this.createHistoryRecord(request.TargetUserID, request.IDClassroomFK, 'solicitar');

      // Create notification for target user (commented for future implementation)
      // await this.createNotification(request.TargetUserID, 'Key assigned to you by administration', 'solicitar', request.IDClassroomFK);

      return {
        success: true,
        classroomState: 'Em uso',
        message: 'Key assigned to student successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to execute solicitar action',
        500
      );
    }
  }

  /**
   * Execute suspender action (admin suspends key)
   */
  static async suspender(userID: number, userRole: UserRole, request: SuspenderActionRequest): Promise<ActionResult> {
    try {
      // Validate permissions
      this.validatePermission(userRole, 'suspender');

      // Get classroom and validate state
      const classroom = await this.getClassroomAndValidate(request.IDClassroomFK);
      this.validateClassroomState(classroom.State, 'suspender', userRole);

      // Update classroom state
      await this.updateClassroomState(request.IDClassroomFK, 'Indisponivel');

      // Create notification for all users with active reservations (commented for future implementation)
      // await this.notifyUsersWithActiveReservations(request.IDClassroomFK, 'Classroom suspended by administration');

      return {
        success: true,
        classroomState: 'Indisponivel',
        message: 'Classroom suspended successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to execute suspender action',
        500
      );
    }
  }

  /**
   * Execute liberar action (admin releases key)
   */
  static async liberar(userID: number, userRole: UserRole, request: LiberarActionRequest): Promise<ActionResult> {
    try {
      // Validate permissions
      this.validatePermission(userRole, 'liberar');

      // Get classroom and validate state
      const classroom = await this.getClassroomAndValidate(request.IDClassroomFK);
      this.validateClassroomState(classroom.State, 'liberar', userRole);

      // Update classroom state
      await this.updateClassroomState(request.IDClassroomFK, 'Disponivel');

      // Create notification (commented for future implementation)
      // await this.createNotification(userID, 'Classroom released and available', 'liberar', request.IDClassroomFK);

      return {
        success: true,
        classroomState: 'Disponivel',
        message: 'Classroom released successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to execute liberar action',
        500
      );
    }
  }

  /**
   * Validate user permissions for specific action
   */
  static validatePermission(userRole: UserRole, action: ActionType): void {
    const allowedActions = PERMISSIONS[userRole];
    if (!allowedActions.includes(action)) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        `User role '${userRole}' is not authorized to perform '${action}' action`,
        403
      );
    }
  }

  /**
   * Validate classroom state for specific action
   */
  static validateClassroomState(currentState: ClassroomState, action: ActionType, userRole: UserRole): void {
    const validTransitions = STATE_TRANSITIONS.filter(
      rule => rule.action === action && rule.allowedRoles.includes(userRole)
    );

    const isValidTransition = validTransitions.some(
      rule => rule.from === currentState
    );

    if (!isValidTransition) {
      throw new AppError(
        ErrorCode.BUSINESS_RULE_VIOLATION,
        `Cannot perform '${action}' action on classroom in '${currentState}' state`,
        400
      );
    }
  }

  /**
   * Get classroom and validate it exists
   */
  static async getClassroomAndValidate(classroomID: number) {
    const classroom = await prisma.classroom.findUnique({
      where: { IDClassroom: classroomID }
    });

    if (!classroom) {
      throw new AppError(
        ErrorCode.RECORD_NOT_FOUND,
        'Classroom not found',
        404
      );
    }

    return classroom;
  }

  /**
   * Update classroom state
   */
  static async updateClassroomState(classroomID: number, newState: ClassroomState): Promise<void> {
    await prisma.classroom.update({
      where: { IDClassroom: classroomID },
      data: { State: newState }
    });
  }

  /**
   * Get active reservation for user and classroom
   */
  static async getActiveReservation(userID: number, classroomID: number) {
    // This would need to be implemented when History model is properly set up
    // For now, return null to indicate no active reservation
    return null;
  }

  /**
   * Validate target user exists and has correct role
   */
  static async validateTargetUser(userID: number, expectedRole: UserRole) {
    const user = await prisma.user.findUnique({
      where: { IDUser: userID },
      include: {
        Student: true,
        Admin: true
      }
    });

    if (!user) {
      throw new AppError(
        ErrorCode.RECORD_NOT_FOUND,
        'Target user not found',
        404
      );
    }

    // Check if user has the expected role
    const hasStudentRole = user.Student !== null;
    const hasAdminRole = user.Admin !== null;

    if (expectedRole === 'student' && !hasStudentRole) {
      throw new AppError(
        ErrorCode.BUSINESS_RULE_VIOLATION,
        'Target user is not a student',
        400
      );
    }

    if (expectedRole === 'admin' && !hasAdminRole) {
      throw new AppError(
        ErrorCode.BUSINESS_RULE_VIOLATION,
        'Target user is not an admin',
        400
      );
    }

    return user;
  }

  /**
   * Get user permissions for all actions
   */
  static getUserPermissions(userRole: UserRole): PermissionCheck {
    const allowedActions = PERMISSIONS[userRole];
    
    return {
      canReservar: allowedActions.includes('reservar'),
      canTrocar: allowedActions.includes('trocar'),
      canDevolver: allowedActions.includes('devolver'),
      canSolicitar: allowedActions.includes('solicitar'),
      canSuspender: allowedActions.includes('suspender'),
      canLiberar: allowedActions.includes('liberar')
    };
  }

  /**
   * Validate classroom state for action
   */
  static validateClassroomStateForAction(classroomState: ClassroomState, action: ActionType): ClassroomStateValidation {
    const validTransitions = STATE_TRANSITIONS.filter(rule => rule.action === action);
    const canTransition = validTransitions.some(rule => rule.from === classroomState);
    
    const allowedActions = STATE_TRANSITIONS
      .filter(rule => rule.from === classroomState)
      .map(rule => rule.action);

    return {
      currentState: classroomState,
      canTransition,
      allowedActions,
      reason: canTransition ? undefined : `Action '${action}' not allowed from '${classroomState}' state`
    };
  }

  /**
   * Validate user permissions
   */
  static validateUserPermissions(userID: number, userRole: UserRole): UserPermissionValidation {
    const permissions = this.getUserPermissions(userRole);
    const missingPermissions: string[] = [];

    if (!permissions.canReservar) missingPermissions.push('reservar');
    if (!permissions.canTrocar) missingPermissions.push('trocar');
    if (!permissions.canDevolver) missingPermissions.push('devolver');
    if (!permissions.canSolicitar) missingPermissions.push('solicitar');
    if (!permissions.canSuspender) missingPermissions.push('suspender');
    if (!permissions.canLiberar) missingPermissions.push('liberar');

    return {
      userID,
      role: userRole,
      hasPermission: missingPermissions.length === 0,
      missingPermissions,
      reason: missingPermissions.length > 0 ? `Missing permissions: ${missingPermissions.join(', ')}` : undefined
    };
  }

  // Future implementation methods (commented out for now)

  /**
   * Create history record (to be implemented when History model is ready)
   */
  // static async createHistoryRecord(userID: number, classroomID: number, actionType: ActionType) {
  //   const historyRecord = await prisma.history.create({
  //     data: {
  //       IDUserFK: userID,
  //       IDClassroomFK: classroomID,
  //       StartDate: new Date(),
  //       // Add action type field when schema is updated
  //     }
  //   });
  //   return historyRecord;
  // }

  /**
   * Create notification (to be implemented when Notification model is ready)
   */
  // static async createNotification(userID: number, message: string, actionType: ActionType, classroomID: number) {
  //   const notification = await prisma.notification.create({
  //     data: {
  //       IDUserFK: userID,
  //       Message: message,
  //       // Add action type and classroom ID fields when schema is updated
  //     }
  //   });
  //   return notification;
  // }

  /**
   * Transfer history record (to be implemented when History model is ready)
   */
  // static async transferHistoryRecord(historyID: number, newUserID: number) {
  //   await prisma.history.update({
  //     where: { IDHistory: historyID },
  //     data: { IDUserFK: newUserID }
  //   });
  // }

  /**
   * Close history record (to be implemented when History model is ready)
   */
  // static async closeHistoryRecord(historyID: number) {
  //   await prisma.history.update({
  //     where: { IDHistory: historyID },
  //     data: { ReturnDate: new Date() }
  //   });
  // }

  /**
   * Notify users with active reservations (to be implemented when History and Notification models are ready)
   */
  // static async notifyUsersWithActiveReservations(classroomID: number, message: string) {
  //   const activeReservations = await prisma.history.findMany({
  //     where: {
  //       IDClassroomFK: classroomID,
  //       ReturnDate: null
  //     },
  //     include: { User: true }
  //   });

  //   for (const reservation of activeReservations) {
  //     await this.createNotification(reservation.IDUserFK, message, 'suspender', classroomID);
  //   }
  // }
}



