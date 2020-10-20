export class Dueno extends Jefe {
  public static CrearDueno(
    id: string,
    nombre: string,
    apellido: string,
    dni: string,
    foto: string,
    cuil: string
  ) {
    let dueno = new Dueno();

    dueno.id = id;
    dueno.nombre = nombre;
    dueno.apellido = apellido;
    dueno.dni = dni;
    dueno.foto = foto;
    dueno.isActive = true;
    dueno.cuil = cuil;

    return dueno;
  }
}
