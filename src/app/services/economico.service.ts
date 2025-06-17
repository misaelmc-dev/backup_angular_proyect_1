import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class EconomicoService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getReporteEconomicoCriteria = (criteria: string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/economicos/trabajadores?${criteria}`;
    //let ENDPOINT = 'https://gss-backend.habilisoluciones.com/api/economicos/trabajadores?fecha_desde=2021-01-01&fecha_hasta=2021-09-31&entidades=4&proyectos=2';
    console.log(ENDPOINT);
    return this.http.get(ENDPOINT);
  }

  getVariablesDeCalculo = () => {
    let ENDPOINT = `${this.globals.backend_base_url}/vars_calculo?no_paginate`;
    return this.http.get(ENDPOINT);
  }

  getReportEconomic = (consulta: string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/economicos/trabajadores?${consulta}`;
    return this.http.get(ENDPOINT);
  }

  updateCuotasIMSS = (id:number,valor:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/vars_calculo/${id}/actualizar`;
    return this.http.post(ENDPOINT,{valor:valor});
  }

}
