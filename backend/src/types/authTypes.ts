import { JwtPayload } from "jsonwebtoken";

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload | string;
  }
}
export {};

export interface UserAuth
{
  Email: string;
  Name: string;
  Student: 
  {
      Period: string;
      Course: string;
  } | null;
  Admin: {
      IDUser: number;
  } | null;
}

export interface LoginResponse
{
  success: boolean;
  message: string;
  token: string;
}

export interface LoginRequest 
{
  email: string;
  name: string;
  curso?: string;  // Optional
  periodo?: string; // Optional
}

export interface UserCreationData 
{
  Name: string;
  Email: string;
  StudentData?: 
  {
    Course: string;
    Period: string;
  }
}
