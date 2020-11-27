import { AfterViewChecked, Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Mensaje } from 'src/app/clases/mensaje';
import { MensajesService } from 'src/app/services/mensajes.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked, DoCheck
{
  @Input() mensajes: Mensaje[] = [];
  @Input() mensaje: Mensaje;
  @Input() idUsuario: string;
  cantidadMensajes: number;

  @ViewChild(IonContent, { read: IonContent, static: false }) content: IonContent;

  constructor(private mensajesService: MensajesService, private notificationService: NotificationsService)
  { }

  ngDoCheck(): void
  {
    console.log(this.mensajes.length);
  }

  ngOnInit() 
  {
    this.scrollToBottomOnInit();
    this.cantidadMensajes = this.mensajes.length;
  }

  ngAfterViewChecked(): void
  {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if (this.mensaje)
    {
      this.scrollToBottomOnInit();
      this.cargarMensaje();
    }
    else if (this.mensajes.length > this.cantidadMensajes)
    {
      this.scrollToBottomOnInit();
      this.cantidadMensajes = this.mensajes.length;
    }
  }


  cargarMensaje()
  {
    console.log(this.mensaje);
    this.mensajes.push(this.mensaje);
    this.mensajesService.crear(this.mensaje);

    switch (this.mensaje.usuario.tipo)
    {
      case 'Cliente':
        this.notificationService.enviarNotificacion(`Nuevo Mensaje mesa ${this.mensaje.mesa}`, this.mensaje.texto,
          '/home/consultas',//No es sala-chat?
          'mozos');
        break;
      case 'Mozo':
        let tokenCliente = this.mensajes.find(m => m.usuario.id != this.idUsuario).usuario.token;

        this.notificationService.enviarNotificacionPorToken('Nuevo Mensaje', this.mensaje.texto,'/home/consultas', tokenCliente);
        break;
    }

    this.mensaje = null;
  }

  scrollToBottomOnInit()
  {
    console.log("SCROLLING");
    setTimeout(() =>
    {
      this.content.scrollToBottom(100);
    }, 1000);
  }

}
