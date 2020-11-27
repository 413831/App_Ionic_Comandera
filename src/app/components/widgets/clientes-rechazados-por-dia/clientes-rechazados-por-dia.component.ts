import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import theme from 'highcharts/themes/dark-unica';
import { Cliente } from 'src/app/clases/cliente';
import { Dia} from 'src/app/pages/estadisticas/estadisticas.page';
import { ClienteService } from 'src/app/services/cliente.service';
import { RolesService } from 'src/app/services/roles.service';
/* import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
HC_exporting(Highcharts);
HC_exportData(Highcharts); */


@Component({
  selector: 'app-clientes-rechazados-por-dia',
  templateUrl: './clientes-rechazados-por-dia.component.html',
  styleUrls: ['./clientes-rechazados-por-dia.component.scss'],
})
export class ClientesRechazadosPorDiaComponent implements OnInit
{

  public highchart;
  public data: Array<any> = [];
  public chart;
  public updateFromInput = false;
  public Highcharts = Highcharts;
  public chartConstructor = 'chart';
  public chartOptions;
  public chartCallback;
  public clientes: Cliente[] = []
  public semana: Dia[] = [Dia.Domingo, Dia.Lunes, Dia.Martes, Dia.Miercoles, Dia.Jueves,
  Dia.Viernes, Dia.Sabado];
  private XCategories: Array<any> = [];

  constructor(private rolService: RolesService, private clienteService: ClienteService) { }

  ngOnInit() 
  {
    this.clientes = ClienteService.clientesRechazados;
    console.log(this.clientes);
    this.procesarDatos();
    this.crearGrafico();
  }

  procesarDatos()
  {
    let anonimos: number[] = [];
    let InicioDeActividades = new Date(2020, 10, 20);
    let hoy = new Date();
    console.log('Rechazados por dia', InicioDeActividades.toLocaleString(), 'HASTA', hoy.toLocaleString());
    do//una vez por dia
    {
      console.log(InicioDeActividades.toLocaleDateString());
      this.XCategories.push(InicioDeActividades.toLocaleDateString());
      let cantidad = 0;
      this.clientes.forEach(cliente =>
      {
        let fechaRechazo = new Date(cliente.fechaDeRechazo);
        console.log('Rechazado:', fechaRechazo.toLocaleDateString());
        console.log('HOY: ', hoy.toLocaleDateString());
        if (fechaRechazo.toLocaleDateString() == InicioDeActividades.toLocaleDateString())//Si hay un cliente rechazado, 
        {
          cantidad++;
        }
      })
      this.data.push(cantidad);//asigno la cantidad sea 0 o mayor a 0;
      InicioDeActividades = this.sumarDias(InicioDeActividades, 1);
    } while (InicioDeActividades.getTime() < hoy.getTime());//mientras sea menor al dia de hoy
    console.log(this.data);
  }

  sumarDias(fecha, dias)
  {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
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
            type: 'area'
          },
          accessibility: {
            description: 'cantidad de clientes rechazados por dia'
          },
          title: {
            text: 'Clientes rechazados por dia'
          },
          xAxis: {
            categories: this.XCategories,
          },
          yAxis: {
            title: {
              text: 'Cantidad de clientes'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          tooltip: {
            shape: "square",
            borderRadius: 15,
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            spline: {
              marker: {
                radius: 4,
                lineColor: '#666666',
                lineWidth: 1
              }
            }
          },
          series: [{
            name: 'Clientes',
            marker: {
              symbol: 'square'
            },
            data: this.data
          }]
        };
      }, 0);
    };
    this.chartOptions = {};
  }

}
