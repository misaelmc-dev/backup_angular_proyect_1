import { Injectable } from '@angular/core';
import {Proyecto} from "../interfaces/proyecto";
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProyectoService {

  constructor(private http: HttpClient,
              private globals: GlobalsVars
  ){}

  getProyectsList = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getProyectsByEntity = (entity: number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/?no_paginate=&de_entidades_ejecutoras=${entity}`;
    return this.http.get(ENDPOINT);
  };

  getProyectsByWorker = (worker: number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/?no_paginate=&de_trabajadores=${worker}`;
    return this.http.get(ENDPOINT);
  };

  findProyectosByPage(
    pageNumber: number
  ): Observable<Proyecto[]> {
    let params = new HttpParams();
    params = params.append('page_size', String(pageNumber));
    return this.http
      .get(
        `${this.globals.backend_base_url}/proyectos`,
        {
          params,
        }
      )
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  getProyectList = (soloDeEntidadId?: number) => {
    let endpoint = `${this.globals.backend_base_url}/proyectos?no_paginate`;
    if (soloDeEntidadId)
      endpoint += `&de_entidades_ejecutoras=${soloDeEntidadId}`
    return this.http.get(endpoint);
  }

  getProductoById = (id: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/${id}`;
    return this.http.get(ENDPOINT);
  };

  getProyectoById = (id: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/${id}/`;
    return this.http.get(ENDPOINT);
  };

  getWorkersByProyect = (id: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/trabajadores/?de_proyecto=${id}&no_paginate=`;
    return this.http.get(ENDPOINT);
  };

  getProyectoByEntity = (entity: number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos?de_entidades_ejecutoras=${entity}&no_paginate`;
    return this.http.get(ENDPOINT);
  };

  getProyectoByEntityId = (entityId: number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/?de_entidades_ejecutoras=${entityId}`;
    return this.http.get(ENDPOINT);
  };

  getProyectoByWorker = (worker: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos?${worker}`;
    return this.http.get(ENDPOINT);
  };

  getProyectosTipos = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/?no_paginate=`;
    return this.http.get(ENDPOINT);
  };

  searchProyecto = (criterio: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/?search=${criterio}&no_paginate`;
    return this.http.get(ENDPOINT);
  }

  addProyecto(name:string,registro:string,superficie:string,propietario:string,monto:string,FI:string,FF:string,ubicacion:string,codigo:string,tipo:string) {
    console.log("name",name,"registro",registro,"superficie",superficie,"propietario",propietario,"monto",monto,"Fecha ini",FI,"Fecha fin",FF,"ubicacion",ubicacion,"proycodigo",codigo,"tipo",tipo);
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/crear`;
    return this.http.post(ENDPOINT, {nombre:name,registro_obra:registro,superficie:superficie,reg_obra_num_aviso_ubic_obra:propietario,tipo:tipo,monto:monto,fecha_inicio:FI,fecha_fin:FF,ubicacion:ubicacion,cod_biotime:codigo});
  }

  updateProyecto(claveid:number,name:string,registro:string,superficie:string,propietario:string,monto:string,FI:string,FF:string,ubicacion:string,codigo:string,tipo:string) {
    console.log("name",name,"registro",registro,"superficie",superficie,"propietario",propietario,"monto",monto,"Fecha ini",FI,"Fecha fin",FF,"ubicacion",ubicacion,"proycodigo",codigo,"tipo",tipo);
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/${claveid}/actualizar`;
    return this.http.post(ENDPOINT, {nombre:name,registro_obra:registro,superficie:superficie,reg_obra_num_aviso_ubic_obra:propietario,monto:monto,fecha_inicio:FI,fecha_fin:FF,ubicacion:ubicacion,cod_biotime:codigo,tipo:tipo});
  }

  deleteProyecto(claveid: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/proyectos/${claveid}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

  addProyectoToEntity(entidadid:number,proyectoid: any) {
    const ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadid}/ejecutante/proyecto/${proyectoid}/asignar`;
    return this.http.post(ENDPOINT, {entidad_contratante_id: entidadid});
  }

  deleteProyectoToEntity(entidadid:number,proyectoid: any) {
    const ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadid}/ejecutante/proyecto/${proyectoid}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

}
