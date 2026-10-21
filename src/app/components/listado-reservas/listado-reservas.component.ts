import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { EstadoPedido, Pedido } from 'src/app/clases/pedido';
import { Reserva } from 'src/app/clases/reserva';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-listado-reservas',
  templateUrl: './listado-reservas.component.html',
  styleUrls: ['./listado-reservas.component.scss'],
})
export class ListadoReservasComponent implements OnInit
{

  @Input() reservas: Pedido[] = [];
  @Output() elegirReserva: EventEmitter<Reserva> = new EventEmitter<Reserva>();
  usuario: Usuario;

  constructor(
    private loadingController: LoadingController,
    public rolService: RolesService,
    private visual: UIVisualService,
    private pedidoService: PedidoService,
  ) { }

  ngOnInit()
  {
    UIVisualService.loading(2000);
    this.usuario = AuthService.usuario;
    if (this.rolService.isJefe(this.usuario))
    {
      this.reservas = this.reservas.filter(reserva => reserva.estado == EstadoPedido.RESERVADO)
    } else
    {
      this.reservas = this.reservas.filter(reserva => reserva.cliente.id == this.usuario.id)
    }
  }

  ngDoCheck()
  {
    if (this.rolService.isJefe(this.usuario))
    {
      this.reservas = this.reservas.filter(reserva => reserva.estado == EstadoPedido.RESERVADO)
    } else
    {
      this.reservas = this.reservas.filter(reserva => reserva.cliente.id == this.usuario.id)
    }
  }

  seleccionarReserva(reserva: Reserva)
  {
    this.elegirReserva.emit(reserva);
  }

  async presentLoading(message, duration) 
  {
    const loading = await this.loadingController.create({
      message,
      duration,
      spinner: 'crescent'
    });
    await loading.present();
  }



  confirmarReserva(reserva: Pedido)
  {
    reserva.estado = EstadoPedido.ASIGNADO;
    this.pedidoService.actualizar(reserva).then(() =>
    {
      UIVisualService.presentToast('Reserva Confirmada.');
    })
  }

  rechazarReserva(reserva: Pedido)
  {
    reserva.isActive = false;
    reserva.fechaFin = Date.now();
    this.pedidoService.actualizar(reserva).then(() =>
    {
      UIVisualService.presentToast('Reserva Rechazada.');
    })
  }

}
