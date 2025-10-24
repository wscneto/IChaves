
export interface Admin 
{
    isAdmin: boolean;
}

export interface Student
{
    period: string;
    course: string;
}

export interface LoginRequest 
{
    name: string;
    email: string;
} 

export interface LoginResponse 
{
    success: boolean;    
    user: User;
    token: string;
    message: string;
}

export interface User
{
    idUser: number;
    name: string;
    email: string;
    adminData?: Admin;
    studentData?: Student;
}

export interface MeResponse 
{
  success: boolean;
  data: User; 
}

