import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginPage } from 'src/app/components/login/login.page';
import { RegisterPage } from 'src/app/components/register/register.page';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.page.html',
  styleUrls: ['./auth-page.page.scss'],
})
export class AuthPagePage implements OnInit
{

  constructor(private modalController: ModalController)
  {
  }

  ngOnInit()
  {
  }

  async mostrarLogin(event)
  {
    const modal = await this.modalController.create({
      component: LoginPage,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    return data;
  }

  async mostrarRegistro(event)
  {
    const modal = await this.modalController.create({
      component: RegisterPage,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    return data;
  }

  async mostrarDemoRoles(event)
  {
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: { autoRoles: true }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    return data;
  }


}
