import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Empleado } from "../clases/empleado";

@Injectable({
  providedIn: "root",
})
export class EmpleadoService
{
  public static empleados: Empleado[] = [];

  constructor(public firebase: AngularFireDatabase) { }

  public crear(empleado: Empleado): Promise<any>
  {
    //TODO: eliminar cuando tenga implementado la carga de imagenes
    empleado.foto = "-"
    empleado.isActive = true;

    return this.firebase.database
      .ref("empleados")
      .push()
      .then((snapshot) => (empleado.id = snapshot.key))
      .then(() => this.actualizar(empleado))
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
    return this.firebase.database
      .ref(`empleados/${id}`)
      .once('value');
  }
}
