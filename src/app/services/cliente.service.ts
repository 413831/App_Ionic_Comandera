import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Cliente, EstadoAceptacion } from "../clases/cliente";
import { Imagen } from '../clases/imagen';

@Injectable({
  providedIn: "root",
})
export class ClienteService
{
  public static clientes: Cliente[] = [];

  constructor(public firebase: AngularFireDatabase) { }

  public crear(cliente: Cliente, uid: string): Promise<any>
  {
    cliente.id = uid;
    cliente.isActive = true;
    cliente.estado = EstadoAceptacion.Pendiente;
    cliente.enListaDeEspera = {
      isWaiting: false,
      horario: null
    };
    console.log(cliente)

    return this.firebase.database
      .ref("clientes/" + cliente.id)
      .set(cliente)
      .catch(console.error);
  }

  public crearAnonimo(cliente: Cliente): Promise<any>
  {
    console.log(cliente)

    return this.firebase.database
      .ref("clientes/" + cliente.id)
      .set(cliente)
      .catch(console.error);
  }

  public actualizar(cliente: Cliente): Promise<any>
  {
    return this.firebase.database
      .ref("clientes/" + cliente.id)
      .update(cliente);
  }

  public borradoLogico(cliente: Cliente): Promise<any>
  {
    cliente.isActive = false;

    return this.actualizar(cliente);
  }

  public leer()
  {
    let clientes: Cliente[] = [];
    console.info("Fetch de todos los clientes");

    return new Promise<Cliente[]>((resolve) =>
    {
      this.firebase.database.ref("clientes").on("value", (snapshot) =>
      {
        clientes = [];

        snapshot.forEach((child) =>
        {
          var data: Cliente = child.val();
          clientes.push(
            Cliente.CrearCliente(
              data.id,
              data.nombre,
              data.apellido,
              data.dni,
              data.foto,
              data.email,
              data.isActive,
              data.estado,
              data.enListaDeEspera
            )
          );
        });

        ClienteService.clientes = clientes.filter(e => e.isActive);

        resolve(ClienteService.clientes);
      });
    });
  }

  public leerPorID(id: string)
  {
    return new Promise<Cliente>(resolve =>
    {
      this.firebase.database.ref(`clientes/${id}`).once('value').then(snapshot =>
      {
        if (snapshot.val() === null || snapshot.val() === undefined)
        {
          console.log("Cliente not found")
          resolve(null)
        }
        else 
        {
          let data: Cliente = snapshot.val();
          const cliente = Cliente.CrearCliente(data.id, data.nombre, data.apellido, data.dni,
            data.foto, data.email, data.isActive, data.estado, data.enListaDeEspera);
          resolve(cliente);
        }
      });
    })
  }
}
