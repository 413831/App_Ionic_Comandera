import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Pedido, EstadoPedido } from 'src/app/clases/pedido';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-menu-delivery',
  templateUrl: './menu-delivery.page.html',
  styleUrls: ['./menu-delivery.page.scss'],
})
export class MenuDeliveryPage implements OnInit {

  usuario: Usuario;
  opcion: string = 'Listado';
  listado: Pedido[];
  deliveryElegido: Pedido;

  constructor(private pedidoService: PedidoService,
    public rolService: RolesService,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
  ) 
  {
    this.platform.backButton.subscribeWithPriority(10, () =>
    {
      this.router.navigate(["/home/inicio"]);
    });
  }

  ngDoCheck(): void
  {
    this.listado = PedidoService.pedidos.filter(pedido => pedido.isDelivery);
  }

  ngOnInit()
  {
    this.usuario = AuthService.usuario;
    console.log("INIT");
    this.route.queryParams.subscribe(params =>
    {
      if (params.opcion)
      {
        this.opcion = params.opcion;
      }
      else
      {
        this.opcion = 'Listado'
      }

    });

  }

  seleccionarOpcion(event)
  {
    console.log(event.detail.value);
    this.opcion = event.detail.value;
  }

  elegirPedidoDelivery(event)
  {
    console.log(event);
    this.deliveryElegido = event;
  }
}
