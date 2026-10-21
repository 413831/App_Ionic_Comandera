import { Component, Input, OnInit } from '@angular/core';
import { TipoEmpleado } from 'src/app/clases/empleado';
import { Pedido } from 'src/app/clases/pedido';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { MetadataMensaje } from 'src/app/services/mensajes.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { RolesService } from 'src/app/services/roles.service';
import { IBotonesGenerados, UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss'],
})
export class DetallePedidoComponent implements OnInit
{
  @Input() pedido: Pedido;
  usuario: Usuario = AuthService.usuario;
  rol: string;
  metadataMensaje: MetadataMensaje;
  botonesActionSheet: IBotonesGenerados;

  constructor(public rolService: RolesService) 
  {
  }

  ngOnInit() 
  {

  }

  async crearMenu()
  {
    console.log(this.pedido);
    let mesa = null;

    if (this.rolService.isCliente(this.usuario))
    {
      this.rol = 'Cliente';
      mesa = this.pedido.mesa.numero;
    }
    else if (this.rolService.isEmpleadoMozo(this.usuario))
    {
      this.rol = 'Mozo';
    }
    else if (this.rolService.isEmpleadoCocinero(this.usuario))
    {
      this.rol = 'Cocinero';
    }
    else if (this.rolService.isEmpleadoBartender(this.usuario))
    {
      this.rol = 'Bartender';
    }
    else if (this.rolService.isEmpleadoDelivery(this.usuario))
    {
      this.rol = 'Delivery';
    }

    this.metadataMensaje = {
      chatId: this.pedido.id,
      mesa: mesa
    };

    this.botonesActionSheet = {
      mostrarPlatos: { handler: UIVisualService.verPlatos, params: this.pedido },
      solicitar: { handler: "", params: this.pedido },
      confirmar: { handler: "", params: this.pedido },
      recibir: { handler: "", params: this.pedido },
      cerrar: { handler: UIVisualService.verCuenta, params: this.pedido },
      chat: { handler: UIVisualService.verChat, params: this.metadataMensaje },
      notificar: { handler: "", params: this.pedido },
      liberar: { handler: "", params: this.pedido },
      encuesta: { handler: UIVisualService.verEncuesta }
    };
  }

  async mostrarOpciones()
  {
    this.crearMenu();
    UIVisualService.presentActionSheet(this.rol, this.pedido.estado, this.botonesActionSheet)
  }

}
