import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {

  constructor(private http: HttpClient,
              private globals: GlobalsVars
             ) { }

  getCategoriasList = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/categorias/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  searchCategorias = (criterio: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/categorias/?search=${criterio}&no_paginate`;
    console.log("busqueda", ENDPOINT)
    return this.http.get(ENDPOINT);
  }

  addCategoria(name: string, code: string) {
    console.log("name", name ,"code", code);
    const ENDPOINT = `${this.globals.backend_base_url}/categorias/crear/`;
    return this.http.post(ENDPOINT, {nombre:name, cod_biotime:code});
  }

  updateCategoria(claveid:number, name: string, code: string) {
    console.log("name", name ,"code", code);
    const ENDPOINT = `${this.globals.backend_base_url}/categorias/${claveid}/actualizar`;
    return this.http.post(ENDPOINT, {nombre:name, cod_biotime:code});
  }

  deleteCategoria(claveid: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/categorias/${claveid}/eliminar`;
    return this.http.delete(ENDPOINT);
  }
}
