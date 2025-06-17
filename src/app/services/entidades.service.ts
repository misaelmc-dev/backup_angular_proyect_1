import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {

  constructor(private http: HttpClient,
              private globals: GlobalsVars
  ){}

  getEntitysList = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getEntitysByProyect = (proyect: number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/?no_paginate=&de_proyectos=${proyect}`;
    return this.http.get(ENDPOINT);
  }

  getEntitysByWorker = (worker: number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/?no_paginate=&de_trabajadores=${worker}`;
    return this.http.get(ENDPOINT);
  }

  getEntidadesList = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getWorkersByEntity= (idEntidad: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/trabajadores/?de_entidad=${idEntidad}&no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getEntidadesById = (claveid: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/${claveid}`;
    return this.http.get(ENDPOINT);
  }

  getEntidadesByProyect = (claveid: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/?de_proyectos=${claveid}`;
    return this.http.get(ENDPOINT);
  }

  getEntityByWorker = (worker: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/?no_paginate=&de_trabajadores=${worker}`;
    return this.http.get(ENDPOINT);
  }

  searchEntidad = (criterio: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/?search=${criterio}&no_paginate`;
    console.log("busqueda", ENDPOINT)
    return this.http.get(ENDPOINT);
  }

  addEntidad(name:string,rfc:string,persona_fisica:boolean,correo:string,telefono:string,domicilio:string,pais:string,ciudad:string,webpage:string,cod_biotime:string,codigo_postal:string,registro:string,tipo_patron:string) {
    console.log("name",name,"rfc",rfc,"persona_fisica",persona_fisica,"correo",correo,"telefono",telefono,"domicilio",domicilio,"pais",pais,"ciudad",ciudad,"webpage",webpage,"cod_biotime",cod_biotime,"codigo_postal",codigo_postal,"registro",registro,"tipo_patron",tipo_patron);
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/crear`;
    if(persona_fisica){
      return this.http.post(ENDPOINT, {nombre:name,rfc:rfc,persona_fisica:persona_fisica,correo:correo,telefono:telefono,domicilio:domicilio,pais:pais,ciudad:ciudad,webpage:webpage,cod_biotime:cod_biotime,cod_postal:codigo_postal,registro_patronal:registro,tipo_patron:tipo_patron});
    }else{
      return this.http.post(ENDPOINT, {nombre:name,rfc:rfc,persona_fisica:'false',correo:correo,telefono:telefono,domicilio:domicilio,pais:pais,ciudad:ciudad,webpage:webpage,cod_biotime:cod_biotime,cod_postal:codigo_postal,registro_patronal:registro,tipo_patron:tipo_patron});
    }
  }

  updateEntidad(claveid:number,name:string,rfc:string,persona_fisica:boolean,correo:string,telefono:string,domicilio:string,pais:string,ciudad:string,webpage:string,cod_biotime:string,codigo_postal:string,registro:string,tipo_patron:string) {
    console.log("ID",claveid,"name",name,"rfc",rfc,"persona_fisica",persona_fisica,"correo",correo,"telefono",telefono,"domicilio",domicilio,"pais",pais,"ciudad",ciudad,"webpage",webpage,"cod_biotime",cod_biotime,"codigo_postal",codigo_postal,"registro",registro,"tipo_patron",tipo_patron);
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/${claveid}/actualizar`;
    if(persona_fisica){
      return this.http.post(ENDPOINT, {nombre:name,rfc:rfc,persona_fisica:persona_fisica,correo:correo,telefono:telefono,domicilio:domicilio,pais:pais,ciudad:ciudad,webpage:webpage,cod_biotime:cod_biotime,cod_postal:codigo_postal,registro_patronal:registro,tipo_patron:tipo_patron});
    }else{
      return this.http.post(ENDPOINT, {nombre:name,rfc:rfc,persona_fisica:'false',correo:correo,telefono:telefono,domicilio:domicilio,pais:pais,ciudad:ciudad,webpage:webpage,cod_biotime:cod_biotime,cod_postal:codigo_postal,registro_patronal:registro,tipo_patron:tipo_patron});
    }
  }

  deleteEntidad(claveid: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades/${claveid}/eliminar`;
    return this.http.delete(ENDPOINT);
  }
}
