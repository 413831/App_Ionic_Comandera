import { IListaEspera } from '../interfaces/IListaEspera';
import { Imagen } from './imagen';
import { Usuario } from './usuario';

export enum EstadoAceptacion
{
  Pendiente = 'Pendiente',
  Aceptado = 'Aceptado',
  Rechazado = 'Rechazado',
  Anonimo = 'Anónimo'
}

export class Cliente extends Usuario
{
  estado: EstadoAceptacion;
  enListaDeEspera: IListaEspera;

  public static CrearCliente(
    id: string,
    nombre: string,
    apellido: string,
    dni: string,
    foto: Imagen,
    email: string,
    isActive: boolean,
    estado: EstadoAceptacion,
    enListaDeEspera: IListaEspera,
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
    cliente.estado = estado;
    cliente.enListaDeEspera = enListaDeEspera;

    return cliente;
  }
}