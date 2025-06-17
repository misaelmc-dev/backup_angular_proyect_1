import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";
import {of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() userChanged = new EventEmitter();

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getCsrfCookie() {
    const ENDPOINT = `${this.globals.base_path}/sanctum/csrf-cookie`
    return this.http.get(ENDPOINT,{ withCredentials: true, responseType: 'json' });
  }

  login(email: string, password: string) {
    // agregar esto
    const ENDPOINT = `${this.globals.backend_base_url}/login`;
    return this.http.post(ENDPOINT, {email, password}, {responseType: 'json'});
  }

  logout() {
    const ENDPOINT = `${this.globals.backend_base_url}/logout`;
    localStorage.removeItem('user')
    return this.http.post(ENDPOINT, {}, {responseType: 'json'});
  }

  getLoggedInUser () {
    let user = localStorage.getItem('user')
    if (user == null)
      return throwError(user);
    else
      return of(JSON.parse(user))
  }

  getCurrentUserInfoFromBackend() { //todo ver
    const ENDPOINT = `${this.globals.backend_base_url}/user_info`
    return this.http.get<string>(ENDPOINT, {responseType: 'json'})
  }

  emitUserChangedEvent () {
    this.userChanged.emit();
  }

  sendPasswdResetEmail(email: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/forgot-password`
    return this.http.post(ENDPOINT,{email}, {responseType: 'json'})
  }

  resetPassword(email: string, token: string, password: string, passwordConfirm: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/reset-password`
    return this.http.post(ENDPOINT,{email, token, password, password_confirmation: passwordConfirm},
      {responseType: 'json'})
  }
}
