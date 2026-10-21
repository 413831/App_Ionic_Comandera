import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, SelectValueAccessor } from '@ionic/angular';
import { Pedido, EstadoPedido } from 'src/app/clases/pedido';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-listado-delivery',
  templateUrl: './listado-delivery.component.html',
  styleUrls: ['./listado-delivery.component.scss'],
})
export class ListadoDeliveryComponent implements OnInit
{

  @Input() pedidosDelivery: Pedido[] = [];
  @Output() elegirPedidoDelivery: EventEmitter<Pedido> = new EventEmitter<Pedido>();
  usuario: Usuario;

  constructor(
    private loadingController: LoadingController,
    public rolService: RolesService,
    private visual: UIVisualService,
    private pedidoService: PedidoService,
    public alertController: AlertController,
    private notificationsService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit()
  {
    UIVisualService.loading(2000);
    this.usuario = AuthService.usuario;
  }

  ngDoCheck()
  {
    if (this.rolService.isJefe(this.usuario))
    {
      this.pedidosDelivery = this.pedidosDelivery.filter(pedidoDelivery => pedidoDelivery.estado == EstadoPedido.RESERVADO)
    }
    else if (this.rolService.isClienteAceptado(this.usuario))
    {
      this.pedidosDelivery = this.pedidosDelivery.filter(pedidoDelivery => {return pedidoDelivery.cliente.id == this.usuario.id &&  pedidoDelivery.estado != EstadoPedido.PAGADO})
    }
  }

  seleccionarReserva(pedidoDelivery: Pedido)
  {
    this.elegirPedidoDelivery.emit(pedidoDelivery);
  }

  confirmarPedidoDelivery(pedidoDelivery: Pedido)
  {
    console.log(pedidoDelivery);
    pedidoDelivery.estado = EstadoPedido.SOLICITADO;
    this.pedidoService.aceptarPedido(pedidoDelivery);
    this.pedidoService.actualizar(pedidoDelivery).then(() =>
    {
      this.notificationsService.enviarNotificacionPorToken('Delivery confirmado.', `El tiempo de espera aproximado es de ${pedidoDelivery.tiempoPreparacion} minutos`, pedidoDelivery.cliente.tokenNotification).catch(() => alert('No se pudo alertar al cliente'));
      UIVisualService.presentToast('Reserva Confirmada.');
    })
  }

  async alertTiempoDeEspera(pedidoDelivery: Pedido)
  {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Tiempo de espera aproximado(min)',
      inputs: [
        {
          name: 'tiempoDeEspera',
          type: 'text',
          placeholder: 'ingrese minutos de espera'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: value =>
          {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: value =>
          {
            console.log('Confirm Ok', value);
            pedidoDelivery.tiempoPreparacion = value.tiempoDeEspera;
            this.confirmarPedidoDelivery(pedidoDelivery);
          }
        }
      ]
    });

    await alert.present();
  }

  rechazarPedidoDelivery(pedidoDelivery: Pedido)
  {
    pedidoDelivery.isActive = false;
    pedidoDelivery.fechaFin = Date.now();
    this.pedidoService.actualizar(pedidoDelivery).then(() =>
    {
      //Avisar al cliente
      UIVisualService.presentToast('Reserva Rechazada.');
    })
  }

  verDetalle(pedido: Pedido)
  {
    this.router.navigate(['/home/info-mesa', 0, pedido.id]);
  }
}
