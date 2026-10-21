import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EstadoPedido, Pedido } from 'src/app/clases/pedido';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.scss'],
})
export class ListadoPedidosComponent implements OnInit, DoCheck
{
  usuario: Usuario;
  @Input() pedidos: Pedido[];
  @Output() elegirPedido: EventEmitter<Pedido> = new EventEmitter<Pedido>();
  @Input() opcion: EstadoPedido;

  constructor(private router: Router, public rolService: RolesService) { }

  ngDoCheck(): void
  {
  }

  ngOnInit() 
  {
    // Se guarda el usuario logueado
    this.usuario = AuthService.usuario;
  }

  seleccionarPedido(pedido)
  {
    this.elegirPedido.emit(pedido);
  }

  verDetalle(pedido: Pedido)
  {
    if (pedido.isDelivery)
    {
      this.router.navigate(['/home/info-mesa', 0, pedido.id]);
    }
    else
    {
      this.router.navigate(['/home/info-mesa', pedido.mesa.id, pedido.id]);
    }

  }

  filtrarPedido(pedido: Pedido)
  {
    // Pedidos del Cliente logueado Reservas o En Progreso
    if (this.rolService.isClienteAceptado(this.usuario) &&
      pedido.cliente.id == this.usuario.id &&
      pedido.estado == this.opcion)
    {
      return true;
    }
    else if (this.rolService.isEmpleado(this.usuario) &&
      pedido.estado == this.opcion) // Pedidos para empleados
    {
      return true;
    }
    else if (this.rolService.isJefe(this.usuario) &&
      pedido.estado == this.opcion) // Pedidos para jefes
    {
      return true
    }
    return false;
  }

}
