import { ComponentRef, Injectable } from '@angular/core';
import { ActionSheetButton } from '@ionic/core/dist/types/interface';
import { ActionSheetController, AlertController, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { CartaPage } from '../pages/carta/carta.page';
import { Imagen } from '../clases/imagen';
import { FotoComponent } from '../components/foto/foto.component';
import { Producto } from '../clases/producto';
import { ListaPlatosClienteComponent } from '../components/lista-platos-cliente/lista-platos-cliente.component';
import { LoginPage } from '../components/login/login.page';
import { RegisterPage } from '../components/register/register.page';
import { Router } from '@angular/router';
import { FormPedidoComponent } from '../components/form-pedido/form-pedido.component';
import { EstadoPedido, Pedido } from '../clases/pedido';
import { SalaChatPage } from '../pages/sala-chat/sala-chat.page';
import { PedidoService } from './pedido.service';
import { MetadataMensaje } from './mensajes.service';
import { HapticService } from './haptic.service';
import { FacturaComponent } from '../components/factura/factura.component';
import { Cliente } from '../clases/cliente';
import { EncuestaPage } from '../pages/encuesta/encuesta.page';

/**
 * Interfaz para crear dinámicamente botones de un Action Sheet
 */
export interface IBotonesGenerados
{
  mostrarPlatos?: { boton?: ActionSheetButton, handler: any, params?: any },
  solicitar?: { boton?: ActionSheetButton, handler: any, params?: any },
  confirmar?: { boton?: ActionSheetButton, handler: any, params?: any },
  recibir?: { boton?: ActionSheetButton, handler: any, params?: any },
  cerrar?: { boton?: ActionSheetButton, handler: any, params?: any },
  chat?: { boton?: ActionSheetButton, handler: any, params?: MetadataMensaje },
  notificar?: { boton?: ActionSheetButton, handler: any, params?: any },
  liberar?: { boton?: ActionSheetButton, handler: any, params?: any },
  encuesta?: { boton?: ActionSheetButton, handler: any },
}

/**
 * Clase para centralizar lógica de componentes de UI de Ionic
 * Los métodos de modals y popovers deben estar encapsulados en las clases clientes
 */
@Injectable({
  providedIn: 'root'
})
export class UIVisualService
{
  private static UI: UIVisualService;
  private static DURACION_TOAST = 2000;



  constructor(private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private popoverController: PopoverController,
    private router: Router,
    private pedidoService: PedidoService,
    private loadingController: LoadingController) 
  {
    UIVisualService.UI = this;
  }

  static async loading(duration?: number)
  {
    const loading = await UIVisualService.UI.loadingController.create({
      message: '<ion-img src="/assets/img/logo.svg" alt="loading..." class="ion-no-padding spinner"></ion-img>',
      cssClass: 'spinner-animation',
      mode: "ios",
      showBackdrop: false,
      spinner: null,
      duration: duration ? duration : 2000
    });
    await loading.present();
  }

  static async presentToast(message)
  {
    const toast = await UIVisualService.UI.toastController.create({
      message,
      duration: UIVisualService.DURACION_TOAST,
    })

    HapticService.vibrar();
    toast.present();
  }

  static async presentAlert(header, message)
  {
    const alert = await UIVisualService.UI.alertController.create({
      header,
      message,
      buttons: ['Cerrar']
    });

    await alert.present();
  }



  static async presentActionSheet(rol: any, estado: EstadoPedido, handlers: IBotonesGenerados) 
  {
    console.log(handlers);
    // TODO: Modificar cuando se implemente servicio de Roles
    let botones = this.generarBotones(rol, estado, handlers);

    console.log(botones);
    // Botones por defecto para cualquier Rol
    botones.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel',
      handler: () => console.log('Cancel clicked')
    })

    const actionSheet = await UIVisualService.UI.actionSheetController.create({
      header: 'Opciones',
      mode: 'ios',
      translucent: true,
      buttons: botones
    });

    await actionSheet.present();
  }

  static generarBotones(rol: any, estado: EstadoPedido, handlers: IBotonesGenerados): ActionSheetButton[]
  {
    console.log(rol);
    // Codigo a modo de ejemplo
    let botonesGenerados: ActionSheetButton[] = [];

    switch (rol)
    {
      case 'Cliente':
        if (estado == EstadoPedido.ASIGNADO)
        {
          handlers.solicitar.boton = {
            text: 'Hacer pedido',
            icon: 'hand-left-sharp',
            handler: () => this.UI.pedidoService.hacerPedido(handlers.solicitar.params)
          }
          if (handlers.solicitar) botonesGenerados.push(handlers.solicitar.boton);
        }

        handlers.mostrarPlatos.boton = {
          text: 'Mostrar Platos',
          icon: 'fast-food-outline',
          handler: () => handlers.mostrarPlatos.handler(handlers.mostrarPlatos.params)
        }
        if (handlers.mostrarPlatos) botonesGenerados.push(handlers.mostrarPlatos.boton);

        handlers.chat.boton = {
          text: 'Consultas',
          icon: 'chatbubbles-sharp',
          handler: () => handlers.chat.handler(handlers.chat.params)
        }
        if (handlers.chat) botonesGenerados.push(handlers.chat.boton);

        if (estado == EstadoPedido.LISTO)
        {
          handlers.recibir.boton = {
            text: 'Confirmar recepción',
            icon: 'checkmark-done-sharp',
            handler: () => this.UI.pedidoService.recibirPedido(handlers.recibir.params)
          }
          if (handlers.recibir) botonesGenerados.push(handlers.recibir.boton);
        }

        if (estado == EstadoPedido.ENTREGADO)
        {
          handlers.cerrar.boton = {
            text: 'Pagar',
            icon: 'cash-outline',
            handler: () => handlers.cerrar.handler(handlers.cerrar.params)
          }
          if (handlers.cerrar) botonesGenerados.push(handlers.cerrar.boton);
        }

        if (estado == EstadoPedido.CERRADO || estado == EstadoPedido.PAGADO)
        {
          handlers.encuesta.boton = {
            text: 'Encuesta',
            icon: 'analytics-sharp',
            handler: () => handlers.encuesta.handler()
          }
          if (handlers.encuesta) botonesGenerados.push(handlers.encuesta.boton);
        }

        break;
      case 'Delivery':
      case 'Mozo':
        handlers.mostrarPlatos.boton = {
          text: 'Mostrar Platos',
          icon: 'fast-food-outline',
          handler: () => handlers.mostrarPlatos.handler(handlers.mostrarPlatos.params)
        }
        if (handlers.mostrarPlatos) botonesGenerados.push(handlers.mostrarPlatos.boton);

        handlers.chat.boton = {
          text: 'Consultas',
          icon: 'chatbubbles-sharp',
          handler: () => handlers.chat.handler(handlers.chat.params)
        }
        if (handlers.chat) botonesGenerados.push(handlers.chat.boton);

        if (estado == EstadoPedido.SOLICITADO)
        {
          handlers.confirmar.boton = {
            text: 'Confirmar pedido',
            icon: 'checkmark-sharp',
            handler: () => this.UI.pedidoService.aceptarPedido(handlers.confirmar.params)
          }
          if (handlers.confirmar) botonesGenerados.push(handlers.confirmar.boton);
        }

        if (estado == EstadoPedido.CERRADO)
        {
          handlers.liberar.boton = {
            text: 'Confirmar pago',
            icon: 'thumbs-up-outline',
            handler: () => this.UI.pedidoService.aceptarPago(handlers.liberar.params)
          }
          if (handlers.liberar) botonesGenerados.push(handlers.liberar.boton);
        }
        break;
      case 'Bartender':
      case 'Cocinero':
        handlers.mostrarPlatos.boton = {
          text: 'Preparar',
          icon: 'fast-food-outline',
          handler: () => handlers.mostrarPlatos.handler(handlers.mostrarPlatos.params)
        }
        if (handlers.mostrarPlatos) botonesGenerados.push(handlers.mostrarPlatos.boton);

        handlers.notificar.boton = {
          text: 'Llamar mozo',
          icon: 'radio-sharp',
          handler: () => this.UI.pedidoService.notificarEntrega(handlers.notificar.params)
        }
        if (handlers.notificar) botonesGenerados.push(handlers.notificar.boton);

        break;
    }

    return botonesGenerados;
  }

  static async verCarta(): Promise<Producto[]>
  {
    const modal = await UIVisualService.UI.modalController.create({
      component: CartaPage,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss<Producto[]>();

    return data;
  }

  static async verPlatos(pedido: Pedido)
  {
    const modal = await UIVisualService.UI.modalController.create({
      component: ListaPlatosClienteComponent,
      componentProps: {
        pedido: pedido
      }
    });

    UIVisualService.loading();
    await modal.present();
  }

  static async verChat(metadata: MetadataMensaje)
  {
    console.log(metadata);

    const modal = await UIVisualService.UI.modalController.create({
      component: SalaChatPage,
      componentProps: {
        chatID: metadata.chatId,
        mesa: metadata.mesa
      }
    });

    await modal.present();
  }

  static async verCuenta(pedido: Pedido)
  {

    const modal = await UIVisualService.UI.modalController.create({
      component: FacturaComponent,
      componentProps: {
        pedido: pedido,
      }
    });

    await modal.present();

    modal.onWillDismiss().then(() => this.loading());
  }

  static async verEncuesta()
  {

    const modal = await UIVisualService.UI.modalController.create({
      component: EncuestaPage
    });

    await modal.present();

    modal.onWillDismiss().then(() => UIVisualService.loading());
  }

  static async verFoto(ev: any, foto: Imagen)
  {
    const popover = await UIVisualService.UI.popoverController.create({
      component: FotoComponent,
      animated: true,
      event: ev,
      translucent: false,
      componentProps: {
        img: foto
      }
    });

    await popover.present();
  }

  static async mostrarMenuJefes() 
  {
    const actionSheet = await UIVisualService.UI.actionSheetController.create({
      header: 'Menú',
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Clientes',
          icon: 'people-outline',
          handler: () => { UIVisualService.UI.router.navigate(['/home/menu-cliente']); }
        },
        {
          text: 'Empleados',
          icon: 'accessibility-outline',
          handler: () => { UIVisualService.UI.router.navigate(['/home/menu-empleado']); }
        },
        {
          text: 'Supervisores',
          icon: 'glasses-outline',
          handler: () => { UIVisualService.UI.router.navigate(['/home/menu-jefe']); }
        },
        {
          text: 'Mesas',
          icon: 'storefront-outline',
          handler: () => { UIVisualService.UI.router.navigate(['/home/menu-mesa']); }
        },
        {
          text: 'Nuevos Clientes',
          icon: 'person-add-outline',
          handler: () => { UIVisualService.UI.router.navigate(['/home/clientes-pendientes']); }
        },
        {
          text: 'Encuesta',
          icon: 'document-text-sharp',
          handler: () => { UIVisualService.verEncuesta(); }
        },
        {
          text: 'Estadísticas',
          icon: 'analytics-outline',
          handler: () => { UIVisualService.UI.router.navigate(['/home/estadisticas']); }
        },
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => console.log('Cerrar')
        }]
    });

    await actionSheet.present();
  }


}
