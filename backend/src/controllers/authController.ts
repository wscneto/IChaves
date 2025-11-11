
// IMPORTAMOS AS FERRAMENTAS
import { Request, Response } from 'express';
import { ErrorHandler } from '../middleware/errorHandler'; 
import { JwtPayload } from 'jsonwebtoken';
import { ValidationUtils } from '../utils/errorUtils'; 
import { AuthService } from '../services/authservice'; 
import { LoginRequest, MeResponse } from '../types/auth';

export class AuthController {

    /**
     * Lida com a requisição de login
     */
    static login = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        // 'req.body' é o JSON que o frontend enviou
        const { name, email, adminData, studentData } = req.body;

        // Usamos o "validador" para checar se os campos obrigatórios vieram
        ValidationUtils.validateRequired(name, 'name', req);
        ValidationUtils.validateRequired(email, 'email', req);
        ValidationUtils.validateEmail(email, req);

        // Montamos o objeto no formato que o "contrato" LoginRequest pede
        const loginData: LoginRequest = {
            name,
            email,
            adminData,
            studentData
        };

        // Chamamos o 'AuthService' e esperamos a resposta
        const response = await AuthService.login(loginData);
        // Enviamos o JSON de volta para o frontend
        res.status(200).json(response);
    });

    /**
     * Lida com a requisição de "quem sou eu" (/me)
     */
    static me = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
        
        const userId = (req.user as JwtPayload)?.sub;

        // Se o 'userId' não estiver ali, algo deu muito errado
        ValidationUtils.validateRequired(userId, 'userId (from token)', req);

        // Chamamos o método 'me' que acabamos de criar no AuthService
        const user = await AuthService.me(userId as string);

        // Montamos a resposta seguindo o "contrato" MeResponse
        const response: MeResponse = {
            success: true,
            data: user
        };

        // Enviamos o JSON de volta para o frontend
        res.status(200).json(response);
    });

}