
import { Component, Input, OnInit } from '@angular/core'
import { Empleado } from "src/app/clases/empleado";
import { EmpleadoService } from "src/app/services/empleado.service";
import { AuthService } from "src/app/services/auth.service";
import { UIVisualService } from "src/app/services/uivisual.service"
import { Imagen } from 'src/app/clases/imagen';
import { ImagenService } from 'src/app/services/imagen.service';

enum OpcionForm
{
  ALTA = "Alta",
  MODIFICACION = "Modificación",
  BAJA = "Baja",
}

@Component({
  selector: "app-form-empleados",
  templateUrl: "./form-empleados.component.html",
  styleUrls: ["./form-empleados.component.scss"],
})
export class FormEmpleadosComponent implements OnInit
{
  @Input() opcion: OpcionForm;
  @Input() empleado: Empleado;

  auxiliarFoto: Imagen
  imgPreview: string

  popoverOptions = {
    header: "Seleccione el tipo",
    okText: "Guardar",
  };

  constructor(private empleadoService: EmpleadoService, private authService: AuthService, private UIVisual: UIVisualService,
    private imagenService: ImagenService) { }

  ngOnInit(): void
  {
    if (this.opcion == "Alta")
    {
      this.empleado = new Empleado()
    }
  }

  async sacarFoto()
  {
    const foto = await this.imagenService.sacarFoto()

    this.imgPreview = `data:image/jpeg;base64,${foto.base64}`

    this.auxiliarFoto = new Imagen();
    this.auxiliarFoto.base64 = foto.base64;
    this.auxiliarFoto.fecha = foto.fecha;
  }

  /**
   * Alta de empleado
   */
  async altaEmpleado()
  {
    if (this.empleado && !this.empleado.id)
    {
      // Se guarda imagen en DB y Storage
      const imagenGuardada = await this.imagenService.crearUnaImagen(
        this.auxiliarFoto,
        '/empleado'
      )
      this.empleado.foto = imagenGuardada;

      this.authService
        .onRegisterEmpleado(this.empleado)
        .then(() => UIVisualService.presentToast('Alta exitosa'))
        .catch(() => UIVisualService.presentToast('No se pudo realizar el alta'))
    }
    else
    {
      UIVisualService.presentToast('Empleado existente')
    }
  }

  /**
   *  Modificacion de empleado
   */
  async modificarEmpleado()
  {
    console.log('Modificar Empleado')

    if (this.empleado)
    {
      // Se actualiza Mesa en DB
      this.empleadoService
        .actualizar(this.empleado)
        .then(() => UIVisualService.presentToast('Modificación exitosa'))
        .catch(() => UIVisualService.presentToast('No se pudo modificar'))
    }
  }

  /**
   * Baja lógica de empleado
   */
  borrarEmpleado()
  {
    console.log("Baja empleado");

    if (this.empleado)
    {
      this.empleadoService
        .borradoLogico(this.empleado)
        .then(() => UIVisualService.presentToast('Baja realizada'))
        .catch(() => UIVisualService.presentToast('No se pudo realizar baja'))
    }
  }
}
