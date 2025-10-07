import { Request, Response, NextFunction } from 'express'; // those objects are from express
import jwt from 'jsonwebtoken'; // jwt is a library that provides the function to verify the token


interface AuthRequest extends Request // 
{
  user?: any; 
}

// we use export because we need to use this function in other place
// we use "const" because we don't want that "authenticateToken" get another value, this variable always will point to this function
// Arrow Functions are a modern form to develop functions, it's better for short functions
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction ) => 
    {
        //1. CHECKING: gets the header of the requisition and checks if it is empty or not
        const authHeader: String = req.headers['authorization'] as string;
        if (!authHeader)
        {
            // 401 is the HTTP default code for unauthorizations
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.'});
        }
        const token = authHeader.split(' ')[1]; // getting only the token

        //2. VALIDATING: time to verify if the token is valid
        jwt.verify(token, process.env.JWT_SECRET, (err, user)=>  // process.env allow us to access the environment variables, 
        // (err, user) is a one-time function
        {
            if (err) //checking if the error exists
            {
                return res.status(403).json({message: 'Acesso negado. Token inválido.'}); //403 is the default HTTP code for this error
            }
            else
            {
                req.user = user;
                next();
            }
        }); 
    } 