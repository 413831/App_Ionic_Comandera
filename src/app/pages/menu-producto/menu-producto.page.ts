import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { TipoEmpleado } from 'src/app/clases/empleado';
import { Producto } from 'src/app/clases/producto';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';
import { RolesService } from 'src/app/services/roles.service';
import { UIVisualService } from 'src/app/services/uivisual.service';

@Component({
  selector: 'app-menu-producto',
  templateUrl: './menu-producto.page.html',
  styleUrls: ['./menu-producto.page.scss'],
})
export class MenuProductoPage implements OnInit, DoCheck
{
  usuario: Usuario;
  opcion: string;
  platos: Producto[];
  bebidas: Producto[];
  productoElegido: Producto = new Producto();

  constructor(
    private platform: Platform,
    private productoService: ProductoService,
    public rolService: RolesService,
    private UIVisual: UIVisualService,
    private router: Router) 
  {
    this.platform.backButton.subscribeWithPriority(10, () =>
    {
      this.router.navigate(["/home/inicio"]);
    });
  }

  ngDoCheck(): void
  {
    this.platos = ProductoService.productos.filter(producto => producto.tipo == TipoEmpleado.Cocinero);
    this.bebidas = ProductoService.productos.filter(producto => producto.tipo == TipoEmpleado.Bartender);
  }

  ngOnInit()
  {
    UIVisualService.loading();
    // No es necesario inyectar el servicio por ser propiedad estática
    this.usuario = AuthService.usuario;
    this.opcion = this.rolService.isEmpleadoBartender(this.usuario) ? "Bebidas" : "Platos";
    console.log("INIT");
    this.productoService.traerTodos().then(data =>
    {
      console.log(data);
      this.platos = data.filter(producto => producto.tipo == TipoEmpleado.Cocinero);
      this.bebidas = data.filter(producto => producto.tipo == TipoEmpleado.Bartender);
    });
  }

  seleccionarOpcion(event)
  {
    console.log(event.detail.value);
    this.opcion = event.detail.value;
  }

  elegirProducto(event)
  {
    console.log(event);
    this.productoElegido = event;
  }

  inicializarOpcion()
  {
    if (this.rolService.isEmpleadoBartender(this.usuario))
    {
      return "Bebidas";
    }
    return "Platos";
  }

}
