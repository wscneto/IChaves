import { Request, Response, NextFunction } from 'express';
import { ActionService } from '../services/actionService';
import { ValidationUtils, AuthenticatedRequest } from '../utils/errorUtils';
import { ActionType, UserRole, ClassroomState } from '../types/actions';
import { AppError, ErrorCode } from '../types/errors';

/**
 * Middleware for validating classroom state and user permissions before actions
 */

/**
 * Middleware to validate classroom state for specific action
 */
export const validateClassroomState = (actionType: ActionType) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { IDClassroomFK } = req.body;
      const userRole = (req.user?.role as UserRole) || 'student';

      // Validate classroom ID
      ValidationUtils.validateClassroomID(IDClassroomFK, req);

      // Get classroom and validate it exists
      const classroom = await ActionService.getClassroomAndValidate(IDClassroomFK);

      // Validate classroom state for the action
      const stateValidation = ActionService.validateClassroomStateForAction(
        classroom.State as ClassroomState,
        actionType
      );

      if (!stateValidation.canTransition) {
        throw new AppError(
          ErrorCode.BUSINESS_RULE_VIOLATION,
          stateValidation.reason || `Action '${actionType}' not allowed from '${classroom.State}' state`,
          400
        );
      }

      // Store classroom data in request for use in controller
      req.classroom = classroom;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to validate user permissions for specific action
 */
export const validateUserPermissions = (actionType: ActionType) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = (req.user?.role as UserRole) || 'student';
      const userID = req.user?.id ? parseInt(req.user.id) : 0;

      // Validate user ID
      ValidationUtils.validateUserID(userID, req);

      // Validate user role
      ValidationUtils.validateUserRole(userRole, req);

      // Check if user has permission for this action
      const permissions = ActionService.getUserPermissions(userRole);
      const hasPermission = permissions[`can${actionType.charAt(0).toUpperCase() + actionType.slice(1)}` as keyof typeof permissions];

      if (!hasPermission) {
        throw new AppError(
          ErrorCode.FORBIDDEN,
          `User role '${userRole}' is not authorized to perform '${actionType}' action`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to validate target user for transfer actions
 */
export const validateTargetUser = () => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { TargetUserID } = req.body;
      const actionType = req.path.split('/').pop() as ActionType;

      // Only validate target user for transfer actions
      if (['trocar', 'solicitar'].includes(actionType)) {
        ValidationUtils.validateTargetUserID(TargetUserID, req);

        // Validate target user exists and has correct role
        const expectedRole = actionType === 'solicitar' ? 'student' : 'student';
        await ActionService.validateTargetUser(TargetUserID, expectedRole);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to validate action-specific requirements
 */
export const validateActionRequirements = (actionType: ActionType) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { IDClassroomFK, TargetUserID, Reason, Notes } = req.body;

      // Validate common requirements
      ValidationUtils.validateClassroomID(IDClassroomFK, req);
      ValidationUtils.validateNotes(Notes, 'Notes', req);

      // Validate action-specific requirements
      switch (actionType) {
        case 'trocar':
        case 'solicitar':
          ValidationUtils.validateTargetUserID(TargetUserID, req);
          break;
        case 'suspender':
          ValidationUtils.validateSuspensionReason(Reason, req);
          break;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Combined middleware for complete action validation
 */
export const validateAction = (actionType: ActionType) => {
  return [
    validateUserPermissions(actionType),
    validateClassroomState(actionType),
    validateTargetUser(),
    validateActionRequirements(actionType)
  ];
};

/**
 * Middleware to check if user has active reservation for classroom
 */
export const validateActiveReservation = (actionType: ActionType) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { IDClassroomFK } = req.body;
      const userID = req.user?.id ? parseInt(req.user.id) : 0;

      // Only check for actions that require active reservation
      if (['trocar', 'devolver'].includes(actionType)) {
        const activeReservation = await ActionService.getActiveReservation(userID, IDClassroomFK);
        
        if (!activeReservation) {
          throw new AppError(
            ErrorCode.BUSINESS_RULE_VIOLATION,
            `User does not have an active reservation for classroom ${IDClassroomFK}`,
            400
          );
        }
      }

      // For reservar and solicitar, check that user doesn't already have active reservation
      if (['reservar', 'solicitar'].includes(actionType)) {
        const targetUserID = actionType === 'solicitar' ? req.body.TargetUserID : userID;
        const activeReservation = await ActionService.getActiveReservation(targetUserID, IDClassroomFK);
        
        if (activeReservation) {
          throw new AppError(
            ErrorCode.BUSINESS_RULE_VIOLATION,
            `User already has an active reservation for classroom ${IDClassroomFK}`,
            400
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to validate classroom availability for reservation
 */
export const validateClassroomAvailability = () => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { IDClassroomFK } = req.body;
      const actionType = req.path.split('/').pop() as ActionType;

      // Only validate availability for reservation actions
      if (['reservar', 'solicitar'].includes(actionType)) {
        const classroom = await ActionService.getClassroomAndValidate(IDClassroomFK);
        
        if (classroom.State !== 'Disponivel') {
          throw new AppError(
            ErrorCode.BUSINESS_RULE_VIOLATION,
            `Classroom ${IDClassroomFK} is not available for reservation. Current state: ${classroom.State}`,
            400
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Extend Request interface to include classroom data
declare global {
  namespace Express {
    interface Request {
      classroom?: {
        IDClassroom: number;
        Name: string;
        Responsible: string;
        Description: string;
        State: string;
        SecretaryNote?: string;
        Equipment: string;
        Capacity: number;
      };
    }
  }
}



