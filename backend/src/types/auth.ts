
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
    adminData?: Admin;
    studentData?: Student;
} 

export interface LoginResponse 
{
    success: boolean;    
    message: string;
    data: {           
      user: User;  
      token: string;
    };
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

