import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { ActionSheetController, ModalController, Platform } from '@ionic/angular';
import { Cliente } from 'src/app/clases/cliente';
import { Usuario } from 'src/app/clases/usuario';
import { INotificacion } from 'src/app/interfaces/INotification';
import { AudioService } from 'src/app/services/audio.service';
import { AuthService } from 'src/app/services/auth.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { HapticService } from 'src/app/services/haptic.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';
import { EncuestaPage } from '../encuesta/encuesta.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit
{
  // Código de prueba
  usuario: Usuario = AuthService.usuario;
  icono = '/assets/img/icono.png';
  muteado: boolean = false;

  constructor(
    private platform: Platform,
    public rolService: RolesService,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationsService,
    private UIVisual: UIVisualService,
    private notificationService: NotificationsService,
    private audioService: AudioService
  ) 
  {
    this.platform.backButton.subscribeWithPriority(10, () =>
    {
      this.authService.onLogout();
    });
  }

  ngOnInit()
  {
    this.usuario = AuthService.usuario;
    this.notifications.initPush();
    HapticService.vibrar();
  }

  cerrarSesion()
  {
    this.notificationService.unsubscribeAll();
    this.authService.onLogout();
    this.router.navigate(['/auth-page']);
  }

  async mostrarMenu() 
  {
    UIVisualService.mostrarMenuJefes();
  }

  async verEncuestaEmpleado()
  {
    UIVisualService.verEncuesta();
  }

  desactivarSonido()
  {
    this.muteado = true;
  }

  activarSonido()
  {
    this.platform.pause.subscribe(() =>
    {
      this.audioService.play('cierre');
    });
    this.muteado = false;
  }
}
