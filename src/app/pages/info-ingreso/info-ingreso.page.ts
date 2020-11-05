import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/clases/cliente';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-info-ingreso',
  templateUrl: './info-ingreso.page.html',
  styleUrls: ['./info-ingreso.page.scss'],
})
export class InfoIngresoPage implements OnInit
{

  constructor(
    private authService: AuthService,
    private roles: RolesService,
    private route: Router,
    private clienteService: ClienteService,
    private uiService: UIVisualService,
  ) { }

  ngOnInit()
  {
  }

  verEncuestasAntiguas()
  {

  }


  ponerseEnListaDeEspera()
  {
    if (this.roles.isClienteAceptado(AuthService.usuario))
    {
      var cliente = AuthService.usuario as Cliente;
      cliente.enListaDeEspera = true;
      this.clienteService.actualizar(cliente).then(() =>
      {
        UIVisualService.presentToast('Estas en la lista de espera');
      })
    }
  }

  verListaDeEspera()
  {
    this.route.navigate(['/home/lista-de-espera']);
  }

}
