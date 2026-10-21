import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { EstadoPedido, Pedido } from 'src/app/clases/pedido';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DateService } from 'src/app/services/date.service';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-info-mesa',
  templateUrl: './info-mesa.page.html',
  styleUrls: ['./info-mesa.page.scss'],
})
export class InfoMesaPage implements OnInit, DoCheck
{
  usuario: Usuario;
  pedido: Pedido = new Pedido();
  horaActual: Date;
  idPedido: string;
  idMesa: string;
  isDelivery:boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private mesaService: MesaService,
    private clienteService: ClienteService, private pedidoService: PedidoService,
    private modalController: ModalController,
    public rolService: RolesService, private UIVisual: UIVisualService) 
  {

  }

  ngDoCheck(): void
  {
    console.log("Do Check");
    this.buscarReserva();
  }

  ngOnInit() 
  {
    console.log("On Init");
    UIVisualService.loading();

    this.usuario = AuthService.usuario;
    // Se recibe id de Mesa asignada y id de Cliente
    this.route.params.subscribe(params =>
    {
      this.idMesa = params['mesa'];
      this.idPedido = params['pedido'] ? params['pedido'] : "";
    });
  }


  buscarReserva()
  {
    let fechaActual = new Date();

    if (this.rolService.isCliente(this.usuario)) // Si es cliente accede por QR de Mesa
    {
      
      this.pedido = PedidoService.pedidos.filter(pedido =>
      {
        // Agregar validacion de hora actual
        if(pedido.isDelivery && pedido.estado != EstadoPedido.PAGADO){
          this.isDelivery = true;
          return pedido.cliente.id === this.usuario.id;
        }
        if (pedido.cliente && pedido.mesa)
        {
          return pedido.mesa.id === this.idMesa &&
            pedido.cliente.id === this.usuario.id &&
            this.compararFechas(new Date(pedido.fechaInicio), fechaActual) &&
            pedido.estado != EstadoPedido.PAGADO;
        }
      })[0];
    }
    else if (this.rolService.isEmpleado(this.usuario)) // Si es empleado accede desde listado
    {
      this.pedido = PedidoService.pedidos.filter(pedido =>
      {
        // Agregar validacion de hora actual
        if(pedido.isDelivery && pedido.id === this.idPedido){
          this.isDelivery = true;
          return true;
        }
        if (pedido.cliente && pedido.mesa && pedido.id === this.idPedido)
        {
          this.isDelivery = false;
          return true;
        }
      })[0];
    }

  }

  compararFechas(fechaA: Date, fechaB: Date)
  {

    if (fechaA.getUTCFullYear() === fechaB.getFullYear() &&
      fechaA.getUTCMonth() === fechaB.getMonth() &&
      fechaA.getUTCDate() === fechaB.getDate() &&
      fechaA.getUTCHours() <= fechaB.getHours())
    {
      return true;
    }
    return false;
  }
}

