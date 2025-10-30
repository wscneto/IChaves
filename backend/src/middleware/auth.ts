import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class AuthMiddleware 
{
  // 'read only' only allows the constructor to apply value, so it cant be changed 
  private readonly jwtSecret: string;

  /**
   * Constructors receives the jwtSecret 
   */
  constructor(jwtSecret: string) 
  {
    if (!jwtSecret) 
      {
        // The app decides how to deal with the error
      throw new Error('JWT_SECRET não fornecido ao AuthMiddleware.');
    }
    this.jwtSecret = jwtSecret;
  }

  /**
   * Authenticate method
   * @param req The HTTP request
   * @param res The response 
   * @param next Next function to be called
   */
  public authenticate = (req: Request, res: Response, next: NextFunction) => {
    try 
    {
      // The token is extracted in another method
      const token = this.extractTokenFromHeader(req);
      
      if (!token) 
        {
        return res.status(401).json({ 
          message: 'Acesso negado. Token mal formatado ou não fornecido.' 
        });
      }

      // It validates the token in another method
      const decodedPayload = this.verifyToken(token);

      // The payload is decoded and saved in user atribute on Request
      req.user = decodedPayload;
      
      next();

    } catch (err) {
      return this.handleAuthError(err, res);
    }
  };

  /**
   * This method extracts the token from the Request's Header
   */
  private extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.split(' ')[1];
  }

  /**
   * Receives a token as string and verify
   */
  private verifyToken(token: string): string | JwtPayload {
    // jwt.verify lança um erro se for inválido,
    // que será pego pelo 'catch' no método 'authenticate'.
    return jwt.verify(token, this.jwtSecret);
  }

  /**
   * Handle the authenticator error
   */
  private handleAuthError(err: unknown, res: Response): Response 
  {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: 'Acesso negado. Token expirado.' });
    } 
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Acesso negado. Token inválido.' });
    } 
    
    // Log do erro desconhecido
    console.error("Erro inesperado na autenticação:", err);
    return res.status(403).json({ message: 'Acesso negado. Erro na autenticação.' });
  }
}