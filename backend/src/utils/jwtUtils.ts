// JWT tokens are composed by three scrutures: header, the "metadata" of the token; payload, the user data; and signature, what validates the token
import jwt, { PrivateKey } from 'jsonwebtoken';


// Getting the env values
const JWT_SECRET = process.env.JWT_SECRET as PrivateKey;
const expiresIn = process.env.JWT_EXPIRES_IN;
// Verfiying if the JWT_SECRET is defined
if (!JWT_SECRET)  
{
    console.error('FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.'); 
    process.exit(1);
}

interface TokenPayload {
    sub: string; // or number, depending on your user ID type
}
export const generateToken = (payload: TokenPayload) => // We need to save the Payload in the token
{
    return jwt.sign(payload, JWT_SECRET); // generating and returning the token
}