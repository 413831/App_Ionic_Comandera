import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Cliente } from '../../clases/cliente';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit
{
  //TODO: fix to accept other type of users
  cliente: Cliente = new Cliente

  // constructor(private authService: AuthService, private router: Router) { }
  constructor(private authService: AuthService) { }

  ngOnInit()
  {
  }

  async onLogin()
  {
    const cliente = await this.authService.onLogin(this.cliente);

    if (cliente)
    {
      console.log('Cliente logueado!');
      // this.router.navigateByUrl('/home');
    }
  }
}