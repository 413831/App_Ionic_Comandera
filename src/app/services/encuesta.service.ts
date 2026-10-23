import { Injectable } from '@angular/core';
import { Encuesta, TipoEncuesta } from '../clases/encuesta';
import { AngularFireDatabase } from '@angular/fire/database';
import { IDatabase } from '../interfaces/IDatabase';
import { Usuario } from '../clases/usuario';
import { EncuestaSupervisor } from '../clases/encuestaSupervisor';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService implements IDatabase<Encuesta>{
  public static encuestas: Encuesta[];

  constructor(public firebase: AngularFireDatabase) { }

  crear(encuesta: Encuesta): Promise<any>
  {
    console.log(encuesta);
    encuesta.fecha = new Date().toISOString();
    encuesta.id = this.firebase.createPushId();

    return this.firebase.database.ref('encuestas/' + encuesta.id)
      .set(encuesta)
      .catch(console.error);
  }

  actualizar(encuesta: Encuesta): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      resolve(this.firebase.database.ref('encuestas/' + encuesta.id).update(encuesta));
    })
  }

  leer(): Promise<Encuesta[]>
  {
    let encuestas: Encuesta[] = [];
    console.info("Fetch de todas las encuestas");

    const fetch = new Promise<Encuesta[]>(resolve =>
    {
      this.firebase.database.ref('encuestas').on('value', (snapshot) =>
      {
        encuestas = [];
        snapshot.forEach((child) =>
        {
          let data: Encuesta = child.val();
          encuestas.push(new Encuesta(data as Encuesta));
        });
        EncuestaService.encuestas = encuestas;
        resolve(EncuestaService.encuestas);
      }, (error) =>
      {
        console.warn("Aviso Firebase encuestas.leer:", error.message || error);
        if (!EncuestaService.encuestas) { EncuestaService.encuestas = []; }
        resolve(EncuestaService.encuestas);
      });
    });
    return fetch;
  }

  borrar(encuesta: Encuesta): Promise<any>
  {
    return this.firebase.database.ref('encuestas/' + encuesta.id).update(encuesta);
  }

  leerPorId(id: string): Promise<Encuesta>
  {
    return new Promise<Encuesta>(resolve =>
    {
      this.firebase.database.ref(`encuestas/${id}`).once('value').then(snapshot =>
      {
        let data = snapshot.val();
        const encuesta = new Encuesta(data as Encuesta);
        resolve(encuesta);
      }).catch(err =>
      {
        console.warn("Aviso Firebase encuestas.leerPorId:", err.message || err);
        resolve(null);
      });
    })
  }


  public static validarAcceso(idUsuario: string, supervisor?: boolean): boolean
  {
    let horaActual = new Date();

    let encuesta = EncuestaService.encuestas.find(e =>
    {
      if (!supervisor && e.id)
      {
        console.log("A");
        return new Date(e.fecha).getDate() == horaActual.getDate() && e.usuario.id == idUsuario
      }
      else if (supervisor && e.id)
      {
        console.log("B");
        return (<EncuestaSupervisor>e).idUsuario == idUsuario && e.tipo == TipoEncuesta.SUPERVISOR;
      }
      return false;
    });

    if (encuesta)
    {
      console.log("Existente");
      return false;
    }
    return true;
  }

}
