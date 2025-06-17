import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getAsistenciaCriteria(criteria: string){
    let ENDPOINT = `${this.globals.backend_base_url}/asistencia?${criteria}`;
    //console.log("ENDPOINT",ENDPOINT);
    return this.http.get(ENDPOINT);
  }

  getWorkers(soloDeEntidadId?: number){
    let endpoint = `${this.globals.backend_base_url}/trabajadores?no_paginate`;
    if (soloDeEntidadId)
      endpoint += `&de_entidad=${soloDeEntidadId}`
    return this.http.get(endpoint);
  }
}
