import { Component } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashComponent } from './components/splash/splash.component';
import { Router } from '@angular/router';
import { AudioService } from './services/audio.service';
import { NotificationsService } from './services/notifications.service';
import { EncuestaService } from './services/encuesta.service';
import { PedidoService } from './services/pedido.service';
import { ProductoService } from './services/producto.service';
import { EmpleadoService } from './services/empleado.service';
import { ClienteService } from './services/cliente.service';
import { MockDataService } from './services/mock-data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent
{
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private router: Router,
    private audioService: AudioService,
    private notificationService: NotificationsService,
    private pedidosService: PedidoService,
    private productoService: ProductoService,
    private encuestaService: EncuestaService,
    private empleadosService: EmpleadoService,
    private clienteService: ClienteService
  )
  {
    this.initializeApp();
  }

  initializeApp()
  {
    MockDataService.inicializarDatosDemo();
    try { this.pedidosService.leer().catch(() => {}); } catch (e) {}
    try { this.productoService.traerTodos().catch(() => {}); } catch (e) {}
    try { this.empleadosService.leer().catch(() => {}); } catch (e) {}
    try { this.encuestaService.leer().catch(() => {}); } catch (e) {}
    try { this.clienteService.leerRechazados().catch(() => {}); } catch (e) {}
    this.platform.pause.subscribe(async () =>
    {
      this.audioService.play('cierre');
    });

    this.platform.ready().then(() =>
    {
      this.presentModal().then(() => this.router.navigate(['/auth-page']));
    });
  }

  async presentModal()
  {
    try
    {
      this.statusBar.styleDefault();
    }
    catch (e) {}

    const modal = await this.modalCtrl.create({
      component: SplashComponent,
    });

    return await modal.present();
  }
}
