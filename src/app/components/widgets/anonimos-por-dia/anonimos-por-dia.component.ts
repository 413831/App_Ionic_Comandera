import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import theme from 'highcharts/themes/dark-unica';
import { Cliente } from 'src/app/clases/cliente';
import { Pedido } from 'src/app/clases/pedido';
import { Dia, Serie } from 'src/app/pages/estadisticas/estadisticas.page';
import { PedidoService } from 'src/app/services/pedido.service';
import { RolesService } from 'src/app/services/roles.service';


@Component({
  selector: 'app-anonimos-por-dia',
  templateUrl: './anonimos-por-dia.component.html',
  styleUrls: ['./anonimos-por-dia.component.scss'],
})
export class AnonimosPorDiaComponent implements OnInit
{
  public highchart;
  public data;
  public chart;
  public updateFromInput = false;
  public Highcharts = Highcharts;
  public chartConstructor = 'chart';
  public chartOptions;
  public chartCallback;
  public pedidos: Pedido[] = []
  public semana: Dia[] = [Dia.Domingo, Dia.Lunes, Dia.Martes, Dia.Miercoles, Dia.Jueves,
  Dia.Viernes, Dia.Sabado];
  private XCategories: Array<any>;

  constructor(public rolService: RolesService) { }

  ngOnInit() 
  {
    this.pedidos = PedidoService.pedidos;
    console.log(this.pedidos);
    this.procesarDatos();
    this.crearGrafico();
  }

  procesarDatos()
  {
    let anonimos: number[] = [];

    this.semana.forEach(dia => 
    {
      let cantidad = 0;

      this.pedidos.forEach(pedido => 
      {
        let anonimo = this.rolService.isClienteAnonimo(<Cliente>pedido.cliente)

        if (new Date(pedido.fechaInicio).getDay() == dia && anonimo)
        {
          cantidad++;
        }
      });
      anonimos.push(cantidad);
    });

    this.data = anonimos;
    console.log(this.data);
  }

  crearGrafico()
  {
    theme(Highcharts);
    this.chartCallback = (chart) =>
    {
      setTimeout(() =>
      {
        chart.reflow();
        this.chartOptions = {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Anónimos'
          },
          subtitle: {
            text: 'Cantidad por día'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Cantidad de anónimos'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          legend: {
            enabled: false
          },
          tooltip: {
            useHTML: true,
            shape: "square",
            borderRadius: 15,
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          series: [{
            type: 'column',
            name: "Anónimos",
            colorByPoint: true,
            data: this.data
          }]
        };
      }, 0);
    };
    this.chartOptions = {};
  }
}
