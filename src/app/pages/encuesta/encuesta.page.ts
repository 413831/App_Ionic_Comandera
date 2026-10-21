import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit
{
  usuario: Usuario = AuthService.usuario;

  constructor(public rolService: RolesService, private empleadoService: EmpleadoService,
    private clienteService: ClienteService, private modalController: ModalController,
    private encuestaService: EncuestaService) { }

  ngOnInit()
  {
    if (this.rolService.isJefe(this.usuario))
    {
      this.empleadoService.leer();
      this.clienteService.leer();
    }
  }

  cerrar()
  {
    this.modalController.dismiss();
  }



}
