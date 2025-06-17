import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(private http: HttpClient,
              private globals: GlobalsVars
  ) { }

  getPagosList = (consulta:string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/pagos/?no_paginate=${consulta}`;
    return this.http.get(ENDPOINT);
  }

  addPago = (monto:number,cubre_mes:string,entidad:number,proyecto:number,cuota_pagable:number,trabajador:number) => {
    console.log("monto",monto,"cubre_mes",cubre_mes,"entidad",entidad,"proyecto",proyecto,"cuota_pagable",cuota_pagable,"trabajador",trabajador);
    let ENDPOINT = `${this.globals.backend_base_url}/pagos/realizar`;
    return this.http.post(ENDPOINT, {monto:monto,cubre_mes:cubre_mes,entidad:entidad,proyecto:proyecto,cuota_pagable:cuota_pagable,trabajador:trabajador});
  }

  deletePay = (pagoId: number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/pagos/${pagoId}/eliminar`;
    return this.http.delete(ENDPOINT);
  }


}
