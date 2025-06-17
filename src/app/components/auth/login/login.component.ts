import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  private intendedUrl: string = '/'
  public validCredentials = true;
  public serverErrors = false;
  // @ts-ignore
  public loginForm: FormGroup

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.intendedUrl = params.intendedUrl || null
    })
    //this.intendedUrl = null;
  }

  ngOnInit(): void {
    let loginFormBuilder = new FormBuilder();
    this.loginForm = loginFormBuilder.group({
      email: new FormControl(''),
      password: new FormControl(''),
    }); //todo validar que el campo email sea un correo válido, y que la contraseña tenga mínimo 8 dígitos
  }

  login = (formData: any) => {
    let { email, password } = formData;
    //console.log('email '+ email)
    //console.log('password ' + password)

    this.authService.login(email, password).subscribe((response: any) =>
      { //success
        this.validCredentials = true;
        this.serverErrors = false;
        localStorage.setItem('logueado', 'true');
        localStorage.setItem('user', JSON.stringify(response))
        this.authService.emitUserChangedEvent()
        let route = '/';
        switch (response.role) {
          case 'admin':
            route = '/' //todo poner aquí la ruta de dash de admin
            break;
          case 'entidad':
            route = `/rolentidad/${response.entidad_id}/inicio` // todo poner aquí la ruta de dash de coord
            break;
        }
        route = (this.intendedUrl) ? this.intendedUrl : route;
        //console.log(this.route.snapshot.paramMap)
        this.router.navigate([route])
      }, //fail
      (err: any) => {
        if (err.status === 422) {
          alert('Credenciales incorrectas')
          //en caso de código de error status 422 indicar al usuario que credenciales incorrectas
          this.validCredentials = false;
        } else {
          alert('Error en el server, intente otra vez')
          //otro caso indicar error desconocido, contacte a su administrador
          this.serverErrors = true
        }
      });


  }
}
