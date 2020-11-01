import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../clases/reserva';
import { ToastController } from '@ionic/angular';
import { MesaService } from '../../services/mesa.service';
import { Mesa } from '../../clases/mesa';
import { Cliente } from 'src/app/clases/cliente';
import { dateFormat } from 'highcharts';
enum OpcionForm
{
  ALTA = "Alta",
  MODIFICACION = "Modificación",
  BAJA = "Baja",
}
@Component({
  selector: 'app-form-reserva',
  templateUrl: './form-reserva.component.html',
  styleUrls: ['./form-reserva.component.scss'],
})
export class FormReservaComponent
{

  @Input() opcion: OpcionForm;
  @Input() reserva: Reserva;

  reservaForm: FormGroup;
  todasLasMesas: Array<Mesa>;
  mesas: Array<Mesa>;
  reservas: Array<Reserva>;
  cliente: Cliente;
  fechaActual: string;/*  = new Date().toISOString(); */

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private toastController: ToastController,
    private mesasService: MesaService
  )
  {
    this.fechaActual = this.getIsoLocalTime();
    /* this.cliente =   TRAER CLIENTE ACTUAL*/
    this.cliente = Cliente.CrearCliente('01', 'carlitos', 'gonzales', '123456789', 'none', 'example@gmail.com', true, true);
    this.crearForm();
    this.leerReservas();
    this.leerMesas();
  }


  ngOnChanges()
  {
    this.rellenarFormulario();
  }

  rellenarFormulario()
  {
    try
    {
      if (this.reserva && this.opcion != OpcionForm.ALTA)
      {
        this.reservaForm.setValue({
          cliente: this.cliente,
          mesa: this.reserva.mesa,
          date: this.reserva.stringISO,
        });
      } else
      {
        this.reservaForm.reset();
      }

      if (this.opcion == OpcionForm.BAJA)
      {
        this.reservaForm.disable();
      } else
      {
        this.reservaForm.enable();
      }
    } catch (error)
    {
      console.error(error);
    }
  }

  crearForm()
  {
    this.reservaForm = this.fb.group({
      cliente: new FormControl({ value: this.cliente }, Validators.required),
      date: new FormControl(Date, Validators.required),
      mesa: new FormControl({ value: Mesa }, Validators.required),
    });
  }

  crear()
  {
    this.asignarCliente(this.cliente).then(() =>
    {
      let date = this.getDateObject();
      let hora = date.getHours().toString() + ':' + date.getMinutes().toString();
      let fecha = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      let timeStamp = this.toTimeStamp(date);
      console.log(this.toTimeStamp(date));
      console.log(this.toDate(timeStamp));
      console.log(fecha, hora);

      let reserva = Reserva.CrearReserva(
        this.reservaForm.controls['mesa'].value,
        this.reservaForm.controls['cliente'].value,
        fecha,
        hora,
        timeStamp,
        ''
      )
      this.reservaService.crear(reserva).then(() => { this.presentToast('Reserva exitosa.', 2000) });
    });
  }
  //a pesar de que el usuario no puede elegir los segundos el stringISO que devuelve ion-datetime siempre es distinto
  //entonces creo un nuevo date pasando los segundos y milisigundos como 0.
  getDateObject()
  {
    let stringISO = this.reservaForm.controls['date'].value;
    let timeStamp = Date.parse(stringISO);
    let año = Number.parseInt(dateFormat('%Y', timeStamp));
    let mes = Number.parseInt(dateFormat('%m', timeStamp));
    let dia = Number.parseInt(dateFormat('%e', timeStamp));
    let horas = Number.parseInt(dateFormat('%k', timeStamp));
    let minutos = Number.parseInt(dateFormat('%M', timeStamp));

    console.log(año, mes, dia, horas, minutos);
    let newDate = new Date(año, mes - 1, dia, horas, minutos, 0, 0);
    return newDate;
  }
  /**
   * convierte un objeto Date a timeStamp
   * @param date 
   */
  toTimeStamp(date: Date)
  {
    return date.getTime() / 1000;
  }
  toDate(timeStamp)
  {
    let date = new Date(timeStamp * 1000);
    return date;
  }

  leerMesasDisponibles()
  {
    let date = this.getDateObject();
    let timeStamp = this.toTimeStamp(date);
    let reservasFechaElegida = this.filtrarReservas(timeStamp);

    this.mesas = this.mesas.filter(mesa =>
    {
      console.log(reservasFechaElegida);
      if (reservasFechaElegida.length >= 1)
      {
        reservasFechaElegida.forEach(reserva =>
        {
          /* console.log(mesa);
          console.log(reserva.mesa); */
          if (reserva.mesa.id == mesa.id)
          {
            console.log('Mesa', mesa);
            console.log('Reserva', reserva.mesa);
            return mesa;
          }
        })
      }
      else
      {
        return mesa;
      }

    })
  }

  /**
   * Filtra las reservas que hay para el dia elegido y la hora elegida +- 10 minutos.
   * (podrian ser 40, o el tiempo estipulado para que una persona coma)
   * Luego ya se puede reservar otra vez
   * @param timeStamp El timeStamp de la reserva que se quiere hacer.
   */
  filtrarReservas(timeStamp)
  {
    let tiempoPromedioDeOcupacionDeMesa = this.sumarMinutos(timeStamp, 10);
    let tiempoPromedioDeOcupacionDeMesaNegativo = this.restarMinutos(timeStamp, 10);//para no tomen esa mesa antes del tiempo estipulado para que una persona coma
    console.log('tiempoPromedioDeOcupacionDeMesa', this.obtenerHora(tiempoPromedioDeOcupacionDeMesa));
    console.log('tiempoPromedioDeOcupacionDeMesaNegativo', this.obtenerHora(tiempoPromedioDeOcupacionDeMesaNegativo));
    let reservasFechaElegida = this.reservas.filter(reserva =>
    {
      /*       console.log(timeStamp);
            console.log(reserva.timeStamp); */
      if (timeStamp == reserva.timeStamp)/* >= tiempoDeReserva && timeStamp <= tiempoPromedioDeOcupacionDeMesa */
      {
        return reserva;
      }
    })
    console.log(reservasFechaElegida);
    return reservasFechaElegida;
  }

  leerReservas()
  {
    this.reservaService.leer().then(reservas =>
    {
      this.reservas = reservas;
    })
  }
  leerMesas()
  {
    this.mesasService.leer().then(mesas => { this.mesas = mesas; console.log('Mesas', this.mesas) });
  }

  obtenerFecha(timeStamp)
  {
    let fecha = dateFormat('%d-%m-%Y', timeStamp);
    /* console.log('fecha', fecha); */
    return fecha;
  }
  obtenerHora(timeStamp)
  {
    let hora = dateFormat('%k:%M', timeStamp);
    /* console.log('hora', hora); */
    return hora;
  }

  modificarReserva()
  {
    console.log("Modificando Reserva-------");
    let stringISO = this.reservaForm.controls['date'].value;
    let timeStamp = Date.parse(stringISO);
    let fecha = this.obtenerFecha(timeStamp);
    let hora = this.obtenerHora(timeStamp);
    this.reserva.mesa = this.reservaForm.get("mesa").value;
    this.reserva.fecha = fecha;
    this.reserva.hora = hora;
    this.reserva.timeStamp = timeStamp;
    this.reserva.stringISO = stringISO;
    this.reservaService
      .actualizar(this.reserva)
      .then(() =>
      {
        this.presentToast("Modificación exitosa", 2000);
        console.log("Modificado correctamente.");
      })
      .catch(() => this.presentToast("No se pudo modificar", 2000));
  }

  borrarReserva()
  {
    console.log("Baja de reserva------");
    if (this.reserva)
    {
      this.reserva.isActive = false;
      this.reservaService
        .actualizar(this.reserva)
        .then(() =>
        {
          this.presentToast("Baja realizada", 2000);
          this.reservaForm.reset();
        })
        .catch(() => this.presentToast("No se pudo realizar baja", 2000));
    }
  }

  /**Funcion para agregar minutos a un timeStamp
 * @param timeStamp TimeStamp
 * @param minutosAAgregar Minutos a agregar
 * @returns TimeStamp con los minutos agregados
 */
  sumarMinutos(timeStamp, minutosASumar): number
  {
    let nuevoHorario = timeStamp + (minutosASumar * 60000);
    return nuevoHorario;
  }
  restarMinutos(timeStamp, minutosARestar): number
  {
    let nuevoHorario = timeStamp - (minutosARestar * 60000);
    return nuevoHorario;
  }

  async asignarCliente(cliente: Cliente)
  {
    try
    {
      return new Promise((resolve) =>
      {
        this.reservaForm.controls['cliente'].setValue(cliente);
        if (this.reservaForm.controls['cliente'].value)
        {
          resolve();
        }

      })

    } catch (error)
    {
      this.presentToast('Solo un usuario registrado puede hacer una reserva.', 2000);
      console.error('No se pudo asignar cliente', error);
    }
  }

  getIsoLocalTime()
  {
    let isoLocalTime = new Date().getFullYear().toString() + '-';
    if ((new Date().getMonth() + 1) < 10)
    {
      isoLocalTime += '0' + (new Date().getMonth() + 1) + '-';
    } else
    {
      isoLocalTime += (new Date().getMonth() + 1) + '-';
    }
    if (new Date().getDate() < 10)
    {
      isoLocalTime += '0' + (new Date().getDate()) + 'T';
    }
    else
    {
      isoLocalTime += new Date().getDate() + 'T';
    }
    isoLocalTime += new Date().toLocaleTimeString();
    console.log('Mi ISOtimeString', isoLocalTime);
    return isoLocalTime;
  }

  async presentToast(message, duration)
  {
    const toast = await this.toastController.create({
      message,
      duration,
    });
    toast.present();
  }

}
