import { AfterViewChecked, Component, DoCheck, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ViewDidEnter } from '@ionic/angular';
import { Cliente } from 'src/app/clases/cliente';
import { Mensaje } from 'src/app/clases/mensaje';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-sala-chat',
  templateUrl: './sala-chat.page.html',
  styleUrls: ['./sala-chat.page.scss'],
})
export class SalaChatPage implements OnInit, DoCheck, ViewDidEnter, AfterViewChecked
{
  usuario: Usuario = AuthService.usuario;
  mensaje: Mensaje;
  mensajes: Mensaje[];
  textoAuxiliar: string;
  @Input() chatID: string;
  @Input() mesa: number;

  constructor(private platform: Platform,
    private mensajeService: MensajesService,
    private modalController: ModalController,
    public rolService: RolesService) 
  {
    this.platform.backButton.subscribeWithPriority(10, () =>
    {
      this.cerrar();
    });
  }

  ngAfterViewChecked(): void
  {
    let mensajesNuevos = MensajesService.mensajes.filter(mensaje => mensaje.chatId == this.chatID);

    if (this.mensajes.length != mensajesNuevos.length)
    {
      this.mensajes = mensajesNuevos;
    }
  }

  ionViewDidEnter(): void
  {
    this.mensajes = MensajesService.mensajes.filter(mensaje => mensaje.chatId == this.chatID);
  }

  ngOnInit()
  {
    this.mensajeService.leer()
      .then(mensajes => 
      {
        this.mensajes = mensajes.filter(mensaje => mensaje.chatId == this.chatID);
        console.log(this.mensajes);
      });
  }

  ngDoCheck(): void
  {
    this.mensajes = MensajesService.mensajes.filter(mensaje => mensaje.chatId == this.chatID);
  }

  enviar()
  {
    let tipo;
    let estado;
    let token = this.usuario.tokenNotification ? this.usuario.tokenNotification : null;
    let foto = this.usuario.foto ? this.usuario.foto : null;

    if (this.rolService.isCliente(this.usuario))
    {
      tipo = 'Cliente'
      estado = (<Cliente>this.usuario).estado;
    }
    else if (this.rolService.isEmpleadoMozo(this.usuario))
    {
      tipo = 'Mozo'
      estado = null;
    }

    if (this.textoAuxiliar)
    {
      let datosUsuario = {
        id: this.usuario.id,
        foto: foto,
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        estado: estado,
        token: token,
        tipo: tipo
      };

      this.mensaje = Mensaje.CrearMensaje(" ", this.textoAuxiliar, datosUsuario,
        new Date().toString(), this.chatID, this.mesa);
      this.textoAuxiliar = null;
    }
  }

  cerrar()
  {
    this.modalController.dismiss();
  }




}
