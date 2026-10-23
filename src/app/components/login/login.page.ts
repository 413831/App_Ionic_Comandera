import { Component, Input, OnInit } from '@angular/core';
import { AuthService, USERS_TEST } from '../../services/auth.service';
import { Usuario } from 'src/app/clases/usuario';
import { Cliente, EstadoAceptacion } from 'src/app/clases/cliente';
import { JefeService } from 'src/app/services/jefe.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Imagen } from 'src/app/clases/imagen';
import { LoginProvider } from 'src/app/interfaces/IProviders';

import { MockDataService } from 'src/app/services/mock-data.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit
{
  @Input() autoRoles: boolean = false;
  usuario: Usuario = new Usuario()

  constructor(private authService: AuthService,
    private router: Router,
    private jefeService: JefeService,
    private empleadoService: EmpleadoService,
    private clienteService: ClienteService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController) { }

  ngOnInit()
  {
  }

  ionViewDidEnter()
  {
    if (this.autoRoles)
    {
      this.mostrarRoles();
    }
  }

  async onLogin(provider: LoginProvider, mailTest?: string, passwordTest?: string)
  {
    MockDataService.inicializarDatosDemo();

    let uid: string = null;
    try
    {
      const credential = mailTest && passwordTest ?
        await this.authService.onLoginTesting(mailTest, passwordTest) :
        await this.authService.onLogin(this.usuario, provider);
      uid = credential ? credential.user.uid : null;
    }
    catch (e)
    {
      console.warn("Aviso Firebase Auth:", e);
    }

    let cliente = null;
    let empleado = null;
    let jefe = null;

    if (uid)
    {
      try
      {
        const [c, e, j] = await Promise.all([
          this.clienteService.leerPorID(uid).catch(() => null),
          this.empleadoService.leerPorID(uid).catch(() => null),
          this.jefeService.leerPorID(uid).catch(() => null)
        ]);
        cliente = c;
        empleado = e;
        jefe = j;
      }
      catch (err)
      {
        console.warn("Aviso leyendo perfiles de Firebase:", err);
      }

      if (cliente)
      {
        AuthService.usuario = cliente;
      }
      else if (empleado)
      {
        AuthService.usuario = empleado;
      }
      else if (jefe)
      {
        AuthService.usuario = jefe;
      }
    }

    // Fallback: si no se encontró en Firebase o estamos en modo demo con mailTest
    if (!AuthService.usuario && (mailTest || this.usuario.email))
    {
      const emailTarget = mailTest || this.usuario.email;
      console.log('Cargando perfil mock para email:', emailTarget);
      AuthService.usuario = MockDataService.obtenerUsuarioPorEmail(emailTarget, uid);
    }

    if (AuthService.usuario)
    {
      console.log('Usuario activo:', AuthService.usuario);
      UIVisualService.presentToast(`Bienvenido/a ${AuthService.usuario.nombre}`);
      this.cerrar();
      this.router.navigate(['/home']);
    }
    else
    {
      UIVisualService.presentToast('No se pudo iniciar sesión. Verifique los datos.');
    }
  }

  async onLoginAnonymously()
  {
    MockDataService.inicializarDatosDemo();
    let uid = null;

    try
    {
      uid = await this.authService.onLoginAnonymously();
    }
    catch (error)
    {
      console.warn('Firebase anon login fallback:', error);
    }

    const anonUser = MockDataService.crearClienteAnonimo(uid);
    AuthService.usuario = anonUser;

    try
    {
      this.clienteService.crearAnonimo(anonUser);
    }
    catch (e) {}

    UIVisualService.presentToast('Bienvenido Cliente Anónimo');
    this.cerrar();
    this.router.navigate(['/home']);
  }

  async onLoginMail()
  {
    const alert = await this.alertController.create({
      header: 'Iniciar sesión',
      cssClass: 'promptLogin',
      inputs: [
        {
          name: 'mail',
          type: 'text',
          placeholder: 'Correo electrónico'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Aceptar',
          handler: (data) =>
          {
            this.usuario.email = data.mail;
            this.usuario.password = data.password;

            this.onLogin(LoginProvider.Email);
          }
        }
      ]
    });

    await alert.present();
  }

  async onLoginGoogle()
  {
    this.onLogin(LoginProvider.Google);
  }

  async onLoginFacebook()
  {
    this.onLogin(LoginProvider.Facebook);
  }

  async onLoginTwitter()
  {
    this.onLogin(LoginProvider.Twitter);
  }

  async onLoginGithub()
  {
    this.onLogin(LoginProvider.Github);
  }

  async mostrarRoles()
  {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cuentas de Prueba / Demo (Portfolio)',
      mode: "ios",
      translucent: true,
      buttons: [
        {
          text: '👑 Dueño',
          handler: () => this.onLogin(LoginProvider.Email, USERS_TEST.duenio.mail, USERS_TEST.duenio.password)
        },
        {
          text: '🛡️ Supervisor',
          handler: () => this.onLogin(LoginProvider.Email, USERS_TEST.supervisor.mail, USERS_TEST.supervisor.password)
        },
        {
          text: '🍽️ Mozo',
          handler: () => this.onLogin(LoginProvider.Email, USERS_TEST.mozo.mail, USERS_TEST.mozo.password)
        },
        {
          text: '🍳 Cocinero',
          handler: () => this.onLogin(LoginProvider.Email, USERS_TEST.cocinero.mail, USERS_TEST.cocinero.password)
        },
        {
          text: '🍹 Bartender',
          handler: () => this.onLogin(LoginProvider.Email, USERS_TEST.bartender.mail, USERS_TEST.bartender.password)
        },
        {
          text: '🛵 Delivery',
          handler: () => this.onLogin(LoginProvider.Email, USERS_TEST.delivery.mail, USERS_TEST.delivery.password)
        },
        {
          text: '👤 Cliente Registrado',
          handler: () => this.onLogin(LoginProvider.Email, USERS_TEST.cliente.mail, USERS_TEST.cliente.password)
        },
        {
          text: '🎭 Cliente Anónimo',
          handler: () => this.onLoginAnonymously()
        },
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => console.log('Cerrar')
        }
      ]
    });

    await actionSheet.present();
  }

  cerrar()
  {
    this.modalController.dismiss();
  }


}