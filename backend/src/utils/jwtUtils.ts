// JWT tokens are composed by three scrutures: header, the "metadata" of the token; payload, the user data; and signature, what validates the token
import jwt, {JwtPayload} from 'jsonwebtoken';

export const generateToken = (payload: JwtPayload) => // We need to save the Payload in the token
{
    const JWT_SECRET = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    // Verfiying if the JWT_SECRET is defined
    if (!JWT_SECRET)  
    {
        console.error('FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.'); 
        process.exit(1);
    }
    return jwt.sign(payload, JWT_SECRET, {expiresIn: expiresIn});
}