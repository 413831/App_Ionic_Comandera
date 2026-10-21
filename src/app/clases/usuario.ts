import { Imagen } from './imagen';

export class Usuario
{
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  foto: Imagen;
  email: string;
  password: string;
  isActive: boolean;
  tokenNotification: string;
  cuil?: string;
  estado?: any;
  tipo?: any;
}
