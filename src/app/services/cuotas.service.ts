import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CuotasService {

  constructor(private http: HttpClient,
              private globals: GlobalsVars
  ) { }

  getCuotasPagablesList = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/cuotas_pagables/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getTipoCuotalist = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_cuotas_pagables/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  updateCuotasPagables(claveid:number,name:string,tipo_cuota_id:string,valor:string,es_porcent:boolean) {
    //console.log("claveid",claveid,"name",name,"tipo_cuota_id",tipo_cuota_id,"valor",valor,"es_porcent",es_porcent);
    const ENDPOINT = `${this.globals.backend_base_url}/cuotas_pagables/${claveid}/actualizar`;
    return this.http.post(ENDPOINT, {nombre:name,valor:valor});
  }

}
