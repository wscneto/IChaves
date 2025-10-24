import { AuthService } from "../services/authservice";
import { LoginRequest, LoginResponse } from "../types/auth";

function loginController (req: LoginRequest, res: LoginResponse)
{
    AuthService.login(req);
}