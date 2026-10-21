import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ModalController } from '@ionic/angular';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit
{
  private dismissed = false;

  constructor(
    public viewCtrl: ModalController,
    public splashScreen: SplashScreen,
    public audioService: AudioService
  )
  {
    try
    {
      this.audioService.play('inicio');
    }
    catch (e) {}

    try
    {
      this.splashScreen.hide();
    }
    catch (e) {}

    setTimeout(() =>
    {
      this.cerrar();
    }, 3000);
  }

  cerrar()
  {
    if (!this.dismissed)
    {
      this.dismissed = true;
      this.viewCtrl.dismiss().catch(() => {});
    }
  }

  ngOnInit() { }
}
