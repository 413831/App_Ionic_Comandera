import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Cliente } from '../../clases/cliente';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit
{
  cliente: Cliente = new Cliente

  // constructor(private authService: AuthService, private router: Router) { }
  constructor(private authService: AuthService) { }

  ngOnInit()
  {
  }

  async onRegister()
  {
    const user = await this.authService.onRegister(this.cliente);

    if (user)
    {
      console.log('Cliente creado!!!');
      // this.router.navigateByUrl('/');
    }
  }

}
