import { PrismaClient } from '@prisma/client'
import { AppError, ErrorCode } from '../types/errors'
import {
    ActionType,
    UserRole,
    ReservarActionRequest,
    TrocarActionRequest,
    DevolverActionRequest,
    SolicitarActionRequest,
    SuspenderActionRequest,
    LiberarActionRequest,
    ActionResult,
    PermissionCheck,
    StateTransitionRule,
    ClassroomStateValidation,
    UserPermissionValidation,
    STATE_TRANSITIONS,
    PERMISSIONS,
} from '../types/actions'
import { ClassroomState } from '../types/classroom'
import { getIO } from './websocketService' // Import getIO
import { User } from '../types/user'
import { HistoryService } from './historyService'

const prisma = new PrismaClient()

export class ActionService {
    /**
     * Execute reservar action (student reserves key from administration)
     */
    static async reservar(user: User, request: ReservarActionRequest): Promise<ActionResult> {
        try {
            // Get classroom and validate state
            const classroom = await this.getClassroomAndValidate(request.IDClassroomFK)
            this.validateClassroomState(classroom.State as ClassroomState, 'reservar', 'student')

            // Check if user already has an active reservation
            const activeReservation = await this.getActiveReservation(parseInt(user!.id), request.IDClassroomFK)
            if (activeReservation) {
                throw new AppError(
                    ErrorCode.BUSINESS_RULE_VIOLATION,
                    'User already has an active reservation for this classroom',
                    400,
                )
            }

            if (!user) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'User not found', 404)
            }

            // Debug: Log the user information
            console.log(`[DEBUG] Reservar - UserID: ${user.id}, UserName: ${user.name}`)

            // Instead of directly reserving, create a notification for all admins
            // Find all admin users
            const admins = await prisma.user.findMany({
                where: {
                    Admin: {
                        isNot: null,
                    },
                },
                select: {
                    IDUser: true,
                    Name: true,
                },
            })

            if (admins.length === 0) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'No admin users found', 404)
            }

            // Create notification for each admin with reservation request details
            const notificationPromises = admins.map((admin) =>
                prisma.notification.create({
                    data: {
                        IDUserFK: admin.IDUser,
                        Message: JSON.stringify({
                            type: 'reservation_request',
                            studentID: user.id,
                            studentName: user.name,
                            classroomID: request.IDClassroomFK,
                            classroomName: classroom.Name,
                            action: 'reservar',
                        }),
                    },
                }),
            )

            const createdNotifications = await Promise.all(notificationPromises)

            // Emit WebSocket event for each created notification
            const io = getIO()
            createdNotifications.forEach((notification) => {
                io.to(`user:${notification.IDUserFK}`).emit('new_notification', notification)
            })

            console.log(`[DEBUG] Created ${admins.length} notifications for admin approval`)

            return {
                success: true,
                classroomState: classroom.State as ClassroomState,
                message: 'Reservation request sent to administration. Please wait for approval.',
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to execute reservar action', 500)
        }
    }

    /**
     * Execute trocar action (student exchanges key with another student)
     */
    static async trocar(user: User, request: TrocarActionRequest): Promise<ActionResult> {
        try {
            // Debug: Log the trocar action
            console.log(`[DEBUG] Trocar - UserID: ${user.id}, ClassroomID: ${request.IDClassroomFK}`)

            // Validate permissions
            this.validatePermission(user.role!, 'trocar')

            // Get classroom and validate state
            const classroom = await this.getClassroomAndValidate(request.IDClassroomFK)
            console.log(
                `[DEBUG] Trocar - Current classroom state: ${classroom.State}, Responsible: ${classroom.NameResponsible}`,
            )

            this.validateClassroomState(classroom.State as ClassroomState, 'trocar', user.role!)

            // Verificar se a sala tem alguém como responsável (tem a chave)
            if (!classroom.NameResponsible || classroom.NameResponsible === 'Secretaria') {
                throw new AppError(
                    ErrorCode.BUSINESS_RULE_VIOLATION,
                    'No one currently has the key for this classroom',
                    400,
                )
            }

            // Verificar se o usuário que fez a requisição já tem a chave
            const activeReservation = await this.getActiveReservation(parseInt(user!.id), request.IDClassroomFK)
            if (activeReservation) {
                throw new AppError(
                    ErrorCode.BUSINESS_RULE_VIOLATION,
                    'User already has an active reservation for this classroom',
                    400,
                )
            }

            // Find the user who currently has the key - try multiple approaches
            let currentKeyHolder = await prisma.user.findFirst({
                where: {
                    IDUser: {
                        equals: classroom.IDResponsible,
                    },
                },
                select: {
                    IDUser: true,
                    Name: true,
                },
            })

            // If not found, try exact match
            if (!currentKeyHolder) {
                currentKeyHolder = await prisma.user.findFirst({
                    where: {
                        IDUser: classroom.IDResponsible,
                    },
                    select: {
                        IDUser: true,
                        Name: true,
                    },
                })
            }

            console.log(`[DEBUG] Trocar - Classroom Responsible: ${classroom.NameResponsible}`)
            console.log(`[DEBUG] Trocar - Classroom Responsible length: ${classroom.NameResponsible?.length}`)
            console.log(
                `[DEBUG] Trocar - Classroom Responsible char codes:`,
                classroom.NameResponsible?.split('').map((c) => c.charCodeAt(0)),
            )
            console.log(`[DEBUG] Trocar - Found current key holder:`, currentKeyHolder)

            if (!currentKeyHolder) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Current key holder not found', 404)
            }

            // Create a notification for the current key holder asking if they want to transfer
            const notification = await prisma.notification.create({
                data: {
                    IDUserFK: currentKeyHolder.IDUser,
                    Message: JSON.stringify({
                        type: 'trade_request',
                        requestingStudentID: user.id,
                        requestingStudentName: user.name,
                        currentHolderID: currentKeyHolder.IDUser,
                        currentHolderName: currentKeyHolder.Name,
                        classroomID: request.IDClassroomFK,
                        classroomName: classroom.Name,
                        action: 'trocar',
                    }),
                },
            })

            // Emit WebSocket event
            const io = getIO()
            io.to(`user:${notification.IDUserFK}`).emit('new_notification', notification)

            console.log(`[DEBUG] Created trade request notification for ${currentKeyHolder.Name}`)
            console.log(`[DEBUG] Notification ID: ${notification.IDNotification}`)
            console.log(`[DEBUG] Notification User ID: ${notification.IDUserFK}`)
            console.log(`[DEBUG] Notification Message: ${notification.Message}`)

            return {
                success: true,
                classroomState: classroom.State as ClassroomState,
                message: 'Trade request sent to current key holder. Please wait for response.',
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to execute trocar action', 500)
        }
    }

    /**
     * Execute devolver action (student returns key to administration)
     */
    static async devolver(user: User, request: DevolverActionRequest): Promise<ActionResult> {
        try {
            // Debug: Log the trocar action
            console.log(`[DEBUG] Trocar - UserID: ${user.id}, ClassroomID: ${request.IDClassroomFK}`)

            // Validate permissions
            this.validatePermission(user.role!, 'devolver')

            // Get classroom and validate state
            const classroom = await this.getClassroomAndValidate(request.IDClassroomFK)
            console.log(
                `[DEBUG] Devolver - Current classroom state: ${classroom.State}, Responsible: ${classroom.NameResponsible}`,
            )

            this.validateClassroomState(classroom.State as ClassroomState, 'devolver', user.role!)

            // Verificar se a sala tem alguém como responsável (tem a chave)
            if (!classroom.NameResponsible || classroom.NameResponsible === 'Secretaria') {
                throw new AppError(
                    ErrorCode.BUSINESS_RULE_VIOLATION,
                    'No one currently has the key for this classroom',
                    400,
                )
            }

            // Check if user has active reservation for this classroom
            const activeReservation = await this.getActiveReservation(parseInt(user!.id), request.IDClassroomFK)
            console.log(`[DEBUG] Devolver - Active reservation:`, activeReservation)

            if (!activeReservation) {
                throw new AppError(
                    ErrorCode.BUSINESS_RULE_VIOLATION,
                    'User does not have an active reservation for this classroom',
                    400,
                )
            }

            // Instead of directly devolving, create a notification for all admins
            // Find all admin users
            const admins = await prisma.user.findMany({
                where: {
                    Admin: {
                        isNot: null,
                    },
                },
                select: {
                    IDUser: true,
                    Name: true,
                },
            })

            if (admins.length === 0) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'No admin users found', 404)
            }

            // Create notification for each admin with devolution request details
            const notificationPromises = admins.map((admin) =>
                prisma.notification.create({
                    data: {
                        IDUserFK: admin.IDUser,
                        Message: JSON.stringify({
                            type: 'devolution_request',
                            studentID: parseInt(user!.id),
                            studentName: user.name,
                            classroomID: request.IDClassroomFK,
                            classroomName: classroom.Name,
                            action: 'devolver',
                        }),
                    },
                }),
            )

            const createdNotifications = await Promise.all(notificationPromises)

            // Emit WebSocket event for each created notification
            const io = getIO()
            createdNotifications.forEach((notification) => {
                io.to(`user:${notification.IDUserFK}`).emit('new_notification', notification)
            })

            console.log(`[DEBUG] Created ${admins.length} notifications for devolution confirmation`)

            return {
                success: true,
                classroomState: classroom.State as ClassroomState,
                message: 'Devolution request sent to administration. Please wait for confirmation.',
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to execute devolver action', 500)
        }
    }

    /**
     * Execute solicitar action (admin requests key from user - obrigatório)
     */
    static async solicitar(user: User, request: SolicitarActionRequest): Promise<ActionResult> {
        try {
            // Debug: Log the solicitar action
            console.log(`[DEBUG] Solicitar - UserID: ${user.id}, ClassroomID: ${request.IDClassroomFK}`)

            // Validate permissions
            this.validatePermission(user.role!, 'solicitar')

            // Get classroom and validate state
            const classroom = await this.getClassroomAndValidate(request.IDClassroomFK)
            console.log(
                `[DEBUG] Solicitar - Current classroom state: ${classroom.State}, Responsible: ${classroom.NameResponsible}`,
            )

            this.validateClassroomState(classroom.State as ClassroomState, 'solicitar', user.role!)

            // Verificar se a sala tem alguém como responsável (não pode ser Secretaria)
            if (!classroom.NameResponsible || classroom.NameResponsible === 'Secretaria') {
                throw new AppError(
                    ErrorCode.BUSINESS_RULE_VIOLATION,
                    'No one currently has the key for this classroom',
                    400,
                )
            }

            // Find the user who currently has the key - try multiple approaches
            let currentKeyHolder = await prisma.user.findFirst({
                where: {
                    IDUser: {
                        equals: classroom.IDResponsible,
                    },
                },
                select: {
                    IDUser: true,
                    Name: true,
                },
            })

            // If not found, try exact match
            if (!currentKeyHolder) {
                currentKeyHolder = await prisma.user.findFirst({
                    where: {
                        IDUser: classroom.IDResponsible,
                    },
                    select: {
                        IDUser: true,
                        Name: true,
                    },
                })
            }

            console.log(`[DEBUG] Solicitar - Classroom Responsible: ${classroom.NameResponsible}`)
            console.log(`[DEBUG] Solicitar - Classroom Responsible length: ${classroom.NameResponsible?.length}`)
            console.log(
                `[DEBUG] Solicitar - Classroom Responsible char codes:`,
                classroom.NameResponsible?.split('').map((c) => c.charCodeAt(0)),
            )
            console.log(`[DEBUG] Solicitar - Found current key holder:`, currentKeyHolder)

            if (!currentKeyHolder) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Current key holder not found', 404)
            }

            // Get admin user info
            const adminUser = await prisma.user.findUnique({
                where: {
                    IDUser: parseInt(user.id),
                },
                select: {
                    Name: true,
                },
            })

            if (!adminUser) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Admin user not found', 404)
            }

            // Create notification for the current key holder
            const notification = await prisma.notification.create({
                data: {
                    IDUserFK: currentKeyHolder.IDUser,
                    Message: JSON.stringify({
                        type: 'request_key',
                        adminID: user.id,
                        adminName: adminUser.Name,
                        studentID: currentKeyHolder.IDUser,
                        studentName: currentKeyHolder.Name,
                        classroomID: request.IDClassroomFK,
                        classroomName: classroom.Name,
                        action: 'solicitar',
                    }),
                },
            })

            // Emit WebSocket event
            const io = getIO()
            io.to(`user:${notification.IDUserFK}`).emit('new_notification', notification)

            console.log(`[DEBUG] Created key request notification for ${currentKeyHolder.Name}`)
            console.log(`[DEBUG] Notification ID: ${notification.IDNotification}`)
            console.log(`[DEBUG] Notification User ID: ${notification.IDUserFK}`)
            console.log(`[DEBUG] Notification Message: ${notification.Message}`)

            // Don't update classroom state immediately - wait for student response

            return {
                success: true,
                classroomState: classroom.State as ClassroomState,
                message: 'Key request sent to student. Please wait for response.',
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to execute solicitar action', 500)
        }
    }

    /**
     * Execute suspender action (admin suspends classroom - only if available)
     */
    static async suspender(user: User, request: SuspenderActionRequest): Promise<ActionResult> {
        try {
            // Validate permissions
            this.validatePermission(user.role!, 'suspender')

            // Get classroom and validate state
            const classroom = await this.getClassroomAndValidate(request.IDClassroomFK)
            this.validateClassroomState(classroom.State as ClassroomState, 'suspender', user.role!)

            // Update classroom state - admin suspende sala (só se estiver disponível)
            await this.updateClassroomState(
                request.IDClassroomFK,
                'Indisponivel',
                'Secretaria',
                parseInt(user.id),
                request.Reason,
            )

            // Emit WebSocket event to notify all clients
            getIO().emit('notification_approved_classroom_update')
            // Create notification for all users with active reservations (commented for future implementation)
            // await this.notifyUsersWithActiveReservations(request.IDClassroomFK, 'Classroom suspended by administration');

            return {
                success: true,
                classroomState: 'Indisponivel',
                message: 'Classroom suspended successfully',
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to execute suspender action', 500)
        }
    }

    /**
     * Execute liberar action (admin releases suspended classroom)
     */
    static async liberar(user: User, request: LiberarActionRequest): Promise<ActionResult> {
        try {
            // Validate permissions
            this.validatePermission(user.role!, 'liberar')

            // Get classroom and validate state
            const classroom = await this.getClassroomAndValidate(request.IDClassroomFK)
            this.validateClassroomState(classroom.State as ClassroomState, 'liberar', user.role!)

            // Update classroom state - admin libera sala suspensa
            await this.updateClassroomState(
                request.IDClassroomFK,
                'Disponivel',
                'Secretaria',
                parseInt(user.id),
                request.Reason,
            )

            // Emit WebSocket event to notify all clients
            getIO().emit('notification_approved_classroom_update')

            // Create notification (commented for future implementation)
            // await this.createNotification(userID, 'Classroom released and available', 'liberar', request.IDClassroomFK);

            return {
                success: true,
                classroomState: 'Disponivel',
                message: 'Classroom released successfully',
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to execute liberar action', 500)
        }
    }

    /**
     * Validate user permissions for specific action
     */
    static validatePermission(userRole: UserRole, action: ActionType): void {
        const allowedActions = PERMISSIONS[userRole]
        if (!allowedActions.includes(action)) {
            throw new AppError(
                ErrorCode.FORBIDDEN,
                `User role '${userRole}' is not authorized to perform '${action}' action`,
                403,
            )
        }
    }

    /**
     * Validate classroom state for specific action
     */
    static validateClassroomState(currentState: ClassroomState, action: ActionType, userRole: UserRole): void {
        const validTransitions = STATE_TRANSITIONS.filter(
            (rule: StateTransitionRule) => rule.action === action && rule.allowedRoles.includes(userRole),
        )

        const isValidTransition = validTransitions.some((rule: StateTransitionRule) => rule.from === currentState)

        if (!isValidTransition) {
            throw new AppError(
                ErrorCode.BUSINESS_RULE_VIOLATION,
                `Cannot perform '${action}' action on classroom in '${currentState}' state`,
                400,
            )
        }
    }

    /**
     * Get classroom and validate it exists
     */
    static async getClassroomAndValidate(classroomID: number) {
        const classroom = await prisma.classroom.findUnique({
            where: { IDClassroom: classroomID },
        })

        if (!classroom) {
            throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Classroom not found', 404)
        }

        return classroom
    }

    /**
     * Update classroom state and responsible
     */
    static async updateClassroomState(
        classroomID: number,
        newState: ClassroomState,
        responsible?: string,
        responsibleID?: number,
        secretaryNote?: string,
    ): Promise<void> {
        const updateData: {
            State: ClassroomState
            NameResponsible?: string
            IDResponsible?: number
            SecretaryNote?: string
        } = { State: newState }
        if (responsible !== undefined) {
            updateData.NameResponsible = responsible
        }
        if (responsibleID !== undefined) {
            updateData.IDResponsible = responsibleID
        }
        if (secretaryNote !== undefined) {
            updateData.SecretaryNote = secretaryNote
        }

        // Debug: Log the update data
        console.log(
            `[DEBUG] updateClassroomState - ClassroomID: ${classroomID}, State: ${newState}, Responsible: ${responsible}, IDResponsible: ${responsibleID}, SecretaryNote: ${secretaryNote}`,
        )

        await prisma.classroom.update({
            where: { IDClassroom: classroomID },
            data: updateData,
        })
    }

    /**
     * Get active reservation for user and classroom
     * Verifica se o usuário está como responsável pela sala (tem a chave)
     */
    static async getActiveReservation(userID: number, classroomID: number) {
        // Buscar o usuário para obter o nome
        const user = await prisma.user.findUnique({
            where: { IDUser: userID },
            select: { Name: true },
        })

        if (!user) {
            return null
        }

        // Verificar se a sala está com o usuário como responsável
        const classroom = await prisma.classroom.findFirst({
            where: {
                IDClassroom: classroomID,
                NameResponsible: user.Name, // O usuário está como responsável
                State: 'Em uso', // E a sala está em uso
            },
        })

        return classroom ? { IDClassroom: classroom.IDClassroom, NameResponsible: classroom.NameResponsible } : null
    }

    /**
     * Validate target user exists and has correct role
     */
    static async validateTargetUser(userID: number, expectedRole: UserRole) {
        const user = await prisma.user.findUnique({
            where: { IDUser: userID },
            include: {
                Student: true,
                Admin: true,
            },
        })

        if (!user) {
            throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Target user not found', 404)
        }

        // Check if user has the expected role
        const hasStudentRole = user.Student !== null
        const hasAdminRole = user.Admin !== null

        if (expectedRole === 'student' && !hasStudentRole) {
            throw new AppError(ErrorCode.BUSINESS_RULE_VIOLATION, 'Target user is not a student', 400)
        }

        if (expectedRole === 'admin' && !hasAdminRole) {
            throw new AppError(ErrorCode.BUSINESS_RULE_VIOLATION, 'Target user is not an admin', 400)
        }

        return user
    }

    /**
     * Get user permissions for all actions
     */
    static getUserPermissions(userRole: UserRole): PermissionCheck {
        const allowedActions = PERMISSIONS[userRole]

        return {
            canReservar: allowedActions.includes('reservar'),
            canTrocar: allowedActions.includes('trocar'),
            canDevolver: allowedActions.includes('devolver'),
            canSolicitar: allowedActions.includes('solicitar'),
            canSuspender: allowedActions.includes('suspender'),
            canLiberar: allowedActions.includes('liberar'),
            canSuspenso: allowedActions.includes('suspenso'),
        }
    }

    /**
     * Validate classroom state for action
     */
    static validateClassroomStateForAction(
        classroomState: ClassroomState,
        action: ActionType,
    ): ClassroomStateValidation {
        const validTransitions = STATE_TRANSITIONS.filter((rule: StateTransitionRule) => rule.action === action)
        const canTransition = validTransitions.some((rule: StateTransitionRule) => rule.from === classroomState)

        const allowedActions = STATE_TRANSITIONS.filter(
            (rule: StateTransitionRule) => rule.from === classroomState,
        ).map((rule: StateTransitionRule) => rule.action)

        return {
            currentState: classroomState,
            canTransition,
            allowedActions,
            reason: canTransition ? undefined : `Action '${action}' not allowed from '${classroomState}' state`,
        }
    }

    /**
     * Validate user permissions
     */
    static validateUserPermissions(userID: number, userRole: UserRole): UserPermissionValidation {
        const permissions = this.getUserPermissions(userRole)
        const missingPermissions: string[] = []

        if (!permissions.canReservar) missingPermissions.push('reservar')
        if (!permissions.canTrocar) missingPermissions.push('trocar')
        if (!permissions.canDevolver) missingPermissions.push('devolver')
        if (!permissions.canSolicitar) missingPermissions.push('solicitar')
        if (!permissions.canSuspender) missingPermissions.push('suspender')
        if (!permissions.canLiberar) missingPermissions.push('liberar')
        if (!permissions.canSuspenso) missingPermissions.push('suspenso')

        return {
            userID,
            role: userRole,
            hasPermission: missingPermissions.length === 0,
            missingPermissions,
            reason: missingPermissions.length > 0 ? `Missing permissions: ${missingPermissions.join(', ')}` : undefined,
        }
    }

    /**
     * Approve or reject a reservation request
     */
    static async processReservationRequest(notificationID: number, approved: boolean): Promise<ActionResult> {
        try {
            // Get the notification
            const notification = await prisma.notification.findUnique({
                where: { IDNotification: notificationID },
            })

            if (!notification) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Notification not found', 404)
            }

            // Parse the notification message to get request details
            const requestData = JSON.parse(notification.Message)

            if (requestData.type !== 'reservation_request') {
                throw new AppError(ErrorCode.BUSINESS_RULE_VIOLATION, 'Not a reservation request notification', 400)
            }

            const { studentID, classroomID, classroomName } = requestData

            // Get the student user
            const student = await prisma.user.findUnique({
                where: { IDUser: parseInt(studentID) },
                select: { Name: true },
            })

            if (!student) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Student not found', 404)
            }

            // Mark notification as read
            await prisma.notification.update({
                where: { IDNotification: notificationID },
                data: { ReadAt: new Date() },
            })

            if (approved) {
                // Update classroom state and set student as responsible
                await this.updateClassroomState(classroomID, 'Em uso', student.Name, parseInt(studentID))

                // Emit WebSocket event for classroom update
                getIO().emit('notification_approved_classroom_update')

                // Create notification for the student confirming the approval
                const newNotification = await prisma.notification.create({
                    data: {
                        IDUserFK: parseInt(studentID),
                        Message: JSON.stringify({
                            type: 'reservation_approved',
                            message: `Your reservation request for ${classroomName} has been approved!`,
                            classroomID,
                            classroomName,
                        }),
                    },
                })

                // Create history record
                const history = await HistoryService.createHistory({
                    IDUserFK: parseInt(studentID),
                    IDClassroomFK: classroomID,
                })

                // Emit WebSocket event
                const io = getIO()
                io.to(`user:${newNotification.IDUserFK}`).emit('new_notification', newNotification)

                // Mark all other notifications for this request as read
                const requestKey = `"studentID":${studentID},"classroomID":${classroomID}"`
                await prisma.notification.updateMany({
                    where: {
                        Message: {
                            contains: requestKey,
                        },
                        ReadAt: null,
                        IDNotification: {
                            not: notificationID,
                        },
                    },
                    data: { ReadAt: new Date() },
                })

                console.log(`[DEBUG] Reservation approved for student ${student.Name}, classroom ${classroomName}`)

                return {
                    success: true,
                    classroomState: 'Em uso',
                    message: 'Reservation approved successfully',
                    history: history,
                }
            } else {
                // Create notification for the student rejecting the request
                const newNotification = await prisma.notification.create({
                    data: {
                        IDUserFK: parseInt(studentID),
                        Message: JSON.stringify({
                            type: 'reservation_rejected',
                            message: `Your reservation request for ${classroomName} has been rejected.`,
                            classroomID,
                            classroomName,
                        }),
                    },
                })

                // Emit WebSocket event
                const io = getIO()
                io.to(`user:${newNotification.IDUserFK}`).emit('new_notification', newNotification)

                // Mark all other notifications for this request as read
                const requestKey = `"studentID":${studentID},"classroomID":${classroomID}`
                await prisma.notification.updateMany({
                    where: {
                        Message: {
                            contains: requestKey,
                        },
                        ReadAt: null,
                        IDNotification: {
                            not: notificationID,
                        },
                    },
                    data: { ReadAt: new Date() },
                })

                console.log(`[DEBUG] Reservation rejected for student ${student.Name}, classroom ${classroomName}`)

                return {
                    success: true,
                    classroomState: 'Disponivel',
                    message: 'Reservation rejected',
                }
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to process reservation request', 500)
        }
    }

    /**
     * Approve or reject a devolution request
     */
    static async processDevolutionRequest(notificationID: number, confirmed: boolean): Promise<ActionResult> {
        try {
            // Get the notification
            const notification = await prisma.notification.findUnique({
                where: { IDNotification: notificationID },
            })

            if (!notification) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Notification not found', 404)
            }

            // Parse the notification message to get request details
            const requestData = JSON.parse(notification.Message)

            if (requestData.type !== 'devolution_request') {
                throw new AppError(ErrorCode.BUSINESS_RULE_VIOLATION, 'Not a devolution request notification', 400)
            }

            const { studentID, classroomID, classroomName } = requestData

            // Get the student user
            const student = await prisma.user.findUnique({
                where: { IDUser: parseInt(studentID) },
                select: { Name: true },
            })

            if (!student) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Student not found', 404)
            }

            // Mark notification as read
            await prisma.notification.update({
                where: { IDNotification: notificationID },
                data: { ReadAt: new Date() },
            })

            if (confirmed) {
                // Find the current active history record for the student and classroom
                const currentActiveHistory = await prisma.history.findFirst({
                    where: {
                        IDUserFK: parseInt(studentID),
                        IDClassroomFK: classroomID,
                        ReturnDate: null,
                    },
                })

                if (currentActiveHistory) {
                    // Update the current active history record with a ReturnDate
                    await HistoryService.updateHistory(currentActiveHistory.IDHistory.toString(), {
                        ReturnDate: new Date(),
                    })
                }

                // Update classroom state and set Secretaria as responsible

                await this.updateClassroomState(classroomID, 'Disponivel', 'Secretaria', 1)

                // Emit WebSocket event for classroom update

                getIO().emit('notification_approved_classroom_update')

                // Create notification for the student confirming the devolution

                const newNotification = await prisma.notification.create({
                    data: {
                        IDUserFK: parseInt(studentID),
                        Message: JSON.stringify({
                            type: 'devolution_confirmed',
                            message: `Your devolution of ${classroomName} has been confirmed!`,
                            classroomID,
                            classroomName,
                        }),
                    },
                })

                // Emit WebSocket event
                const io = getIO()
                io.to(`user:${newNotification.IDUserFK}`).emit('new_notification', newNotification)

                // Mark all other notifications for this request as read
                const requestKey = `"studentID":${studentID},"classroomID":${classroomID}`
                await prisma.notification.updateMany({
                    where: {
                        Message: {
                            contains: requestKey,
                        },
                        ReadAt: null,
                        IDNotification: {
                            not: notificationID,
                        },
                    },
                    data: { ReadAt: new Date() },
                })

                console.log(`[DEBUG] Devolution confirmed for student ${student.Name}, classroom ${classroomName}`)

                return {
                    success: true,
                    classroomState: 'Disponivel',
                    message: 'Devolution confirmed successfully',
                }
            } else {
                // Create notification for the student rejecting the devolution
                const newNotification = await prisma.notification.create({
                    data: {
                        IDUserFK: parseInt(studentID),
                        Message: JSON.stringify({
                            type: 'devolution_rejected',
                            message: `Your devolution of ${classroomName} was not confirmed. Please return to the administration.`,
                            classroomID,
                            classroomName,
                        }),
                    },
                })

                // Emit WebSocket event
                const io = getIO()
                io.to(`user:${newNotification.IDUserFK}`).emit('new_notification', newNotification)

                // Mark all other notifications for this request as read
                const requestKey = `"studentID":${studentID},"classroomID":${classroomID}`
                await prisma.notification.updateMany({
                    where: {
                        Message: {
                            contains: requestKey,
                        },
                        ReadAt: null,
                        IDNotification: {
                            not: notificationID,
                        },
                    },
                    data: { ReadAt: new Date() },
                })

                console.log(`[DEBUG] Devolution rejected for student ${student.Name}, classroom ${classroomName}`)

                return {
                    success: true,
                    classroomState: 'Em uso',
                    message: 'Devolution not confirmed',
                }
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to process devolution request', 500)
        }
    }

    /**
     * Process key request (student responds to admin's key request)
     */
    static async processKeyRequest(notificationID: number, confirmed: boolean): Promise<ActionResult> {
        try {
            // Get notification
            const notification = await prisma.notification.findUnique({
                where: {
                    IDNotification: notificationID,
                },
            })

            if (!notification) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Notification not found', 404)
            }

            const parsed = JSON.parse(notification.Message)

            if (parsed.type !== 'request_key') {
                throw new AppError(ErrorCode.BUSINESS_RULE_VIOLATION, 'Invalid notification type', 400)
            }

            const classroomID = parsed.classroomID
            const studentID = parsed.studentID
            const adminID = parsed.adminID

            // Get classroom
            const classroom = await this.getClassroomAndValidate(classroomID)

            if (confirmed) {
                // Find the current active history record for the student and classroom
                const currentActiveHistory = await prisma.history.findFirst({
                    where: {
                        IDUserFK: parseInt(studentID),
                        IDClassroomFK: classroomID,
                        ReturnDate: null,
                    },
                })

                if (currentActiveHistory) {
                    // Update the current active history record with a ReturnDate
                    await HistoryService.updateHistory(currentActiveHistory.IDHistory.toString(), {
                        ReturnDate: new Date(),
                    })
                }

                // Student confirmed - update classroom state to available
                await this.updateClassroomState(classroomID, 'Disponivel', 'Secretaria', 1)

                // Emit WebSocket event for classroom update
                getIO().emit('notification_approved_classroom_update')

                // Create notification for admin
                const newNotification = await prisma.notification.create({
                    data: {
                        IDUserFK: parseInt(adminID),
                        Message: JSON.stringify({
                            type: 'key_request_confirmed',
                            studentID: parseInt(studentID),
                            studentName: parsed.studentName,
                            adminID: parseInt(adminID),
                            adminName: parsed.adminName,
                            classroomID: parseInt(classroomID),
                            classroomName: parsed.classroomName,
                            action: 'solicitar',
                        }),
                    },
                })

                // Emit WebSocket event
                const io = getIO()
                io.to(`user:${newNotification.IDUserFK}`).emit('new_notification', newNotification)

                console.log(`[DEBUG] Key request confirmed by ${parsed.studentName}`)

                return {
                    success: true,
                    classroomState: 'Disponivel',
                    message: 'Key request confirmed successfully',
                }
            } else {
                // Student rejected - create notification for admin
                const newNotification = await prisma.notification.create({
                    data: {
                        IDUserFK: parseInt(adminID),
                        Message: JSON.stringify({
                            type: 'key_request_rejected',
                            studentID: parseInt(studentID),
                            studentName: parsed.studentName,
                            adminID: adminID,
                            adminName: parsed.adminName,
                            classroomID: classroomID,
                            classroomName: parsed.classroomName,
                            action: 'solicitar',
                        }),
                    },
                })

                // Emit WebSocket event
                const io = getIO()
                io.to(`user:${newNotification.IDUserFK}`).emit('new_notification', newNotification)

                console.log(`[DEBUG] Key request rejected by ${parsed.studentName}`)

                return {
                    success: true,
                    classroomState: classroom.State as ClassroomState,
                    message: 'Key request rejected by student',
                }
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to process key request', 500)
        }
    }

    /**
     * Accept or reject a trade request
     */
    static async processTradeRequest(notificationID: number, accepted: boolean): Promise<ActionResult> {
        try {
            // Get the notification
            const notification = await prisma.notification.findUnique({
                where: { IDNotification: notificationID },
            })

            if (!notification) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Notification not found', 404)
            }

            // Parse the notification message to get request details
            const requestData = JSON.parse(notification.Message)

            if (requestData.type !== 'trade_request') {
                throw new AppError(ErrorCode.BUSINESS_RULE_VIOLATION, 'Not a trade request notification', 400)
            }

            const { requestingStudentID, classroomID, classroomName } = requestData

            // Get the requesting student
            const requestingStudent = await prisma.user.findUnique({
                where: { IDUser: parseInt(requestingStudentID) },
                select: { Name: true },
            })

            if (!requestingStudent) {
                throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Requesting student not found', 404)
            }

            // Mark notification as read
            await prisma.notification.update({
                where: { IDNotification: notificationID },
                data: { ReadAt: new Date() },
            })

            if (accepted) {
                // Find the current active history record for the classroom
                const currentActiveHistory = await prisma.history.findFirst({
                    where: {
                        IDClassroomFK: classroomID,
                        ReturnDate: null,
                    },
                })

                if (currentActiveHistory) {
                    // Update the current active history record with a ReturnDate
                    await HistoryService.updateHistory(currentActiveHistory.IDHistory.toString(), {
                        ReturnDate: new Date(),
                    })
                }

                // Update classroom state and transfer the key to the requesting student
                await this.updateClassroomState(
                    classroomID,
                    'Em uso',
                    requestingStudent.Name,
                    parseInt(requestingStudentID),
                )

                // Create a new history record for the requesting student
                await HistoryService.createHistory({
                    IDUserFK: parseInt(requestingStudentID),
                    IDClassroomFK: classroomID,
                    StartDate: new Date(),
                })

                // Emit WebSocket event for classroom update
                getIO().emit('notification_approved_classroom_update')

                // Create notification for the requesting student confirming the trade
                const newNotification = await prisma.notification.create({
                    data: {
                        IDUserFK: parseInt(requestingStudentID),
                        Message: JSON.stringify({
                            type: 'trade_accepted',
                            message: `Your trade request for ${classroomName} has been accepted!`,
                            classroomID,
                            classroomName,
                        }),
                    },
                })

                // Emit WebSocket event
                const io = getIO()
                io.to(`user:${newNotification.IDUserFK}`).emit('new_notification', newNotification)

                console.log(`[DEBUG] Trade accepted - Key transferred from holder to ${requestingStudent.Name}`)

                return {
                    success: true,
                    classroomState: 'Em uso',
                    message: 'Trade accepted successfully',
                }
            } else {
                // Create notification for the requesting student rejecting the trade
                const newNotification = await prisma.notification.create({
                    data: {
                        IDUserFK: parseInt(requestingStudentID),
                        Message: JSON.stringify({
                            type: 'trade_rejected',
                            message: `Your trade request for ${classroomName} was rejected.`,
                            classroomID,
                            classroomName,
                        }),
                    },
                })

                // Emit WebSocket event
                const io = getIO()
                io.to(`user:${newNotification.IDUserFK}`).emit('new_notification', newNotification)

                console.log(`[DEBUG] Trade rejected - Key remains with current holder`)

                return {
                    success: true,
                    classroomState: 'Em uso',
                    message: 'Trade rejected',
                }
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to process trade request', 500)
        }
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
