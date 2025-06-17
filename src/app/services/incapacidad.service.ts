import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class IncapacidadService {

  constructor(private http: HttpClient,
              private globals: GlobalsVars
  ){}

  getIncapacitisList = (consulta:string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/incapacidades?no_paginate=${consulta}`;
    return this.http.get(ENDPOINT);
  }

  addIncapacity = (trabajadorId:number,entidadId:number,motivo_incapacidad:string,fecha_inicio:string,fecha_fin:string,selectedFile?: any) => {
    let ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadId}/trabajador/${trabajadorId}/asignar/incapacidad`;
    let formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    formData.append('motivo_incapacidad', motivo_incapacidad);
    formData.append('fecha_inicio', fecha_inicio);
    formData.append('fecha_fin', fecha_fin);
    return this.http.post(ENDPOINT, formData);
  }

  updateIncapacity = (incapacityId:number,motivo_incapacidad:string,fecha_inicio:string,fecha_fin:string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/incapacidades/${incapacityId}/actualizar`;
    return this.http.post(ENDPOINT,{motivo_incapacidad:motivo_incapacidad,fecha_inicio:fecha_inicio,fecha_fin:fecha_fin});
  }

  deleteIncapacity = (incapacidadId: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/incapacidades/${incapacidadId}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

  viewIncapacityFile = (incapacityDocUrl: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/docs/incapacidades/${incapacityDocUrl}`;
    return this.http.get(ENDPOINT, { responseType: "blob"} );
  }
}


