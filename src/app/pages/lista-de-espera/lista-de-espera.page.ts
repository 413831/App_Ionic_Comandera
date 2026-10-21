import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ViewDidLeave } from '@ionic/angular';
import { Cliente } from 'src/app/clases/cliente';
import { Mesa } from 'src/app/clases/mesa';
import { EstadoPedido, Pedido } from 'src/app/clases/pedido';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-lista-de-espera',
  templateUrl: './lista-de-espera.page.html',
  styleUrls: ['./lista-de-espera.page.scss'],
})
export class ListaDeEsperaPage implements OnInit, DoCheck, ViewDidLeave
{

  asignandoMesa: boolean = false;
  clientes: Cliente[];
  mesas: Mesa[];
  clienteActual: Cliente;
  usuario: Usuario;

  constructor(
    private clienteService: ClienteService,
    private UIVisual: UIVisualService,
    private pedidosService: PedidoService,
    private mesasService: MesaService,
    public rolService: RolesService,
    private platform: Platform,
    private router: Router
  )
  {
    this.platform.backButton.subscribeWithPriority(10, () =>
    {
      this.router.navigate(["/home/inicio"]);
    });
  }

  ionViewDidLeave(): void
  {
    this.asignandoMesa = false;
  }

  ngDoCheck(): void
  {
    this.clientes = ClienteService.clientes.filter(cliente => cliente.enListaDeEspera.isWaiting == true).sort(this.compararFecha);
    this.mesas = MesaService.mesas.filter(mesa => mesa.isAvailable == true);
  }

  compararFecha(a: Cliente, b: Cliente)
  {
    if (a.enListaDeEspera.horario < b.enListaDeEspera.horario)
    {
      return -1;
    }
    if (a.enListaDeEspera.horario > b.enListaDeEspera.horario)
    {
      return 1;
    }
    return 0;
  }

  ngOnInit() 
  {
    UIVisualService.loading(1000);
    this.asignandoMesa = false;
    this.usuario = AuthService.usuario;
    this.clienteService.leer().then(clientes =>
    {
      this.clientes = clientes.filter(cliente => cliente.enListaDeEspera.isWaiting == true).sort(this.compararFecha);
      console.log(this.clientes);
    })
    this.mesasService.leer().then(mesas =>
    {
      this.mesas = mesas.filter(mesa => mesa.isAvailable == true);
    })
  }

  quitarDeLaLista(cliente: Cliente)
  {
    cliente.enListaDeEspera.isWaiting = false;
    this.clienteService.actualizar(cliente).then(ok =>
    {
      UIVisualService.presentToast('Removido correctamente.');
    });
  }

  verMesas(cliente: Cliente)
  {
    if (this.mesas.length == 0)
    {
      UIVisualService.presentToast('No hay mesas disponibles.');
    }
    else
    {
      this.clienteActual = cliente;
      this.asignandoMesa = true;
      UIVisualService.presentAlert('Asignando una mesa al cliente:  ', cliente.nombre + ' ' + cliente.apellido);
    }

  }

  asignarMesa(mesa: Mesa)
  {
    let mensaje = 'Mesa:' + mesa.numero + ' asignada.';
    let fechaActual = Date.now() - (new Date().getTimezoneOffset() * 60000);

    this.pedidosService.crear(Pedido.CrearPedido('', this.clienteActual, mesa, [], fechaActual,
      null, 0, EstadoPedido.ASIGNADO, true)).then(() =>
      {
        //Se envia push al cliente avisando que es su turno y un redireccionamiento al pedidos page
        UIVisualService.presentAlert('Mesa Asignada', mensaje);
        this.asignandoMesa = false;
        this.clienteActual.enListaDeEspera.isWaiting = false;
        this.clienteService.actualizar(this.clienteActual).then(ok =>
        {
          console.log('Lista actualizada');
        })
        mesa.isAvailable = false;
        this.mesasService.actualizar(mesa).then(() => console.log('Mesa asignada correctamente'));
      })
  }

}
