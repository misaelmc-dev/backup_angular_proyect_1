import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

   idp = '';
   ide = '';

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getContratos = (entidadId:number,proyectoId:number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidad/ejecutante/proyecto?no_paginate=&de_entidades=${entidadId}&de_proyectos=${proyectoId}`;
    console.log(ENDPOINT);
    return this.http.get(ENDPOINT);
  }

  getContratosData = (criterio:string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidad/ejecutante/proyecto?no_paginate=${criterio}`;
    console.log(ENDPOINT);
    return this.http.get(ENDPOINT);
  }

  updateContratos(entidadId:number,proyectoId:number,contratoFI:string,contratoFF:string,contratoNum:string,contratoMonto:string,contratoFFI:string,contratoDes:string,contratoReg:string,contratoSup:string,contratoEstatus:string){
    const ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadId}/ejecutante/proyecto/${proyectoId}/asignar`;
    return this.http.post(ENDPOINT,{fecha_desde:contratoFI,fecha_hasta:contratoFF,num_contrato:contratoNum,monto_contrato:contratoMonto,fecha_firma_contrato:contratoFFI,desc_contrato:contratoDes,num_reg_obra:contratoReg,superf_contratada_m2:contratoSup,estatus:contratoEstatus});
  }

  uploadContratFile = (entidadId:number,proyectoId:number,selectedFile: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadId}/proyecto/${proyectoId}/contrato/subir`;
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    return this.http.post(ENDPOINT, uploadData);
  }

  viewContratFile = (contratoDocUrl: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/docs/contratos/${contratoDocUrl}`;
    return this.http.get(ENDPOINT, { responseType: "blob"} );
  }

  deleteContratFile = (contratoDocUrl: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/docs/contratos/${contratoDocUrl}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

  getObservacionesList = (entidadId:number,proyectoId:number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/observaciones/?no_paginate=&proyecto=${proyectoId}&entidad=${entidadId}`;
    return this.http.get(ENDPOINT);
  }

  getObservacionesDataList = (criterio:string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/observaciones/${criterio}`;
    console.log(ENDPOINT);
    return this.http.get(ENDPOINT);
  }

  addObservaciones(entidadId:number,proyectoId:number,observacion:string){
    const ENDPOINT = `${this.globals.backend_base_url}/observaciones/crear`;
    return this.http.post(ENDPOINT,{observacion:observacion,proyecto:proyectoId,entidad_contratista:entidadId});
  }

  updateObservaciones(observacionId:number,observacion:string){
    const ENDPOINT = `${this.globals.backend_base_url}/observaciones/${observacionId}/actualizar`;
    return this.http.post(ENDPOINT,{observacion:observacion});
  }

  deleteObservaciones = (observacionId:number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/observaciones/${observacionId}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

}
