import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Imagen } from '../clases/imagen';
import { Jefe } from "../clases/jefe";

@Injectable({
  providedIn: "root",
})
export class JefeService
{
  public static jefes: Jefe[] = [];

  constructor(public firebase: AngularFireDatabase) { }

  public crear(jefe: Jefe, uid: string): Promise<any>
  {
    jefe.id = uid;
    jefe.isActive = true;
    console.log(jefe)

    return this.firebase.database
      .ref("jefes/" + jefe.id)
      .set(jefe)
      .catch(console.error);
  }

  public actualizar(jefe: Jefe): Promise<any>
  {
    return this.firebase.database
      .ref("jefes/" + jefe.id)
      .update(jefe);
  }

  public borradoLogico(jefe: Jefe): Promise<any>
  {
    jefe.isActive = false;

    return this.actualizar(jefe);
  }

  public leer()
  {
    let jefes: Jefe[] = [];
    console.info("Fetch de todos los jefes");

    return new Promise<Jefe[]>((resolve) =>
    {
      this.firebase.database.ref("jefes").on("value", (snapshot) =>
      {
        jefes = [];

        snapshot.forEach((child) =>
        {
          var data: Jefe = child.val();
          jefes.push(
            Jefe.CrearJefe(
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

        JefeService.jefes = jefes.filter(e => e.isActive);

        resolve(JefeService.jefes);
      });
    });
  }

  public leerPorID(id: string)
  {
    return new Promise<Jefe>(resolve =>
    {
      this.firebase.database.ref(`jefes/${id}`).once('value').then(snapshot =>
      {
        if (snapshot.val() === null || snapshot.val() === undefined)
        {
          console.log("Jefe not found")
          resolve(null)
        }
        else 
        {
          let data: Jefe = snapshot.val();
          const jefe = Jefe.CrearJefe(data.id, data.nombre, data.apellido, data.dni,
            data.foto, data.email, data.isActive, data.tipo, data.cuil);
          resolve(jefe);
        }
      });
    })
  }


}
