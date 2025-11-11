import { Request, Response } from 'express'
import { ErrorHandler } from '../middleware/errorHandler' 
import { ValidationUtils, AuthenticatedRequest, AuthUtils } from '../utils/errorUtils'
import { AuthService } from '../services/authService'
import { LoginRequest } from '../types/auth'

export class AuthController {
    /**
     * Endpoint: POST /auth/login
     * Recebe credenciais, chama o AuthService para logar/registrar
     * e retorna o token JWT.
     */
    static login = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        const { email, name, role, course, period } = req.body

        // 1. Validação de Entrada
        ValidationUtils.validateRequired(email, 'Email', req)
        ValidationUtils.validateEmail(email, req)
        ValidationUtils.validateRequired(name, 'Name', req)

        const loginData: LoginRequest = { email, name, role, course, period }

        // 2. Chamar o Serviço
        const token = await AuthService.login(loginData)

        // 3. Responder
        res.status(200).json({
            success: true,
            message: 'Login bem-sucedido.',
            token: token,
        })
    })

    /**
     * Endpoint: GET /auth/me
     * Usa o ID do usuário (anexado pelo AuthMiddleware) para
     * buscar e retornar os dados atualizados do usuário.
     */
    static me = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        // 1. O 'req.user' foi anexado pelo AuthMiddleware
        // O tipo 'User' (payload) que definimos tem a prop 'id'
        const userId = (req as AuthenticatedRequest).user?.id

        if (!userId) {
            //Isso não deve acontecer se o middleware estiver correto
            AuthUtils.requireAuth(req as AuthenticatedRequest)
        }

        // 2. Chamar o Serviço
        const user = await AuthService.me(userId as string)

        // 3. Responder
        res.status(200).json({
            success: true,
            data: user,
        })
    })

    /**
     * Endpoint: POST /auth/logout
     * Registra o logout no lado do servidor (atualmente stateless).
     */
    static logout = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            await AuthService.logout(token);
        }

        res.status(200).json({
            success: true,
            message: 'Logout bem-sucedido. O token foi invalidado.',
        });
    });
}
