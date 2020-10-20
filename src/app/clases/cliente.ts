export class Cliente extends Usuario {
  public static CrearCliente(
    id: string,
    nombre: string,
    apellido: string,
    dni: string,
    foto: string,
  ) {
    let cliente = new Cliente();

    cliente.id = id;
    cliente.nombre = nombre;
    cliente.apellido = apellido;
    cliente.dni = dni;
    cliente.foto = foto;
    cliente.isActive = true;

    return cliente;
  }
}
