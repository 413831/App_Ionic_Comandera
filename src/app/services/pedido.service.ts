import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TipoEmpleado } from '../clases/empleado';
import { EstadoPedido, Pedido } from '../clases/pedido';
import { AuthService } from './auth.service';
import { MesaService } from './mesa.service';
import { NotificationsService } from './notifications.service';
import { RolesService } from './roles.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService 
{
  public static pedidos: Pedido[] = [];

  constructor(private firebase: AngularFireDatabase, private router: Router,
    private mesaService: MesaService, private notificationService: NotificationsService, private toastController: ToastController,
    private rolesService: RolesService) { }

  /**
   * Método para realizar Alta en DB
   * @param pedido instancia de Pedido
   */
  public crear(pedido: Pedido): Promise<any>
  {
    console.log(pedido);
    pedido.isActive = true;

    return this.firebase.database.ref('pedidos')
      .push(pedido)
      .then((snapshot) => pedido.id = snapshot.key)
      .then(() => this.actualizar(pedido))
      .catch(console.error);
  }

  /**
   * Método para realizar Modificacion en DB
   * @param pedido instancia de Pedido
   */
  public actualizar(pedido: Pedido): Promise<any>
  {
    return this.firebase.database.ref('pedidos/' + pedido.id).update(pedido);
  }

  /**
   * Método para realizar Baja lógica en DB
   * @param pedido instancia de Pedido
   */
  public borrar(pedido: Pedido): Promise<any>
  {
    pedido.isActive = false;

    return this.firebase.database.ref('pedidos/' + pedido.id).update(pedido);
  }

  /**
   * Método para realizar Fetch de todas las mesas en DB
   */
  public leer()
  {
    let pedidos: Pedido[] = [];
    console.info("Fetch de todas los pedidos");

    const fetch = new Promise<Pedido[]>(resolve =>
    {
      this.firebase.database.ref('pedidos').on('value', (snapshot) =>
      {
        pedidos = [];
        snapshot.forEach((child) =>
        {
          let data: Pedido = new Pedido(child.val());
          pedidos.push(data);
        });
        if (pedidos.length > 0)
        {
          PedidoService.pedidos = pedidos.filter(pedido => pedido.isActive);
        }
        console.log(PedidoService.pedidos);
        resolve(PedidoService.pedidos);
      }, (error) =>
      {
        console.warn("Aviso Firebase pedidos.leer:", error.message || error);
        resolve(PedidoService.pedidos);
      });
    });
    return fetch;
  }

  /**
   * Método para realizar Fetch de una mesa en DB
   * @param id UID del registro a obtener
   */
  public async fetch(id: string)
  {
    try
    {
      const data = await this.firebase.database.ref(`pedidos/${id}`).once('value');
      return new Pedido(data.val());
    }
    catch (err)
    {
      console.warn("Aviso Firebase pedidos.fetch:", err);
      const pedidoExistente = PedidoService.pedidos.find(p => p.id === id);
      return pedidoExistente || null;
    }
  }

  notificarEntrega(pedido: Pedido)
  {
    console.log("Se notifica a Mozo");
  }

  /**
   * Método para navegar al ABM de Pedido
   * @param pedido 
   */
  hacerPedido(pedido: Pedido)
  {
    this.router.navigate(["/home/menu-pedidos", pedido.id]);
  }


  /**
   * Método para confirmar entrega de Pedido para Mesa
   * @param pedido 
   */
  entregarPedido(pedido: Pedido)
  {
    if (pedido.estado == EstadoPedido.EN_PROGRESO)
    {
      console.log("Se recibe pedido en la mesa");
      pedido.cambiarEstado();
      return this.actualizar(pedido);
    }
  }

  /**
   * Método para confirmar recepción de Pedido en Mesa
   * @param pedido 
   */
  recibirPedido(pedido: Pedido)
  {
    console.log(pedido);
    if (pedido.estado == EstadoPedido.LISTO)
    {
      console.log("Se recibe pedido en la mesa");
      pedido.cambiarEstado();
      return this.actualizar(pedido);
    }
  }

  /**
   * Método para pagar pedido por parte de Cliente
   * @param pedido 
   */
  pagarPedido(pedido: Pedido)
  {
    if (pedido.estado == EstadoPedido.ENTREGADO)
    {
      console.log("Se paga pedido de la mesa");
      pedido.cambiarEstado();
      pedido.mesa.isAvailable = true;

      this.mesaService.actualizar(pedido.mesa);
      return this.actualizar(pedido);
    }
  }

  /**
   * Método para aceptar pedido por parte de Mozo
   * @param pedido Pedido solicitado por Cliente acepta Mozo
   */
  aceptarPedido(pedido: Pedido)
  {
    if (pedido.estado == EstadoPedido.SOLICITADO)
    {
      console.log("Se acepto pedido para cocina y barra");
      pedido.cambiarEstado();
      this.notificar(pedido);
      return this.actualizar(pedido);
    }
  }

  notificar(pedido: Pedido)
  {
    let notificarACocinero = false;
    let notificarABartender = false;
    pedido.productos.forEach(producto =>
    {
      if (producto.tipo == TipoEmpleado.Cocinero)
      {
        notificarACocinero = true;
      }
      if (producto.tipo == TipoEmpleado.Bartender)
      {
        notificarABartender = true;
      }
    })
    let titulo = 'Nuevo Producto para preparar';
    let mensaje = 'Un cliente esta esperando un producto';
    if (notificarACocinero)
    {
      this.notificationService.enviarNotificacion(titulo, mensaje, '/home/menu-pedidos', 'cocineros')
        .then(() => this.presentToast('Cocinero Notificado'))
        .catch(() => this.presentToast('No se pudo Notificar al cocinero, pegale un grito'))
    }
    if (notificarABartender)
    {
      this.notificationService.enviarNotificacion(titulo, mensaje, '/home/menu-pedidos', 'bartenders')
        .then(() => this.presentToast('Bartender Notificado'))
        .catch(() => this.presentToast('No se pudo Notificar al Bartender, pegale un grito'))
    }
  }

  async presentToast(message)
  {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    })
    toast.present();
  }

  /**
   * Método para aceptar pago por parte de Mozo
   * @param pedido Pedido solicitado por Cliente acepta Mozo
   */
  aceptarPago(pedido: Pedido)
  {
    if (pedido.estado == EstadoPedido.CERRADO)
    {
      console.log("Se valida pago de la mesa");
      if (this.rolesService.isEmpleadoMozo(AuthService.usuario))
      {
        pedido.idMozo = AuthService.usuario.id;
      }
      pedido.cambiarEstado();
      return this.actualizar(pedido);
    }
  }



}
