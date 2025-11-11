import { Response, Request } from 'express';
import { ErrorHandler } from '../middleware/errorHandler';
import { ActionService } from '../services/actionService';
import { ValidationUtils, RequestWithUser } from '../utils/errorUtils';
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
import { PrismaClient } from '@prisma/client';
import { User } from '../types/user';

export class ActionController {
  /**
   * POST /actions/reservar - Student reserves key from administration
   */
  static reservar = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
      const { IDClassroomFK } = req.body
      const user = (req as RequestWithUser).user

      // Validate required fields
      ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req)
      ValidationUtils.validateRequired(user?.id, 'userID', req)

      const userId = parseInt(user!.id)

      // Debug: Log the user information
      console.log(
          `[DEBUG] Controller Reservar - IDUser: ${userId}, IDClassroomFK: ${IDClassroomFK}, nome: ${user?.name}`,
      )

      const actionRequest: ReservarActionRequest = {
          IDClassroomFK,
      }

      const result = await ActionService.reservar(user as User, actionRequest)

      res.status(200).json({
          success: true,
          data: {
              actionType: 'reservar',
              classroomID: IDClassroomFK,
              newState: result.classroomState,
              message: result.message,
          },
          message: 'Key reserved successfully',
      } as SimpleActionResponse)
  });

  /**
   * POST /actions/trocar - Student exchanges key with another student
   */
  static trocar = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
      const { IDClassroomFK } = req.body
      const user = (req as RequestWithUser).user

      // Validate required fields
      ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req)
      ValidationUtils.validateRequired(user?.id, 'userID', req)

      const userId = parseInt(user!.id)

      // Debug: Log the user information
      console.log(
          `[DEBUG] Controller Trocar - IDUser: ${userId}, IDClassroomFK: ${IDClassroomFK}, nome: ${user?.name}`,
      )

      // Validate IDs are positive integers
      if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
          ValidationUtils.validateRequired(null, 'IDClassroomFK', req)
      }

      const actionRequest: TrocarActionRequest = {
          IDClassroomFK,
      }

      const result = await ActionService.trocar(user as User, actionRequest)

      res.status(200).json({
          success: true,
          data: {
              actionType: 'trocar',
              classroomID: IDClassroomFK,
              newState: result.classroomState,
              message: result.message,
          },
          message: 'Key transferred successfully',
      } as SimpleActionResponse)
  });

  /**
   * POST /actions/devolver - Student returns key to administration
   */
  static devolver = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { IDClassroomFK } = req.body;
    const user = (req as RequestWithUser).user

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req)
    ValidationUtils.validateRequired(user?.id, 'userID', req)

    const userId = parseInt(user!.id)

    // Debug: Log the user information
    console.log(`[DEBUG] Controller Devolver - IDUser: ${userId}, IDClassroomFK: ${IDClassroomFK}, nome: ${user?.name}`)

    // Validate IDClassroomFK is a positive integer
    if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
      ValidationUtils.validateRequired(null, 'IDClassroomFK', req);
    }

    const actionRequest: DevolverActionRequest = {
      IDClassroomFK
    };

    const result = await ActionService.devolver(user as User, actionRequest)

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
  static solicitar = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { IDClassroomFK } = req.body;
    const user = (req as RequestWithUser).user

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req)
    ValidationUtils.validateRequired(user?.id, 'userID', req)

    const userId = parseInt(user!.id)

    // Debug: Log the user information
    console.log(`[DEBUG] Controller solicitar - IDUser: ${userId}, IDClassroomFK: ${IDClassroomFK}, nome: ${user?.name}`)

    // Validate IDClassroomFK is a positive integer
    if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
        ValidationUtils.validateRequired(null, 'IDClassroomFK', req)
    }

    const actionRequest: SolicitarActionRequest = {
      IDClassroomFK
    };

    const result = await ActionService.solicitar(user as User, actionRequest);

    res.status(200).json({
      success: true,
      data: {
        actionType: 'solicitar',
        classroomID: IDClassroomFK,
        newState: result.classroomState,
        message: result.message
      },
      message: 'Key requested from student successfully'
    } as SimpleActionResponse);
  });

  /**
   * POST /actions/suspender - Admin suspends key
   */
  static suspender = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
      const { IDClassroomFK, Reason } = req.body
      const user = (req as RequestWithUser).user

      // Validate required fields
      ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req)
      ValidationUtils.validateRequired(user?.id, 'userID', req)
      ValidationUtils.validateRequired(Reason, 'Reason', req)

      const userId = parseInt(user!.id)

      // Debug: Log the user information
      console.log(
          `[DEBUG] Controller Suspender - IDUser: ${userId}, IDClassroomFK: ${IDClassroomFK}, nome: ${user?.name}`,
      )

      // Validate IDClassroomFK is a positive integer
      if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
          ValidationUtils.validateRequired(null, 'IDClassroomFK', req)
      }

      // Validate Reason length
      ValidationUtils.validateLength(Reason, 'Reason', 1, 200, req)

      const actionRequest: SuspenderActionRequest = {
          IDClassroomFK,
          Reason,
      }

      const result = await ActionService.suspender(user as User, actionRequest)

      res.status(200).json({
          success: true,
          data: {
              actionType: 'suspender',
              classroomID: IDClassroomFK,
              reason: Reason,
              newState: result.classroomState,
              message: result.message,
          },
          message: 'Classroom suspended successfully',
      } as SimpleActionResponse)
  });

  /**
   * POST /actions/liberar - Admin releases key
   */
  static liberar = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { IDClassroomFK, Reason } = req.body;
    const user = (req as RequestWithUser).user

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req)
    ValidationUtils.validateRequired(user?.id, 'userID', req)
    ValidationUtils.validateRequired(Reason, 'Reason', req)

    const userId = parseInt(user!.id)

    // Debug: Log the user information
    console.log(
        `[DEBUG] Controller Liberar - IDUser: ${userId}, IDClassroomFK: ${IDClassroomFK}, nome: ${user?.name}`,
    )

    // Validate required fields
    ValidationUtils.validateRequired(IDClassroomFK, 'IDClassroomFK', req);
    ValidationUtils.validateRequired(userId, 'userID', req);

    // Validate IDClassroomFK is a positive integer
    if (!Number.isInteger(IDClassroomFK) || IDClassroomFK <= 0) {
      ValidationUtils.validateRequired(null, 'IDClassroomFK', req);
    }

    const actionRequest: LiberarActionRequest = {
      IDClassroomFK,
      Reason
    };

    const result = await ActionService.liberar(user as User, actionRequest);

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
  static getPermissions = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { userRole } = req.query;
    // Try to get user info from mock auth middleware first, then from query
    const mockUser = (req as RequestWithUser).user;
    const role = (mockUser?.role as UserRole) || (userRole as UserRole) || 'student';
    
    const permissions = ActionService.getUserPermissions(role);

    res.status(200).json({
      success: true,
      data: {
        userRole: role,
        permissions
      },
      message: 'User permissions retrieved successfully'
    });
  });

  /**
   * GET /actions/classroom/:id/state - Get classroom state validation for actions
   */
  static getClassroomStateValidation = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userRole } = req.query;
    // Try to get user info from mock auth middleware first, then from query
    const mockUser = (req as RequestWithUser).user
    const role = (mockUser?.role as UserRole) || (userRole as UserRole) || 'student';

    ValidationUtils.validateRequired(id, 'id', req);

    // Get classroom state
    const classroom = await ActionService.getClassroomAndValidate(parseInt(id));
    
    // Get state validation for all actions
    const stateValidations: Record<string, unknown> = {};
    const actionTypes = ['reservar', 'trocar', 'devolver', 'solicitar', 'suspender', 'liberar', 'suspenso'] as const;
    
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
        userRole: role
      },
      message: 'Classroom state validation retrieved successfully'
    });
  });

  /**
   * GET /actions/user/:id/permissions - Get specific user permissions
   */
  static getUserPermissions = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userRole } = req.query;
    // Try to get user info from mock auth middleware first, then from query
    const mockUser = (req as RequestWithUser).user
    const role = (mockUser?.role as UserRole) || (userRole as UserRole) || 'student';

    ValidationUtils.validateRequired(id, 'id', req);

    // Validate user ID is a positive integer
    if (!Number.isInteger(parseInt(id)) || parseInt(id) <= 0) {
      ValidationUtils.validateRequired(null, 'id', req);
    }

    const userPermissions = ActionService.validateUserPermissions(parseInt(id), role);

    res.status(200).json({
      success: true,
      data: userPermissions,
      message: 'User permissions retrieved successfully'
    });
  });

  /**
   * POST /actions/process-reservation - Approve or reject a reservation request
   */
  static processReservation = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { notificationId, approved } = req.body;
    
    // Validate required fields
    ValidationUtils.validateRequired(notificationId, 'notificationId', req);
    ValidationUtils.validateRequired(approved, 'approved', req);

    // Validate notificationId is a positive integer
    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      ValidationUtils.validateRequired(null, 'notificationId', req);
    }

    // Validate approved is a boolean
    if (typeof approved !== 'boolean') {
      throw new Error('Invalid approved value. Must be boolean.');
    }

    const result = await ActionService.processReservationRequest(notificationId, approved);

    res.status(200).json({
      success: true,
      data: {
        notificationId,
        approved,
        newState: result.classroomState,
        message: result.message,
        history: result.history, // Include history if available
      },
      message: result.message
    });
  });

  /**
   * POST /actions/process-devolution - Confirm or reject a devolution request
   */
  static processDevolution = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { notificationId, confirmed } = req.body;
    
    ValidationUtils.validateRequired(notificationId, 'notificationId', req);
    ValidationUtils.validateRequired(confirmed, 'confirmed', req);

    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      ValidationUtils.validateRequired(null, 'notificationId', req);
    }

    if (typeof confirmed !== 'boolean') {
      throw new Error('Invalid confirmed value. Must be boolean.');
    }

    const result = await ActionService.processDevolutionRequest(notificationId, confirmed);

    res.status(200).json({
      success: true,
      data: {
        notificationId,
        confirmed,
        newState: result.classroomState,
        message: result.message
      },
      message: result.message
    });
  });

  /**
   * GET /actions/debug/users - Debug endpoint to check user lookup
   */
  static debugUsers = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const prisma = new PrismaClient();

    try {
      // Get all users
      const users = await prisma.user.findMany({
        select: {
          IDUser: true,
          Name: true,
          Email: true
        }
      });

      // Get all classrooms with their responsible
      const classrooms = await prisma.classroom.findMany({
        select: {
          IDClassroom: true,
          Name: true,
          NameResponsible: true,
          State: true
        }
      });

      // Test finding specific users
      const joaoUser = await prisma.user.findFirst({
        where: {
          Name: {
            equals: 'João Silva',
            mode: 'insensitive'
          }
        },
        select: {
          IDUser: true,
          Name: true,
          Email: true
        }
      });

      const walterUser = await prisma.user.findFirst({
        where: {
          Name: {
            equals: 'Walter Soares Costa Neto',
            mode: 'insensitive'
          }
        },
        select: {
          IDUser: true,
          Name: true,
          Email: true
        }
      });

      res.status(200).json({
        success: true,
        data: {
          users,
          classrooms,
          testUsers: {
            joao: joaoUser,
            walter: walterUser
          }
        }
      });
    } catch (error) {
      console.error('Debug error:', error);
      res.status(500).json({
        success: false,
        message: 'Debug failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      await prisma.$disconnect();
    }
  });

  /**
   * POST /actions/process-key-request - Accept or reject a key request
   */
  static processKeyRequest = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { notificationId, confirmed } = req.body;
    
    ValidationUtils.validateRequired(notificationId, 'notificationId', req);
    ValidationUtils.validateRequired(confirmed, 'confirmed', req);

    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      ValidationUtils.validateRequired(null, 'notificationId', req);
    }

    if (typeof confirmed !== 'boolean') {
      throw new Error('Invalid confirmed value. Must be boolean.');
    }

    const result = await ActionService.processKeyRequest(notificationId, confirmed);

    res.status(200).json({
      success: true,
      data: {
        notificationId,
        confirmed,
        newState: result.classroomState,
        message: result.message
      },
      message: result.message
    });
  });

  /**
   * POST /actions/process-trade - Accept or reject a trade request
   */
  static processTrade = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { notificationId, accepted } = req.body;
    
    ValidationUtils.validateRequired(notificationId, 'notificationId', req);
    ValidationUtils.validateRequired(accepted, 'accepted', req);

    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      ValidationUtils.validateRequired(null, 'notificationId', req);
    }

    if (typeof accepted !== 'boolean') {
      throw new Error('Invalid accepted value. Must be boolean.');
    }

    const result = await ActionService.processTradeRequest(notificationId, accepted);

    res.status(200).json({
      success: true,
      data: {
        notificationId,
        accepted,
        newState: result.classroomState,
        message: result.message
      },
      message: result.message
    });
  });
}
