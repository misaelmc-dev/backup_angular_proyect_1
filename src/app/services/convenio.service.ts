import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getConveniosList = (entidadId:number,proyectoId:number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/contratos/convenios?de_entidad=${entidadId}&de_proyecto=${proyectoId}`;
    return this.http.get(ENDPOINT);
  }

  addConvenios(entidadId:number,proyectoId:number,descripcion:string){
    const ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadId}/ejecutante/proyecto/${proyectoId}/convenios/crear`;
    return this.http.post(ENDPOINT,{descripcion:descripcion});
  }

  updateConvenios(convenioId:number,descripcion:string){
    const ENDPOINT = `${this.globals.backend_base_url}/contratos/convenios/${convenioId}/actualizar`;
    return this.http.post(ENDPOINT,{descripcion:descripcion});
  }

  deleteConvenios = (convenioId:number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/contratos/convenios/${convenioId}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

  uploadFile = (convenioId: number, selectedFile: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/contratos/convenios/${convenioId}/subir`;
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    return this.http.post(ENDPOINT, uploadData);
  }

  viewFile = (convenioDocUrl: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/docs/contratos/convenios/${convenioDocUrl}`;
    return this.http.get(ENDPOINT, { responseType: "blob"} );
  }

  deleteFile = (convenioDocUrl: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/docs/contratos/convenios/${convenioDocUrl}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

}

