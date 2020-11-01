import { IAuthenticable } from './IAuthenticable';

export abstract class Usuario implements IAuthenticable
{
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  foto: string;
  email: string;
  password: string;
  isActive: boolean;
}
