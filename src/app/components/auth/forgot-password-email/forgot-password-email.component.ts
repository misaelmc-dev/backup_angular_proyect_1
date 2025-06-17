import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-forgot-password-email',
  templateUrl: './forgot-password-email.component.html',
  styleUrls: ['./forgot-password-email.component.css']
})
export class ForgotPasswordEmailComponent implements OnInit {

  public forgotPasswdForm: FormGroup
  public accountExists: boolean
  public serverError: boolean
  public emailSent: boolean

  constructor(public authService: AuthService) {
    this.accountExists = true
    this.serverError = false
    this.emailSent = false

    //se inicializa form
    let forgotPasswdFormBuilder = new FormBuilder();
    this.forgotPasswdForm = forgotPasswdFormBuilder.group({
      email: new FormControl('', [
        Validators.email
      ])
    }); //todo validar que el campo email sea un correo válido, y que la contraseña tenga mínimo 8 dígitos
    //termina init de form
  }

  ngOnInit(): void {

  }

  get email() { return this.forgotPasswdForm.get('email'); }

  forgotPassword() {
    if (this.forgotPasswdForm.valid && this.email) {
      this.authService.sendPasswdResetEmail(this.email.value).subscribe(
        resp => {
          this.accountExists = true
          this.serverError = false
          this.emailSent = true
        },
        error => {
          if (error.status === 422) {
            this.accountExists = false
            this.serverError = false
          } else {
            this.accountExists = true
            this.serverError = true
          }
        })
    } else {
      console.log('No se manda correo, errores en el formulario')
    }
  }

}
