import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/clases/cliente';
import { Empleado } from 'src/app/clases/empleado';
import { Imagen } from 'src/app/clases/imagen';
import { Jefe } from 'src/app/clases/jefe';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { JefeService } from 'src/app/services/jefe.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.page.html',
  styleUrls: ['./datos-usuario.page.scss'],
})
export class DatosUsuarioPage implements OnInit
{
  usuario: Usuario = AuthService.usuario;
  editar: boolean = false;
  imgPreview: string;
  auxiliarFoto: any;

  constructor(private clienteService: ClienteService,
    private empleadoService: EmpleadoService,
    private jefeService: JefeService,
    public rolService: RolesService,
    private imagenService: ImagenService,
    private UIVisual: UIVisualService) { }

  ngOnInit() 
  {

  }


  async sacarFoto()
  {
    const foto = await this.imagenService.sacarFoto()

    this.imgPreview = `data:image/jpeg;base64,${foto.base64}`

    this.auxiliarFoto = new Imagen();
    this.auxiliarFoto.base64 = foto.base64;
    this.auxiliarFoto.fecha = foto.fecha;
  }

  habilitar()
  {
    this.editar = !this.editar ? true : false;
  }

  async guardar()
  {
    UIVisualService.loading(5000);

    if (this.rolService.isCliente(this.usuario))
    {
      if (this.auxiliarFoto)
      {
        // Se guarda imagen en DB y Storage
        let imagenGuardada = await this.imagenService.crearUnaImagen(
          this.auxiliarFoto,
          '/clientes'
        )
        this.usuario.foto = imagenGuardada;
      }
      this.clienteService.actualizar(this.usuario as Cliente)
        .then(() => UIVisualService.presentToast("Datos actualizados"))
        .catch(e => UIVisualService.presentToast("No se pudieron actualizar los datos."));
    }
    else if (this.rolService.isEmpleado(this.usuario))
    {
      if (this.auxiliarFoto)
      {
        // Se guarda imagen en DB y Storage
        let imagenGuardada = await this.imagenService.crearUnaImagen(
          this.auxiliarFoto,
          '/empleados'
        )
        this.usuario.foto = imagenGuardada;
      }
      this.empleadoService.actualizar(this.usuario as Empleado)
        .then(() => UIVisualService.presentToast("Datos actualizados"))
        .catch(e => UIVisualService.presentToast("No se pudieron actualizar los datos."));
    }
    else if (this.rolService.isJefe(this.usuario))
    {
      if (this.auxiliarFoto)
      {
        // Se guarda imagen en DB y Storage
        let imagenGuardada = await this.imagenService.crearUnaImagen(
          this.auxiliarFoto,
          '/jefes'
        )
        this.usuario.foto = imagenGuardada;
      }
      this.jefeService.actualizar(this.usuario as Jefe)
        .then(() => UIVisualService.presentToast("Datos actualizados"))
        .catch(e => UIVisualService.presentToast("No se pudieron actualizar los datos."));
    }

    this.imgPreview = null;
  }

}
