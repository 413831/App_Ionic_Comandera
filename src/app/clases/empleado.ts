export enum TipoEmpleado
{
  Cocinero = 'Cocinero',
  Bartender = 'Bartender',
  Mozo = 'Normal'
}

export class Empleado extends Usuario {
  tipo: TipoEmpleado;
  cuil: string;

  public static CrearEmpleado(
    id: string,
    nombre: string,
    apellido: string,
    dni: string,
    foto: string,
    tipo: TipoEmpleado,
    cuil: string
  ) {
    let empleado = new Empleado();

    empleado.id = id;
    empleado.nombre = nombre;
    empleado.apellido = apellido;
    empleado.dni = dni;
    empleado.foto = foto;
    empleado.isActive = true;
    empleado.tipo = tipo;
    empleado.cuil = cuil;

    return empleado;
  }
}
