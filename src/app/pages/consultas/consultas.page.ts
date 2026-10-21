import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Cliente, EstadoAceptacion } from 'src/app/clases/cliente';
import { Mensaje } from 'src/app/clases/mensaje';
import { MensajesService, MetadataMensaje } from 'src/app/services/mensajes.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
})
export class ConsultasPage implements OnInit, DoCheck
{
  mensajes: Mensaje[] = [];

  constructor(private platform: Platform, private mensajeService: MensajesService,
    private router: Router, private UIVisual: UIVisualService, public rolService: RolesService) 
  {
    this.platform.backButton.subscribeWithPriority(10, () =>
    {
      this.router.navigate(["/home/inicio"]);
    });
  }

  ngDoCheck(): void
  {
    let mensajesClientes = MensajesService.mensajes;
    this.filtrarMensajesClientes(mensajesClientes);
  }

  async ngOnInit() 
  {
    UIVisualService.loading();
    await this.mensajeService.leer();
  }

  responder(mensaje: Mensaje)
  {
    console.log(mensaje);

    let infoMensaje: MetadataMensaje = {
      chatId: mensaje.chatId,
      mesa: mensaje.mesa
    };

    UIVisualService.verChat(infoMensaje);
  }

  filtrarMensajesClientes(mensajes: Mensaje[])
  {
    console.log(mensajes);

    if (mensajes)
    {
      for (const mensajeNuevo of mensajes) 
      {
        let usuario = mensajeNuevo.usuario;
        let mensaje = this.mensajes ? this.mensajes.find(m => m.chatId == mensajeNuevo.chatId) : null;

        if (!mensaje &&
          usuario.estado == EstadoAceptacion.Aceptado ||
          usuario.estado == EstadoAceptacion.Anonimo) // Unico o primer mensaje del chat
        {
          this.mensajes.push(mensajeNuevo);
        }
        else if (mensaje) // Se actualiza mensaje a mostrar en previsualizacion
        {
          let i = this.mensajes.indexOf(mensaje)
          this.mensajes[i] = mensajeNuevo;
        }

      }
    }
    return this.mensajes;
  }
}
