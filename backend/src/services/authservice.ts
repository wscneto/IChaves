import { PrismaClient } from '@prisma/client'; 
import { generateToken } from "../utils/jwtUtils"; 
import { LoginRequest, LoginResponse, User, Admin, Student } from "../types/auth"; 
import { UserService } from './userService'; 
import { AppError, ErrorCode } from '../types/errors'; 

// Criamos uma "instância" do Prisma para poder falar com o banco
const prisma = new PrismaClient();

/**
 * Serviço de autenticação para lidar com o login.
 * Sincroniza o usuário (cria ou atualiza) com base nos dados
 * vindos do serviço externo.
 */
export class AuthService {

    /**
     * Realiza o login (Upsert) de um usuário.
     *
     * @param loginData - Dados do serviço externo (name, email, e papéis).
     * @returns Resposta com o usuário (do nosso BD) e o nosso token JWT.
     */
    public static async login(loginData: LoginRequest): Promise<LoginResponse> 
    {
        // A LÓGICA "UPSERT" (Atualizar ou Inserir)
        // Isso é uma única "transação" no banco de dados.
        const userFromDb = await prisma.user.upsert({
            
            // where: Como encontramos o usuário? Pelo Email.
            where: { Email: loginData.email },

            // update: O que fazer se o usuário JÁ EXISTIR?
            update: {
                Name: loginData.name, // Atualiza o nome (caso tenha mudado lá fora)

                // Atualiza o papel de Admin
                Admin: loginData.adminData ? {
                    // upsert: garanta que a relação de admin exista
                    upsert: { create: {}, update: {} } 
                } : {
                    // delete: se não veio adminData, remove a relação de admin
                    delete: true 
                },

                // Atualiza o papel de Student
                Student: loginData.studentData ? {
                    // upsert: garanta que a relação de estudante exista
                    upsert: { 
                        // cria ou atualiza com os dados do período/curso
                        create: {
                            Period: loginData.studentData.period,
                            Course: loginData.studentData.course
                        },
                        update: {
                            Period: loginData.studentData.period,
                            Course: loginData.studentData.course
                        }
                    }
                } : {
                    // delete: se não veio studentData, remove a relação
                    delete: true 
                }
            },

            // create: O que fazer se o usuário NÃO EXISTIR?
            create: {
                Email: loginData.email,
                Name: loginData.name,

                // Cria a relação de Admin (se ela foi passada)
                Admin: loginData.adminData ? {
                    create: {} // Cria a relação simples
                } : undefined, // Se não, não faz nada

                // Cria a relação de Student (se ela foi passada)
                Student: loginData.studentData ? {
                    create: { // Cria a relação com os dados
                        Period: loginData.studentData.period,
                        Course: loginData.studentData.course
                    }
                } : undefined // Se não, não faz nada
            },

            // include: O que queremos que o banco retorne
            include: {
                Admin: true,
                Student: true
            }
        });

        // "TRADUZIR" OS DADOS DO PRISMA PARA NOSSA INTERFACE 'User'
        
        const adminData: Admin | undefined = userFromDb.Admin ? { isAdmin: true } : undefined;
        
        const studentData: Student | undefined = userFromDb.Student ? {
            course: userFromDb.Student.Course,
            period: userFromDb.Student.Period
        } : undefined;

        // O objeto "User" final que segue o nosso "contrato"
        const userForResponse: User = {
            idUser: userFromDb.IDUser,
            name: userFromDb.Name,
            email: userFromDb.Email,
            adminData: adminData,
            studentData: studentData
        };

        // GERAR O TOKEN JWT
        // Geramos o token com o ID do usuário *do nosso sistema*
        const payload = { sub: userFromDb.IDUser.toString() };
        const token = generateToken(payload);

        // RETORNAR A RESPOSTA DE SUCESSO 
        return {
            success: true,
            message: "Login e sincronização realizados com sucesso!",
            data: {
                user: userForResponse,
                token: token
            },
        };
    }

    /**
     * Busca os dados de um usuário autenticado pelo seu ID.
     * (Este é o método "me")
     *
     * @param userId - O ID do usuário (vindo do token).
     * @returns Os dados completos do usuário formatados (o "mapa").
     */
    public static async me(userId: string): Promise<User>
    {
        // Usamos o UserService para buscar o usuário
        const userFromDb = await UserService.getUserById(userId);
        
        // Se não encontrar (token pode ser válido, mas usuário foi deletado)
        if (!userFromDb) {
            // Lançamos um erro padrão que o 'errorHandler' vai pegar
            throw new AppError(ErrorCode.RECORD_NOT_FOUND, 'Usuário não encontrado', 404);
        }

        // "Traduzir" os dados do Prisma para nossa interface 'User'

        const adminData: Admin | undefined = userFromDb.Admin ? { isAdmin: true } : undefined;
        
        const studentData: Student | undefined = userFromDb.Student ? {
            course: userFromDb.Student.Course,
            period: userFromDb.Student.Period
        } : undefined;

        // O objeto "User" final que segue o "contrato"
        const userForResponse: User = {
            idUser: userFromDb.IDUser,
            name: userFromDb.Name,
            email: userFromDb.Email,
            adminData: adminData,
            studentData: studentData
        };

        // Retornamos os dados do usuário
        return userForResponse;
    }
}