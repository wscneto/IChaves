import jwt from 'jsonwebtoken';
import { User } from '../utils/errorUtils';
import { UserService } from './userService'; 
import { LoginRequest, UserCreationData } from '../types/authTypes';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) 
{
    throw new Error('FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.');
}
export class AuthService
{
    static async login(data: LoginRequest): Promise<string> 
    {
        // Preparando os dados para criação caso necessário
        const userCreationData: UserCreationData = 
        {
            Email: data.email,
            Name: data.name,
        };

        // Decidir se é um Aluno ou Admin
        // A lógica de negócio é: se 'curso' e 'periodo' existem, é aluno.
        if (data.curso && data.periodo) 
        {
            userCreationData.StudentData = 
            {
                Course: data.curso,
                Period: data.periodo,
            };
        }   
        
        // Se StudentData não for fornecido, o UserService saberá que é um Admin
        // O UserService procura e cria o usuário
        const user = await UserService.findOrCreateUserByEmail(userCreationData);

        // GERAR O PAYLOAD do JWT
        const payload: User = {
        id: user.IDUser.toString(),
        name: user.Name,
        email: user.Email,
        // O 'user' que recebemos de volta já tem as relações
        role: user.Admin ? 'admin' : (user.Student ? 'student' : null),
        };

        // GERAR O TOKEN
        const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });

        return token;
    }

    /**
     * Busca os dados atualizados do usuário com base no ID do token.
     */
    static async me(userId: string) 
    {
        // Reutiliza o UserService para buscar dados frescos do usuário
        const user = await UserService.getUserById(userId);
        return user;
    }

    /**
     * Registra uma solicitação de logout.
     */
    static async logout(userId: string): Promise<{ message: string }> 
    {
        
        console.log(`Usuário ${userId} solicitou logout.`);
        
        // Retorna uma mensagem de sucesso.
        return { message: 'Logout registrado. O cliente deve remover o token.' };
    }

}