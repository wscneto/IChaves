import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../types/user';
import { UserService } from './userService'; 
import { LoginRequest, UserCreationData } from '../types/auth';
import { PrismaClient } from '@prisma/client';

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

        data.role = data.role.toLowerCase();

        // Decidir se é um Aluno ou Admin
        if (data.role === 'student') 
        {
            userCreationData.StudentData = 
            {
                Course: data.course!,
                Period: data.period!,
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
        const options: SignOptions = {
            expiresIn: '7d',
        };
        const token = jwt.sign(payload, JWT_SECRET!, options);

        return token
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

    static async logout(token: string): Promise<{ message: string }> {
        const prisma = new PrismaClient();
        try {
            await prisma.blacklistedToken.create({
                data: {
                    token: token,
                },
            });
            return { message: 'Logout bem-sucedido e token invalidado.' };
        } finally {
            await prisma.$disconnect();
        }
    }

}