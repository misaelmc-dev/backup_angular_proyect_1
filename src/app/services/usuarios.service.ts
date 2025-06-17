import { Injectable } from '@angular/core';
import {Proyecto} from "../interfaces/proyecto";
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getUsersList = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/users`;
    return this.http.get(ENDPOINT);
  }

  addUser(name:string,email:string,role:string,entidadId:string,password:string,confirmacion:string) {
    //console.log("name",name,"email",email,"role",role,"entidad",entidadId,"password",password,"Confirmacion",confirmacion);
    const ENDPOINT = `${this.globals.backend_base_url}/register`;
    return this.http.post(ENDPOINT, {name:name,email:email,role:role,entidad:entidadId,password:password,password_confirmation:confirmacion});
  }

  deleteUser(claveid: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/users/${claveid}/delete`;
    return this.http.delete(ENDPOINT);
  }

}
