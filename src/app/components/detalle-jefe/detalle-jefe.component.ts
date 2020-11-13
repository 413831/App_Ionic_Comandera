import { Component, Input, OnInit } from '@angular/core';
import { Imagen } from 'src/app/clases/imagen';
import { Jefe } from 'src/app/clases/jefe';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-detalle-jefe',
  templateUrl: './detalle-jefe.component.html',
  styleUrls: ['./detalle-jefe.component.scss'],
})
export class DetalleJefeComponent implements OnInit
{
  @Input() jefe: Jefe;

  constructor(private UIVisual: UIVisualService) { }

  ngOnInit() { }

  async verFoto(foto: Imagen)
  {
    UIVisualService.verFoto(null, foto);
  }
}