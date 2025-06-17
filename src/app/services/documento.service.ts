import {Injectable} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {GlobalsVars} from "../global/globals-vars";
import {Documento} from "../interfaces/documento";

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  findDocumentsByPage(
    pageSize: number,
    pageNumber: number
  ): Observable<Documento[]> {
    let params = new HttpParams();
    params = params.append('page_size', String(pageSize));
    params = params.append('page', String(pageNumber));
    return this.http
      .get(
        `${this.globals.backend_base_url}/docs_entregables`,
        {
          params,
        }
      )
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  getDocumentsByFrecuencyId = (
    frecuencyId: number,
    pageSize: number,
    pageNumber: number
  ): Observable<Documento[]> => {
    let params = new HttpParams();
    params = params.append('page_size', String(pageSize));
    params = params.append('page', String(pageNumber));
    return this.http
      .get(
        `${this.globals.backend_base_url}/docs_entregables?con_frecuencia=${frecuencyId}`,
        {
          params,
        }
      )
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  getDocumentos = (criteria: string, values: string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/docs/entregables/estados?${criteria}`;
    if (values !== ''){
      ENDPOINT = `${this.globals.backend_base_url}/docs/entregables/estados?${criteria}=${values}`;
    }
    return this.http.get(ENDPOINT);
  }

  getDocumentosCriteria = (criteria: string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/docs/entregables/estados?${criteria}`;
    console.log(ENDPOINT);
    return this.http.get(ENDPOINT);
  }

  getDocumentosEntregablesList = () => {
    let ENDPOINT = `${this.globals.backend_base_url}/docs_entregables/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getDocumentosEntregablesByEntidad = (entidadId:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/docs_entregables/?no_paginate=&de_entidad=${entidadId}`;
    return this.http.get(ENDPOINT);
  }

  getDocumentosTiposList = () => {
    let ENDPOINT = `${this.globals.backend_base_url}/tipos_documento/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getDocumentosFrecuenciasList = () => {
    let ENDPOINT = `${this.globals.backend_base_url}/frecuencias/?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getDocumentosEntregadosList = (filtros:any) => {
    let ENDPOINT = `${this.globals.backend_base_url}/docs/entregables/estados?${filtros}`;
    return this.http.get(ENDPOINT);
  }

  addDocumentosEntregables = (nombre:string,frecuencia:any,tipo:any,nomenclatura:string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/docs_entregables/crear`;
    return this.http.post(ENDPOINT,{nombre:nombre,frecuencia_documento_id:frecuencia,tipo_id:tipo,nomenclatura_nombre_archivo:nomenclatura});
  }

  addDocumentosToEntidad = (entidadId:number,documentoId:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadId}/entregable/${documentoId}`;
    return this.http.post(ENDPOINT,{dia_semana_entrega:6,dia_mes_entrega:28,incluye_toda_unidad_tiempo:true});
  }

  deleteDocumentosToEntidad = (entidadId:number,documentoId:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadId}/entregable/${documentoId}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

  updateDocumentosEntregables = (claveid:any,nombre:string,frecuencia:any,tipo:any,nomenclatura:string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/docs_entregables/${claveid}/actualizar`;
    return this.http.post(ENDPOINT,{nombre:nombre,frecuencia_documento_id:frecuencia,tipo_id:tipo,nomenclatura_nombre_archivo:nomenclatura});
  }

  asignateAllDocumentsEntity = (entidadid:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadid}/entregabletodos`;
    return this.http.post(ENDPOINT,{});
  }

  deleteAllDocumentsEntity = (entidadid:number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/entidad/${entidadid}/entregabletodos/eliminar`;
    return this.http.delete(ENDPOINT);
  }

  deleteDocumentosEntregables = (claveid: number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/docs_entregables/${claveid}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

  deleteDocument = (documentName: string) => {
    let ENDPOINT = `${this.globals.backend_base_url}/docs/entregados/eliminar/${documentName}`;
    return this.http.delete(ENDPOINT);
  }

  uploadFile = (idEntidad: any, idProyecto: any, idDocumento: any, fecha_debida: string, selectedFile: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidad/${idEntidad}/proyecto/${idProyecto}/doc/${idDocumento}/entregar`;
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('fecha_debida', fecha_debida);
    return this.http.post(ENDPOINT, uploadData);
  }

  viewDocumentFile = (contratoDocUrl: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/docs/entregados/${contratoDocUrl}`;
    return this.http.get(ENDPOINT, { responseType: "blob"} );
  }

}
