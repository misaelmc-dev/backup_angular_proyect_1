import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class ProyectoTipoService {

  constructor(private http: HttpClient,
              private globals: GlobalsVars
  ) { }
  getProyectoTipoList = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  searchProyectoTipo = (criterio: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/?search=${criterio}&no_paginate`;
    console.log("busqueda", ENDPOINT)
    return this.http.get(ENDPOINT);
  }

  addProyectoTipo(tipo:string, porciento:number, costo:number, privada:boolean) {
    console.log("tipo:",tipo,"porciento:",porciento,"costo:",costo,"privada:",privada);
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/crear/`;
    if(privada){
      return this.http.post(ENDPOINT, {tipo:tipo, porciento_mano_obra:porciento, costo_m2:costo, privada:privada});
    }else{
      return this.http.post(ENDPOINT, {tipo:tipo, porciento_mano_obra:porciento, costo_m2:costo, privada:'false'});
    }
  }

  updateProyectoTipo(claveid:number, tipo:string, porciento:number, costo:number, privada:boolean) {
    console.log("tipo:",tipo,"porciento:",porciento,"costo:",costo,"privada:",privada);
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/${claveid}/actualizar`;
    if(privada){
      return this.http.post(ENDPOINT, {tipo:tipo, porciento_mano_obra:porciento, costo_m2:costo, privada:privada});
    }else{
      return this.http.post(ENDPOINT, {tipo:tipo, porciento_mano_obra:porciento, costo_m2:costo, privada:'false'});
    }
  }

  deleteProyectoTipo(claveid: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/${claveid}/eliminar`;
    return this.http.delete(ENDPOINT);
  }
}
