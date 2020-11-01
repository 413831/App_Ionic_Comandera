import { Usuario } from './usuario';

export class Cliente extends Usuario
{
  isAccepted: boolean;

  public static CrearCliente(
    id: string,
    nombre: string,
    apellido: string,
    dni: string,
    foto: string,
    email: string,
    isActive: boolean,
    isAccepted: boolean
  )
  {
    let cliente = new Cliente();

    cliente.id = id;
    cliente.nombre = nombre;
    cliente.apellido = apellido;
    cliente.dni = dni;
    cliente.foto = foto;
    cliente.email = email;
    cliente.isActive = isActive;
    cliente.isAccepted = isAccepted;

    return cliente;
  }
}