import { Imagen } from './imagen';
import { Usuario } from './usuario';

export enum TipoJefe
{
  Dueno = 'Dueno',
  Supervisor = 'Supervisor',
}

export class Jefe extends Usuario
{
  tipo: TipoJefe;
  cuil: string;

  public static CrearJefe(
    id: string,
    nombre: string,
    apellido: string,
    dni: string,
    foto: Imagen,
    email: string,
    isActive: boolean,
    tipo: TipoJefe,
    cuil: string
  )
  {
    let jefe = new Jefe();

    jefe.id = id;
    jefe.nombre = nombre;
    jefe.apellido = apellido;
    jefe.dni = dni;
    jefe.foto = foto;
    jefe.email = email;
    jefe.isActive = isActive;
    jefe.tipo = tipo;
    jefe.cuil = cuil;

    return jefe;
  }
}


