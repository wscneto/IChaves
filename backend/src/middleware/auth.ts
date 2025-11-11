import '../types/auth'
import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from '../utils/errorUtils'
import { User } from '../types/user'

export class AuthMiddleware {
    // 'read only' only allows the constructor to apply value, so it cant be changed
    private readonly jwtSecret: string

    /**
     * Constructors receives the jwtSecret
     */
    constructor(jwtSecret: string) {
        if (!jwtSecret) {
            // The app decides how to deal with the error
            throw new Error('JWT_SECRET não fornecido ao AuthMiddleware.')
        }
        this.jwtSecret = jwtSecret
    }

    /**
     * Authenticate method
     * @param req The HTTP request
     * @param res The response
     * @param next Next function to be called
     */
    public authenticate = async (req: Request, res: Response, next: NextFunction) => {
        const prisma = new PrismaClient();
        try {
            const token = this.extractTokenFromHeader(req);

            if (!token) {
                return res.status(401).json({
                    message: 'Acesso negado. Token mal formatado ou não fornecido.',
                });
            }

            const blacklistedToken = await prisma.blacklistedToken.findUnique({
                where: { token },
            });

            if (blacklistedToken) {
                return res.status(401).json({ message: 'Token inválido ou expirado.' });
            }

            const decodedPayload = this.verifyToken(token);
            req.user = decodedPayload;
            console.log("teste: " + JSON.stringify(req.user));
            next();
        } catch (err) {
            return this.handleAuthError(err, res);
        } finally {
            await prisma.$disconnect();
        }
    };
    public requireAdmin = (req: Request, res: Response, next: NextFunction) => {
        // Este middleware deve ser usado APÓS o middleware 'authenticate'.
        const user = (req as AuthenticatedRequest).user;

        // Verifica se o usuário existe e tem a role 'admin'
        // A verificação do token (incluindo blacklist) é feita no 'authenticate'.
        if (!user || (user as User).role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
        }
        
        next();
    }

    public requireStudent = (req: Request, res: Response, next: NextFunction) => {

        // Este middleware deve ser usado APÓS o middleware 'authenticate'.
        const user = (req as AuthenticatedRequest).user;
        console.log('teste: ' + JSON.stringify(req.user))

        // Verifica se o usuário existe e tem a role 'student'
        if (!user || (user as User).role !== 'student') {
            return res.status(403).json({ message: 'Acesso negado. Rota exclusiva para estudantes.' })
        }

        next();
    }

    public requireAnyRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
        // Este middleware deve ser usado APÓS o middleware 'authenticate'.
        const user = (req as AuthenticatedRequest).user;

        // Garante que a lista de roles é um array
        if (!Array.isArray(roles) || roles.length === 0) {
            // Lançar um erro ou lidar com a configuração inválida
            console.error("Configuração inválida para requireAnyRole: 'roles' deve ser um array não vazio.");
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }

        // Verifica se o usuário existe e se sua role está na lista de roles permitidas
        if (!user || !roles.includes((user as User).role!)) {
            return res.status(403).json({ message: 'Acesso negado. Você não tem a permissão necessária.' })
        }

        next();
    }

    /**
     * This method extracts the token from the Request's Header
     */
    private extractTokenFromHeader(req: Request): string | null {
        const authHeader = req.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }

        return authHeader.split(' ')[1]
    }

    /**
     * Receives a token as string and verify
     */
    private verifyToken(token: string): string | JwtPayload {
        // jwt.verify lança um erro se for inválido,
        // que será pego pelo 'catch' no método 'authenticate'.
        return jwt.verify(token, this.jwtSecret)
    }

    /**
     * Handle the authenticator error
     */
    private handleAuthError(err: unknown, res: Response): Response {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ message: 'Acesso negado. Token expirado.' })
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Acesso negado. Token inválido.' })
        }

        // Log do erro desconhecido
        console.error('Erro inesperado na autenticação:', err)
        return res.status(403).json({ message: 'Acesso negado. Erro na autenticação.' })
    }
}
