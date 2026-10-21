import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { EstadoPedido, Pedido } from 'src/app/clases/pedido';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-menu-pedidos',
  templateUrl: './menu-pedidos.page.html',
  styleUrls: ['./menu-pedidos.page.scss'],
})
export class MenuPedidosPage implements OnInit, DoCheck
{
  usuario: Usuario;
  opcion: string;
  pedidos: Pedido[] = PedidoService.pedidos;
  pedidoElegido: Pedido = new Pedido();
  modo: string = 'Listado';

  constructor(private platform: Platform, public rolService: RolesService,
    private route: ActivatedRoute, private router: Router) 
  {
    this.platform.backButton.subscribeWithPriority(10, () =>
    {
      this.router.navigate(["/home/inicio"]);
    });
  }

  ngDoCheck(): void
  {
    this.pedidos = PedidoService.pedidos;
  }

  ngOnInit()
  {
    console.log("INIT");
    this.pedidos = PedidoService.pedidos;

    // Se guarda el usuario logueado
    this.usuario = AuthService.usuario;

    // Se define tab por defecto para visualizar según perfil de Usuario
    if (this.rolService.isCliente(this.usuario)) 
    {
      this.opcion = 'Alta';
      this.modo = "ABM";
    }
    else if (this.rolService.isEmpleado(this.usuario)) this.opcion = EstadoPedido.EN_PROGRESO;
    else if (this.rolService.isJefe(this.usuario)) this.opcion = EstadoPedido.CERRADO;

    // Se lee pedido recibido para ABM
    this.route.params.subscribe(params =>
    {
      console.log(params['id']);
      this.pedidoElegido = PedidoService.pedidos.filter(pedido => pedido.id == params['id'])[0];
      console.log(this.pedidoElegido);
    });


  }

  /**
   * Metodo para seleccionar modo del form para ABM
   * @param event Evento con el valor que determina modo del form
   */
  seleccionarOpcion(event)
  {
    console.log(event.detail.value);
    this.opcion = event.detail.value;
    switch (this.opcion)
    {
      case 'Alta':
      case 'Baja':
      case 'Modificar':
        this.modo = "ABM";
        break;
      case 'Asignado':
      case 'Solicitado':
      case 'En progreso':
      case 'Listo':
      case 'Cerrado':
        this.modo = "Listado";
        break;
    }
  }

  /**
   * Método para recibir pedido seleccionado
   * @param pedido Pedido seleccionado desde listado 
   */
  elegirPedido(pedido)
  {
    console.log(pedido);
    this.pedidoElegido = pedido;
  }


}
