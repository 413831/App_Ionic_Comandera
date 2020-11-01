import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Cliente } from '../clases/cliente';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  public isLogged: boolean = false
  constructor(public afAuth: AngularFireAuth, private clienteService: ClienteService)
  {
    //afAuth.authState.subscribe(user => this.isLogged = user);
  }

  //TODO: fix to accept other type of users
  async onLogin(cliente: Cliente)
  {
    try
    {
      const credential = await this.afAuth.signInWithEmailAndPassword(cliente.email, cliente.password);
      this.isLogged = true;
      return credential;
    } catch (error)
    {
      console.log('Login failed', error);
    }
  }

  onRegister(cliente: Cliente)
  {
    return new Promise<any>((resolve, reject) =>
    {
      this.afAuth.createUserWithEmailAndPassword(cliente.email, cliente.password)
        .then(response =>
        {
          cliente.password = null;
          this.clienteService.crear(cliente, response.user.uid);
          resolve(response);
        },
          error => reject(error));
    });
  }

  onLogout()
  {
    try
    {
      this.afAuth.signOut();
      this.isLogged = false;
    } catch (error)
    {
      console.log('Logout failed', error);
    }
  }
}