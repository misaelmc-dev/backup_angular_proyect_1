import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  constructor(private http: HttpClient,
              private globals: GlobalsVars
  ) { }

  getTipoDocumentoList = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_documento/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  searchTipoDocumento = (criterio: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/?search=${criterio}&no_paginate`;
    console.log("busqueda", ENDPOINT)
    return this.http.get(ENDPOINT);
  }

  addTipoDocumento(tipo:string) {
    console.log("tipo:",tipo);
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_documento/crear/`;
    return this.http.post(ENDPOINT, {tipo:tipo});
 }

  updateTipoDocumento(claveid:number, tipo:string) {
    console.log("tipo:",tipo,"clave",claveid);
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_documento/${claveid}/actualizar`;
    return this.http.post(ENDPOINT, {tipo:tipo});
  }

  deleteTipoDocumento(claveid: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_documento/${claveid}/eliminar`;
    return this.http.delete(ENDPOINT);
  }
}
