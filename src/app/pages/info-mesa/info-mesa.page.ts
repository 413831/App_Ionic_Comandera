import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mesa } from 'src/app/clases/mesa';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-info-mesa',
  templateUrl: './info-mesa.page.html',
  styleUrls: ['./info-mesa.page.scss'],
})
export class InfoMesaPage implements OnInit
{
  mesa: Mesa;

  constructor(private route: ActivatedRoute, private mesaService: MesaService) 
  {
    this.route.params.subscribe(params =>
    {
      this.fetchMesa(params['id']);
    });
  }

  ngOnInit() 
  {
  }

  async fetchMesa(id: string)
  {
    // Se debería traer Entidad con información sobre Pedido y Cliente de Mesa
    this.mesa = await this.mesaService.fetch(id);
  }

  verEncuesta()
  {
    console.log("Ver encuesta");
  }

}
