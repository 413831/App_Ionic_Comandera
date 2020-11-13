import { Component, Input, OnInit } from '@angular/core';
import { Cliente, EstadoAceptacion } from 'src/app/clases/cliente';
import { Imagen } from 'src/app/clases/imagen';
import { ClienteService } from 'src/app/services/cliente.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.scss'],
})
export class DetalleClienteComponent implements OnInit
{
  @Input() cliente: Cliente;
  @Input() pendiente: boolean;

  constructor(private clienteService: ClienteService, private UIVisual: UIVisualService) { }

  ngOnInit() { }

  //TODO: tomar foto del cliente
  sacarFoto()
  {
    console.log("Sacar foto");
  }

  aceptarCliente()
  {
    this.cliente.estado = EstadoAceptacion.Aceptado;
    this.clienteService.actualizar(this.cliente)
    console.log(this.cliente)
  }

  rechazarCliente()
  {
    this.cliente.estado = EstadoAceptacion.Rechazado;
    this.clienteService.actualizar(this.cliente)
    console.log(this.cliente)
  }

  async verFoto(foto: Imagen)
  {
    UIVisualService.verFoto(null, foto);
  }
}