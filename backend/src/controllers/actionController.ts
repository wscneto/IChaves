import { Response } from 'express';
import { ErrorHandler } from '../middleware/errorHandler';
import { ActionService } from '../services/actionService';
import { ValidationUtils, AuthenticatedRequest } from '../utils/errorUtils';
import { 
  ReservarActionRequest,
  TrocarActionRequest,
  DevolverActionRequest,
  SolicitarActionRequest,
  SuspenderActionRequest,
  LiberarActionRequest,
  SimpleActionResponse,
  UserRole
} from '../types/actions';
import { ClassroomState } from '../types/classroom';

export class ActionController {
  /**
   * POST /actions/reservar - Student reserves key from administration
   */
  static reservar = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { IDClassroomFK, Notes } = req.body;
    const userID = req.user?.id ? parseInt(req.user.id) : 0;
    const userRole = (req.user?.role as UserRole) || 'student';

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req);
    ValidationUtils.validateRequired(userID, 'userID', req);

    // Use new validation methods
    ValidationUtils.validateClassroomID(IDClassroomFK, req);
    ValidationUtils.validateNotes(Notes, 'Notes', req);

    const actionRequest: ReservarActionRequest = {
      IDClassroomFK,
      Notes
    };

    const result = await ActionService.reservar(userID, userRole, actionRequest);

    res.status(200).json({
      success: true,
      data: {
        actionType: 'reservar',
        classroomID: IDClassroomFK,
        newState: result.classroomState,
        message: result.message
      },
      message: 'Key reserved successfully'
    } as SimpleActionResponse);
  });

  /**
   * POST /actions/trocar - Student exchanges key with another student
   */
  static trocar = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { IDClassroomFK, TargetUserID, Notes } = req.body;
    const userID = req.user?.id ? parseInt(req.user.id) : 0;
    const userRole = (req.user?.role as UserRole) || 'student';

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req);
    ValidationUtils.validateRequired(TargetUserID, 'TargetUserID', req);
    ValidationUtils.validateRequired(userID, 'userID', req);

    // Validate IDs are positive integers
    if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
      ValidationUtils.validateRequired(null, 'IDClassroomFK', req);
    }
    if (!Number.isInteger(TargetUserID) || TargetUserID <= 0) {
      ValidationUtils.validateRequired(null, 'TargetUserID', req);
    }

    // Validate Notes length if provided
    if (Notes && typeof Notes === 'string') {
      ValidationUtils.validateLength(Notes, 'Notes', 1, 500, req);
    }

    const actionRequest: TrocarActionRequest = {
      IDClassroomFK,
      TargetUserID,
      Notes
    };

    const result = await ActionService.trocar(userID, userRole, actionRequest);

    res.status(200).json({
      success: true,
      data: {
        actionType: 'trocar',
        classroomID: IDClassroomFK,
        targetUserID: TargetUserID,
        newState: result.classroomState,
        message: result.message
      },
      message: 'Key transferred successfully'
    } as SimpleActionResponse);
  });

  /**
   * POST /actions/devolver - Student returns key to administration
   */
  static devolver = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { IDClassroomFK, Notes } = req.body;
    const userID = req.user?.id ? parseInt(req.user.id) : 0;
    const userRole = (req.user?.role as UserRole) || 'student';

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req);
    ValidationUtils.validateRequired(userID, 'userID', req);

    // Validate IDClassroomFK is a positive integer
    if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
      ValidationUtils.validateRequired(null, 'IDClassroomFK', req);
    }

    // Validate Notes length if provided
    if (Notes && typeof Notes === 'string') {
      ValidationUtils.validateLength(Notes, 'Notes', 1, 500, req);
    }

    const actionRequest: DevolverActionRequest = {
      IDClassroomFK,
      Notes
    };

    const result = await ActionService.devolver(userID, userRole, actionRequest);

    res.status(200).json({
      success: true,
      data: {
        actionType: 'devolver',
        classroomID: IDClassroomFK,
        newState: result.classroomState,
        message: result.message
      },
      message: 'Key returned successfully'
    } as SimpleActionResponse);
  });

  /**
   * POST /actions/solicitar - Admin requests key for student
   */
  static solicitar = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { IDClassroomFK, TargetUserID, Notes } = req.body;
    const userID = req.user?.id ? parseInt(req.user.id) : 0;
    const userRole = (req.user?.role as UserRole) || 'admin';

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req);
    ValidationUtils.validateRequired(TargetUserID, 'TargetUserID', req);
    ValidationUtils.validateRequired(userID, 'userID', req);

    // Validate IDs are positive integers
    if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
      ValidationUtils.validateRequired(null, 'IDClassroomFK', req);
    }
    if (!Number.isInteger(TargetUserID) || TargetUserID <= 0) {
      ValidationUtils.validateRequired(null, 'TargetUserID', req);
    }

    // Validate Notes length if provided
    if (Notes && typeof Notes === 'string') {
      ValidationUtils.validateLength(Notes, 'Notes', 1, 500, req);
    }

    const actionRequest: SolicitarActionRequest = {
      IDClassroomFK,
      TargetUserID,
      Notes
    };

    const result = await ActionService.solicitar(userID, userRole, actionRequest);

    res.status(200).json({
      success: true,
      data: {
        actionType: 'solicitar',
        classroomID: IDClassroomFK,
        targetUserID: TargetUserID,
        newState: result.classroomState,
        message: result.message
      },
      message: 'Key assigned to student successfully'
    } as SimpleActionResponse);
  });

  /**
   * POST /actions/suspender - Admin suspends key
   */
  static suspender = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { IDClassroomFK, Reason, Notes } = req.body;
    const userID = req.user?.id ? parseInt(req.user.id) : 0;
    const userRole = (req.user?.role as UserRole) || 'admin';

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req);
    ValidationUtils.validateRequired(Reason, 'Reason', req);
    ValidationUtils.validateRequired(userID, 'userID', req);

    // Validate IDClassroomFK is a positive integer
    if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
      ValidationUtils.validateRequired(null, 'IDClassroomFK', req);
    }

    // Validate Reason length
    ValidationUtils.validateLength(Reason, 'Reason', 1, 200, req);

    // Validate Notes length if provided
    if (Notes && typeof Notes === 'string') {
      ValidationUtils.validateLength(Notes, 'Notes', 1, 500, req);
    }

    const actionRequest: SuspenderActionRequest = {
      IDClassroomFK,
      Reason,
      Notes
    };

    const result = await ActionService.suspender(userID, userRole, actionRequest);

    res.status(200).json({
      success: true,
      data: {
        actionType: 'suspender',
        classroomID: IDClassroomFK,
        reason: Reason,
        newState: result.classroomState,
        message: result.message
      },
      message: 'Classroom suspended successfully'
    } as SimpleActionResponse);
  });

  /**
   * POST /actions/liberar - Admin releases key
   */
  static liberar = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { IDClassroomFK, Notes } = req.body;
    const userID = req.user?.id ? parseInt(req.user.id) : 0;
    const userRole = (req.user?.role as UserRole) || 'admin';

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req);
    ValidationUtils.validateRequired(userID, 'userID', req);

    // Validate IDClassroomFK is a positive integer
    if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
      ValidationUtils.validateRequired(null, 'IDClassroomFK', req);
    }

    // Validate Notes length if provided
    if (Notes && typeof Notes === 'string') {
      ValidationUtils.validateLength(Notes, 'Notes', 1, 500, req);
    }

    const actionRequest: LiberarActionRequest = {
      IDClassroomFK,
      Notes
    };

    const result = await ActionService.liberar(userID, userRole, actionRequest);

    res.status(200).json({
      success: true,
      data: {
        actionType: 'liberar',
        classroomID: IDClassroomFK,
        newState: result.classroomState,
        message: result.message
      },
      message: 'Classroom released successfully'
    } as SimpleActionResponse);
  });

  /**
   * GET /actions/permissions - Get user permissions for actions
   */
  static getPermissions = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userRole = (req.user?.role as UserRole) || 'student';
    
    const permissions = ActionService.getUserPermissions(userRole);

    res.status(200).json({
      success: true,
      data: {
        userRole,
        permissions
      },
      message: 'User permissions retrieved successfully'
    });
  });

  /**
   * GET /actions/classroom/:id/state - Get classroom state validation for actions
   */
  static getClassroomStateValidation = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userRole = (req.user?.role as UserRole) || 'student';

    ValidationUtils.validateRequired(id, 'id', req);

    // Get classroom state
    const classroom = await ActionService.getClassroomAndValidate(parseInt(id));
    
    // Get state validation for all actions
    const stateValidations: Record<string, unknown> = {};
    const actionTypes = ['reservar', 'trocar', 'devolver', 'solicitar', 'suspender', 'liberar'] as const;
    
    for (const actionType of actionTypes) {
      stateValidations[actionType] = ActionService.validateClassroomStateForAction(
        classroom.State as ClassroomState,
        actionType
      );
    }

    res.status(200).json({
      success: true,
      data: {
        classroomID: parseInt(id),
        currentState: classroom.State,
        stateValidations,
        userRole
      },
      message: 'Classroom state validation retrieved successfully'
    });
  });

  /**
   * GET /actions/user/:id/permissions - Get specific user permissions
   */
  static getUserPermissions = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userRole = (req.user?.role as UserRole) || 'student';

    ValidationUtils.validateRequired(id, 'id', req);

    // Validate user ID is a positive integer
    if (!Number.isInteger(parseInt(id)) || parseInt(id) <= 0) {
      ValidationUtils.validateRequired(null, 'id', req);
    }

    const userPermissions = ActionService.validateUserPermissions(parseInt(id), userRole);

    res.status(200).json({
      success: true,
      data: userPermissions,
      message: 'User permissions retrieved successfully'
    });
  });
}
