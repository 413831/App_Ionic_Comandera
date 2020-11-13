import { Component, Input, OnInit } from '@angular/core';
import { Empleado } from 'src/app/clases/empleado';
import { Imagen } from 'src/app/clases/imagen';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-detalle-empleado',
  templateUrl: './detalle-empleado.component.html',
  styleUrls: ['./detalle-empleado.component.scss'],
})
export class DetalleEmpleadoComponent implements OnInit
{
  @Input() empleado: Empleado;

  constructor(private UIVisual: UIVisualService) { }

  ngOnInit() { }

  async verFoto(foto: Imagen)
  {
    UIVisualService.verFoto(null, foto);
  }
}
