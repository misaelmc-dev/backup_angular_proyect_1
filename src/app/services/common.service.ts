import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getFrecuencias = () => {
      const ENDPOINT = `${this.globals.backend_base_url}/frecuencias?no_paginate`;
      return this.http.get(ENDPOINT);
  }

  paginateItems = (items: any, current_page: number, per_page_items: number) => {
    let page = current_page || 1,
      per_page = per_page_items || 10,
      offset = (page - 1) * per_page,

      paginatedItems = items.slice(offset).slice(0, per_page_items),
      total_pages = Math.ceil(items.length / per_page);

    return {
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: items.length,
      total_pages: total_pages,
      data: paginatedItems
    };
  }

  getEntidades = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades?no_paginate`;
    return this.http.get(ENDPOINT);
  }

  getEntidadesByWorker = (entity: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades?${entity}&no_paginate`;
    return this.http.get(ENDPOINT);
  }

  getEntidadesByProyect = (entity: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/entidades?${entity}&no_paginate`;
    return this.http.get(ENDPOINT);
  }

  getTipoDocumentos = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_documento?no_paginate`;
    return this.http.get(ENDPOINT);
  }

  getDocumentosPorFrecuencia = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/frecuencias?documentos&no_paginate`;
    return this.http.get(ENDPOINT);
  }

  getProyectos = (soloDeEntidadId?: number) => {
    let endpoint = `${this.globals.backend_base_url}/proyectos?no_paginate`;
    if (soloDeEntidadId)
      endpoint += `&de_entidades_ejecutoras=${soloDeEntidadId}`
    return this.http.get(endpoint);
  }

  getRangesOfWeek = (year: number) => {
    let weeks = [];
    let startDate = moment(new Date(year,0,1)).isoWeekday(8);
    if(startDate.date() == 8) {
      startDate = startDate.isoWeekday(-6)
    }
    let today = moment().isoWeekday('Sunday');
    while(startDate.year() === year) {
      let startDateWeek = startDate.isoWeekday('Monday').format('YYYY-MM-DD');
      let endDateWeek = startDate.isoWeekday('Sunday').format('YYYY-MM-DD');
      startDate.add(7,'days');
      weeks.push(`${startDateWeek}:${endDateWeek}`);
    }
    return weeks;
  }

  orderSimple(array: any){
    let orderres: any[] = array;
    orderres.sort((n1,n2) => {
      if (n1.nombre < n2.nombre) {return -1;}
      if (n1.nombre > n2.nombre) {return 1;}
      return 0;
    });
    return orderres;
  }

  orderBy(data:any,campo:string,orden:string){
    let datos_ordenados: any[] = data;
    datos_ordenados.sort((n1,n2) => {
      if(campo=='id'){
        if(orden=='asc'){
          if (n1.id > n2.id) {return 1;}
          if (n1.id > n2.id) {return -1;}
        }else if(orden=='desc'){
          if (n1.id < n2.id) {return 1;}
          if (n1.id > n2.id) {return -1;}
        }
      }else if(campo='nombre'){
        if(orden=='asc'){
          if (n1.nombre > n2.nombre) {return 1;}
          if (n1.nombre > n2.nombre) {return -1;}
        }else if(orden=='desc'){
          if (n1.nombre < n2.nombre) {return 1;}
          if (n1.nombre > n2.nombre) {return -1;}
        }
      }
      return 0;
    });

  }

}
