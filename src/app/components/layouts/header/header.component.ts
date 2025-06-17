import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public username = ''
  public authRole = '' //role from backend or url
  public name = ''
  public roleDescription = '' //phrase or word describing authRole
  public profilePhotoUrl = '' //url of profile photo
  public email = '' //email
  public profilePhotoPlaceholderUrl = 'assets/img/demo/avatars/avatar-m.png'
  public id_entidad = ''
  public userChangedSubscription: Subscription
  public adminActive: string = 'no';
  public sidebar: string = 'sidebar open';

  constructor(public authService: AuthService, public router: Router) {
    //asignar listener de userChangedSubscription
    this.userChangedSubscription = this.authService.userChanged.subscribe( () => {
      this.getLoggedInUser()
    })
  }

  ngOnInit(): void {
    this.getLoggedInUser()
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser().subscribe(
      user => {
        this.setPropertiesByLoggedInUser(user)
      },
      error => {
        this.setInitialProperties()
        this.authService.getCurrentUserInfoFromBackend().subscribe((user) => {
          this.setPropertiesByLoggedInUser(user)
        }, (err) => {
          console.log(err)
          this.setInitialProperties()
        })
      })
  }

  logout(): void {
    this.authService.logout().subscribe((resp) => {
      localStorage.removeItem('user')
      this.authService.emitUserChangedEvent()
      this.router.navigate(['/login']);
      //console.log('Deslogueo exitoso')
    }, (error) => {
      //todo indicar error al desloguearse al usuario
      //console.log('Intento fallido de deslogueo')
    })
  }

  setInitialProperties() {
    this.username = 'Usuario'
    this.authRole = 'Role'
    this.name = 'Nombre'
    this.roleDescription = 'Descripción'
    this.profilePhotoUrl = this.profilePhotoPlaceholderUrl
    this.email = 'Correo';
    this.id_entidad = ''
  }

  setPropertiesByLoggedInUser(user: any) {
    this.setInitialProperties()
    this.username = user.email
    this.authRole = user.role
    this.name = user.name
    this.email = user.email
    this.id_entidad = user.entidad_id
    switch (this.authRole) { //sets props based on auth role
      case 'admin':
        this.roleDescription = 'Administrador'
        //this.profilePhotoUrl = (user.url_foto) ? user.url_foto : this.profilePhotoPlaceholderUrl
        break;
      case 'entidad':
        this.roleDescription = 'Contratista/Subcontratista'
        break;
    }
  }

}
