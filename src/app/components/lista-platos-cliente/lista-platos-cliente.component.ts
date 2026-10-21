import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonList, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Empleado } from 'src/app/clases/empleado';
import { EstadoPedido, Pedido } from 'src/app/clases/pedido';
import { Producto } from 'src/app/clases/producto';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-lista-platos-cliente',
  templateUrl: './lista-platos-cliente.component.html',
  styleUrls: ['./lista-platos-cliente.component.scss'],
})
export class ListaPlatosClienteComponent implements OnInit
{
  @Input() usuario: Usuario = AuthService.usuario;
  @Input() pedido: Pedido;
  @Output() enviarProductos: EventEmitter<Producto[]> = new EventEmitter<Producto[]>();
  pedidoModificado: boolean;

  @ViewChild('lista', { static: false }) lista: IonList;

  constructor(private modalController: ModalController, public rolService: RolesService,
    private pedidoService: PedidoService, private toastController: ToastController,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() 
  {
    this.pedidoModificado = false;
  }

  removerPlato(index: number)
  {
    const nuevaLista = this.pedido.productos.filter((p, i) => i != index);
    this.pedido.productos = nuevaLista;
    this.enviarProductos.emit(this.pedido.productos);
    this.pedidoModificado = true;

    this.lista.closeSlidingItems();
  }

  entregarPlato(index: number)
  {
    console.log(this.pedido.productos[index]);

    if (!this.pedido.productos[index].isReady)
    {
      this.pedido.productos[index].isReady = true;
      this.notificar(this.pedido, index);
    }
    else if (this.pedido.productos[index].isReady)
    {
      this.pedido.productos[index].isReady = false;
    }

    this.pedidoModificado = true;
    this.lista.closeSlidingItems();
  }

  notificar(pedido: Pedido, index: number)
  {
    if (pedido.isDelivery)
    {
      let titulo = `Pedido Delivery para ${pedido.cliente.nombre} ${pedido.cliente.apellido} esta listo.`;
      let mensaje = `El producto ${pedido.productos[index].nombre} esta listo para entregar`;
      this.notificationService.enviarNotificacion(titulo, mensaje, '/home/menu-delivery', 'delivery')
        .then(() => this.presentToast('Delivery Notificado'))
        .catch(() => this.presentToast('No se pudo Notificar al delivery, pegale un grito'))
    }
    else
    {
      let titulo = `Pedido Mesa ${pedido.mesa.numero} Listo`;
      let mensaje = `El producto ${pedido.productos[index].nombre} esta listo para entregar`;
      this.notificationService.enviarNotificacion(titulo, mensaje, '/home/menu-pedidos', 'mozos')
        .then(() => this.presentToast('Mozo Notificado'))
        .catch(() => this.presentToast('No se pudo Notificar al mozo, pegale un grito'))
    }

  }

  cerrar()
  {
    if (this.pedidoModificado)
    {
      console.log("Pedido actualizado");
      // Se recalcula el total - Solo en ABM
      this.pedido.calcularTotal();
      // Se verifica estado de los productos para determinar estaod de Pedido
      this.pedido.estado = this.pedido.isReady() ? EstadoPedido.LISTO : this.pedido.estado;

      this.pedidoService.actualizar(this.pedido)
        .then(() => this.presentToast("Se actualiza pedido"));
    }
    this.modalController.dismiss(this.pedido.productos);
  }

  validarAccion(producto: Producto)
  {
    if (this.pedido.estado == EstadoPedido.EN_PROGRESO &&
      this.rolService.isEmpleadoCocinero(this.usuario) ||
      this.rolService.isEmpleadoBartender(this.usuario))
    {
      if (producto.tipo == (<Empleado>this.usuario).tipo)
      {
        return true
      }
    }
    return false;
  }

  isReady(index: number)
  {
    if (this.pedido.productos[index].isReady) 
    {
      return true;
    }
    return false;
  }

  cambiarColor(index)
  {
    if (this.isReady(index))
    {
      return "success";
    }
    return "light"
  }

  async presentToast(message)
  {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }



}
