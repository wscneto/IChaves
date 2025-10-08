import { Request, Response, NextFunction } from 'express'; // importing default objects from express
import jwt, { JwtPayload } from 'jsonwebtoken'; // importing jwt to use the function to verify the token and JwtPayload to set the response's type

// using module augmentation to implement "user" in Request interface
    // module augmentation is a technique that allow us to add "attributes" to the native class
declare global  // This line makes the augmentation works for the whole project 
{ 
  namespace Express // This line specify that the change is in "Express" namespace 
  {
    interface Request // This line opens the Request interface 
    {
      user?: string | JwtPayload; // This line creates "user" attribute and defines it as string or JwtPayload
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET; // process.env allow us to access the environment variables

// Verfiying if the JWT_SECRET is defined
if (!JWT_SECRET)  
{
  console.error('FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.');
  process.exit(1);
}

// We use export because we need to use this function in other place
// We use "const" because we don't want that "authenticateToken" get another value, this variable always will point to this function
// Arrow Functions are a modern form to develop functions, it's better for short functions
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => 
{
  try // Using try catch is the better and modern way to catch errors
  {
    //1. CHECKING: gets the header of the requisition and checks if it is empty or not, and if it is well written 
    const authHeader = req.headers['authorization'];    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 401 is the HTTP default code for unauthorizations
      return res.status(401).json({ message: 'Acesso negado. Token mal formatado ou não fornecido.' });
    }

    const token = authHeader.split(' ')[1]; // getting only the token

    //2. VALIDATING: time to verify if the token is valid
    const decodedPayload = jwt.verify(token, JWT_SECRET); 

    // Adicionamos o payload decodificado (informações do usuário) ao objeto `req`
    req.user = decodedPayload;

    // Passa para o próximo middleware ou controller
    next();
  } catch (error) {
    // If the jwt.verify don't work, throws the 403 error
    return res.status(403).json({ message: 'Acesso negado. Token inválido ou expirado.' }); //403 is the default HTTP code for this error
  }
};