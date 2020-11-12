import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Empleado } from "../clases/empleado";
import { Imagen } from '../clases/imagen';

@Injectable({
  providedIn: "root",
})
export class EmpleadoService
{
  public static empleados: Empleado[] = [];

  constructor(public firebase: AngularFireDatabase) { }

  public crear(empleado: Empleado, uid: string): Promise<any>
  {
    empleado.id = uid;
    empleado.isActive = true;
    console.log(empleado)

    return this.firebase.database
      .ref("empleados/" + empleado.id)
      .set(empleado)
      .catch(console.error);
  }

  public actualizar(empleado: Empleado): Promise<any>
  {
    return this.firebase.database
      .ref("empleados/" + empleado.id)
      .update(empleado);
  }

  public borradoLogico(empleado: Empleado): Promise<any>
  {
    empleado.isActive = false;

    return this.actualizar(empleado);
  }

  public leer()
  {
    let empleados: Empleado[] = [];
    console.info("Fetch de todos los empleados");

    return new Promise<Empleado[]>((resolve) =>
    {
      this.firebase.database.ref("empleados").on("value", (snapshot) =>
      {
        empleados = [];

        snapshot.forEach((child) =>
        {
          var data: Empleado = child.val();
          empleados.push(
            Empleado.CrearEmpleado(
              data.id,
              data.nombre,
              data.apellido,
              data.dni,
              data.foto,
              data.email,
              data.isActive,
              data.tipo,
              data.cuil
            )
          );
        });

        EmpleadoService.empleados = empleados.filter(e => e.isActive);

        resolve(EmpleadoService.empleados);
      });
    });
  }

  public leerPorID(id: string)
  {
    return new Promise<Empleado>(resolve =>
    {
      this.firebase.database.ref(`empleados/${id}`).once('value').then(snapshot =>
      {
        if (snapshot.val() === null || snapshot.val() === undefined)
        {
          console.log("Empleado not found")
          resolve(null)
        }
        else 
        {
          let data: Empleado = snapshot.val();
          const empleado = Empleado.CrearEmpleado(data.id, data.nombre, data.apellido, data.dni,
            data.foto, data.email, data.isActive, data.tipo, data.cuil);
          resolve(empleado);
        }
      });
    })
  }
}