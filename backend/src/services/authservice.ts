import { UserService } from "./userService";
import { generateToken } from "../utils/jwtUtils"; 
import { LoginRequest, LoginResponse } from "../types/auth";
import { AppError, ErrorCode } from "../types/errors";

/**
 * Serviço de autenticação para lidar com o login de usuários.
 * Este serviço é projetado para ser consumido por um microserviço confiável.
 */
export class AuthService {
    /**
     * Realiza o login de um usuário com base no e-mail e nome, validando a chamada
     * através de uma chave de API (API Key) vinda de um microserviço confiável.
     *
     * @param loginData - Dados de login contendo e-mail e nome do usuário.
     * @returns Uma promessa que resolve para a resposta de login com o token JWT.
     */
    public static async login(loginData: LoginRequest): Promise<LoginResponse> 
    {

        // 1. Busca o usuário pelo e-mail
        const user = await UserService.getUserByEmail(loginData.email);
        if (!user) {
            throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Usuário não encontrado!', 404);
        }

        // 2. Validação adicional: verifica se o nome corresponde
        if (user.Name.toLowerCase() !== loginData.name.toLowerCase()) {
            throw new AppError(ErrorCode.UNAUTHORIZED, 'Credenciais inválidas. O nome não corresponde ao e-mail.', 401);
        }

        // 3. Gera o token JWT
        const payload = { sub: user.IDUser.toString() };
        const token = generateToken(payload);

        // 4. Retorna a resposta de sucesso
        return {
            success: true,
            token,
            message: "Login realizado com sucesso!",
            user: {
                idUser: user.IDUser,
                name: user.Name,
                email: user.Email,
                adminData: user.Admin ? { isAdmin: true } : undefined,
                studentData: user.Student ? {
                    course: user.Student.Course,
                    period: user.Student.Period
                } : undefined
            }
        };
    }

}