import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  constructor(private http: HttpClient,
              private globals: GlobalsVars
  ){}

  getWorkersList = (soloDeEntidadId?: number) => {
    let endpoint = `${this.globals.backend_base_url}/trabajadores/?no_paginate=`;
    if (soloDeEntidadId)
      endpoint += `&de_entidad=${soloDeEntidadId}`
    return this.http.get(endpoint);
  }

  getWorkerById = (trabajadorId:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/trabajadores/${trabajadorId}`;
    return this.http.get(ENDPOINT);
  }

  getWorkersByEntity = (entity: number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/trabajadores/?de_entidad=${entity}&no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getWorkersByProyect = (proyect: any, soloDeEntidadId?: number) => {
    let endpoint = `${this.globals.backend_base_url}/trabajadores/?de_proyecto=${proyect}&no_paginate=`;
    if (soloDeEntidadId)
      endpoint += `&de_entidad=${soloDeEntidadId}`
    return this.http.get(endpoint);
  }

  getWorkers = (criteria: string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/trabajadores?${criteria}`;
    return this.http.get(ENDPOINT);
  }

  getWorkersUpDown = (consulta: string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/altasbajas?${consulta}`;
    return this.http.get(ENDPOINT);
  }

  addWorker = (nombre:string,apellidos:string,rfc:string,curp:string,nss:string,correo:string,telefono:number,domicilio:string,genero:string,fecha_nacimiento:string,nombre_persona_contacto:string,telefono_persona_contacto:string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/trabajadores/crear`;
    return this.http.post(ENDPOINT,{nombre:nombre,apellidos:apellidos,rfc:rfc,curp:curp,nss:nss,correo:correo,telefono:telefono,domicilio:domicilio,genero:genero,fecha_nacimiento:fecha_nacimiento,nombre_persona_contacto:nombre_persona_contacto,telefono_persona_contacto:telefono_persona_contacto});
  }

  addEntityToWorker = (trabajadorId:number,entidadId:number,fecha_alta:string,sueldo_total:string,clinica_alta_imss:string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadId}/trabajador/${trabajadorId}/asociar`;
    return this.http.post(ENDPOINT,{fecha_alta:fecha_alta,sueldo_base_cotiz:sueldo_total,clinica_alta_imss:clinica_alta_imss});
  }

  addCategoryToWorker = (trabajadorId:number,entidadId:number,cargoId:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadId}/trabajador/${trabajadorId}/asignar/categoria/${cargoId}`;
    return this.http.post(ENDPOINT,{});
  }

  updateWorker = (trabajadorId:number,nombre:string,apellidos:string,rfc:string,curp:string,nss:string,correo:string,telefono:number,domicilio:string,genero:string,fecha_nacimiento:string,nombre_persona_contacto:string,telefono_persona_contacto:string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/trabajadores/${trabajadorId}/actualizar`;
    return this.http.post(ENDPOINT,{nombre:nombre,apellidos:apellidos,rfc:rfc,curp:curp,nss:nss,correo:correo,telefono:telefono,domicilio:domicilio,genero:genero,fecha_nacimiento:fecha_nacimiento,nombre_persona_contacto:nombre_persona_contacto,telefono_persona_contacto:telefono_persona_contacto});
  }

  deleteCategoryToWorker = (trabajadorId:number,entidadId:number,cargoId:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadId}/trabajador/${trabajadorId}/desasignar/categoria/${cargoId}`;
    return this.http.post(ENDPOINT,{});
  }

  deleteWorker = (trabajadorId:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/trabajadores/${trabajadorId}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

  uploadDownFile = (trabajadorId:number,entidadId:number,fecha_baja:string,motivo_baja:string,selectedFile?: any) => {
    let endpoint = `${this.globals.backend_base_url}/entidad/${entidadId}/trabajador/${trabajadorId}/baja`;
    let formData = new FormData()
    formData.append('motivo_baja', motivo_baja)
    formData.append('fecha_baja', fecha_baja)
    if (selectedFile) formData.append('file', selectedFile, selectedFile.name)
    return this.http.post(endpoint, formData);
  }

  viewBajaFile = (bajaDocUrl: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/docs/bajas/${bajaDocUrl}`;
    return this.http.get(ENDPOINT, { responseType: "blob"} );
  }

  uploadFileIMSS(selectedFile: any){
    let endpoint = `${this.globals.backend_base_url}/trabajadores/actualizaconexcel`;
    let formData = new FormData()
    if (selectedFile) formData.append('file', selectedFile, selectedFile.name)
    return this.http.post(endpoint, formData);
  }

}
