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

  // async login(provider: LoginProvider)
  // {
  //   const uid = await this.authService.onLogin(this.usuario, provider);

  //   console.log(uid);

  //   this.modalController.dismiss();
  //   this.router.navigate(['/home']);
  // }

  async onLogin(provider: LoginProvider, mailTest?: string, passwordTest?: string)
  {
    const credential = mailTest && passwordTest ?
      await this.authService.onLoginTesting(mailTest, passwordTest) :
      await this.authService.onLogin(this.usuario, provider);
    const uid = credential ? credential.user.uid : null;

    if (uid)
    {
      console.log('Usuario logueado!');
      let cliente, empleado, jefe;
      let clientePromise, empleadoPromise, jefePromise;

      clientePromise = this.clienteService.leerPorID(uid).then(c => cliente = c)
      empleadoPromise = this.empleadoService.leerPorID(uid).then(c => empleado = c)
      jefePromise = this.jefeService.leerPorID(uid).then(c => jefe = c)

      await clientePromise, await empleadoPromise, await jefePromise

      if (cliente)
      {
        AuthService.usuario = cliente
      }
      else if (empleado)
      {
        AuthService.usuario = empleado
      }
      else if (jefe)
      {
        AuthService.usuario = jefe
      }
      else 
      {
        console.log("usuario no encontrado");
        // mostrar error en pantalla
      }
      console.log(AuthService.usuario)

      if (AuthService.usuario)
      {
        this.cerrar();
        this.router.navigate(['/home'])
      }
    }
    else
    {
      console.log("Sin UID " + uid);
    }
  }

  async onLoginAnonymously()
  {
    const uid = await this.authService.onLoginAnonymously();

    if (uid)
    {
      console.log('Cliente anonimo logueado!');

      let cliente = Cliente.CrearCliente(uid, "Anónimo", " ", "0", new Imagen(), " ",
        true, EstadoAceptacion.Anonimo,
        { isWaiting: false, horario: null })
      console.log(cliente)

      AuthService.usuario = cliente;
      this.clienteService.crearAnonimo(cliente);

      this.cerrar();
      this.router.navigate(['/home'])
    }
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