import { Imagen } from './imagen';
import { Usuario } from './usuario';

export enum TipoEmpleado
{
  Bartender = 'Bartender',
  Cocinero = 'Cocinero',
  Mozo = 'Mozo'
}

export class Empleado extends Usuario
{
  tipo: TipoEmpleado;
  cuil: string;

  public static CrearEmpleado(
    id: string,
    nombre: string,
    apellido: string,
    dni: string,
    foto: Imagen,
    email: string,
    isActive: boolean,
    tipo: TipoEmpleado,
    cuil: string
  )
  {
    let empleado = new Empleado();

    empleado.id = id;
    empleado.nombre = nombre;
    empleado.apellido = apellido;
    empleado.dni = dni;
    empleado.foto = foto;
    empleado.email = email;
    empleado.isActive = isActive;
    empleado.tipo = tipo;
    empleado.cuil = cuil;

    return empleado;
  }
}
