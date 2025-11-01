import { Request, Response } from 'express';
import { ErrorHandler } from '../middleware/errorHandler'; // Assumindo que você tem este arquivo
import { ValidationUtils, AuthenticatedRequest } from '../utils/errorUtils'; // Assumindo que você tem este arquivo
import { AuthService } from '../services/authService';
import { LoginRequest } from '../types/authTypes'; //

export class AuthController {

  /**
   * Endpoint: POST /auth/login
   * Recebe credenciais, chama o AuthService para logar/registrar
   * e retorna o token JWT.
   */
  static login = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { email, name, curso, periodo } = req.body;

    // 1. Validação de Entrada
    ValidationUtils.validateRequired(email, 'Email', req);
    ValidationUtils.validateEmail(email, req);
    ValidationUtils.validateRequired(name, 'Name', req);

    const loginData: LoginRequest = { email, name, curso, periodo }; //

    // 2. Chamar o Serviço
    const token = await AuthService.login(loginData);

    // 3. Responder
    res.status(200).json({
      success: true,
      message: 'Login bem-sucedido.',
      token: token
    });
  });

  /**
   * Endpoint: GET /auth/me
   * Usa o ID do usuário (anexado pelo AuthMiddleware) para
   * buscar e retornar os dados atualizados do usuário.
   */
  static me = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // 1. O 'req.user' foi anexado pelo AuthMiddleware
    // O tipo 'User' (payload) que definimos tem a prop 'id'
    const userId = req.user?.id;

    if (!userId) {
      // Isso não deve acontecer se o middleware estiver correto
      ValidationUtils.throwAuthError('Token inválido não contém ID de usuário.', req);
    }

    // 2. Chamar o Serviço
    const user = await AuthService.me(userId as string);

    // 3. Responder
    res.status(200).json({
      success: true,
      data: user
    });
  });

  /**
   * Endpoint: POST /auth/logout
   * Registra o logout no lado do servidor (atualmente stateless).
   */
  static logout = ErrorHandler.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (userId) {
      await AuthService.logout(userId as string);
    }

    res.status(200).json({
      success: true,
      message: 'Logout bem-sucedido. Por favor, remova seu token do cliente.'
    });
  });
}