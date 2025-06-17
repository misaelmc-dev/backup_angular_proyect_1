import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../../../../services/common.service";
import {AsistenciaService} from "../../../../../services/asistencia.service";
import * as moment from "moment";
import {TrabajadorService} from "../../../../../services/trabajador.service";
import {ExcelJson} from "../../../../../interfaces/excel-json";
import {ExportService} from "../../../../../services/export.service";
import {ProyectoService} from "../../../../../services/proyecto.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-control-asistencia-diaria-entidad',
  templateUrl: './control-asistencia-diaria-entidad.component.html',
  styleUrls: ['./control-asistencia-diaria-entidad.component.css']
})
export class ControlAsistenciaDiariaEntidadComponent implements OnInit {

  entidadId: number //id de entidad del componente

  criteria!: string
  proyectos: any[] = [];
  selectedProyecto = '';
  workers: any[] = [];
  selectedWorker = '';
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  fecha = '';
  showLoadingBar = false;
  paginationId = 'paginationDaily';
  today = new Date();
  checkasistencias:string = '';
  checkfaltas:string = '';
  checkincapacidad:string = '';
  checkdescansos:string = '';
  checknolaboro:string = '';
  numeroProyectos:number = 0;
  numeroWorkers:number = 0;
  searchCrit:string = '';

  constructor(private commonService: CommonService,
              private asistenciaService: AsistenciaService,
              private trabajadorService: TrabajadorService,
              private exportService: ExportService,
              private proyectoService: ProyectoService,
              private route: ActivatedRoute) {
    this.entidadId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadTrabajadores();
    this.loadProyectos();
  }

  cleanTrabajadores = () => {
    this.workers = [];
    this.selectedWorker = '';
    this.numeroWorkers = 0;
  }

  cleanProyectos = () => {
    this.proyectos = [];
    this.selectedProyecto = '';
    this.numeroProyectos = 0;
  }

  loadTrabajadores = () => {
    this.asistenciaService.getWorkers(this.entidadId).subscribe((res: any) => {
      this.workers = res.map((item: any) => {
        return {'id': item.id, 'nombre': item.nombre + ' ' + item.apellidos}
      });
    })
  }

  loadProyectos = () => {
    this.commonService.getProyectos(this.entidadId).subscribe((res: any) => {
      this.proyectos = res;
    });
  }

  handlePageDiariasChange = (event: number) => {
    this.pageNumberDiarias = event;
    this.getAsistenciasDiarias();
  }

  dateCreated(event: any) {
    this.fecha = moment(event).format('YYYY-MM-DD');
    this.getAsistenciasDiarias();
  }

  listCheckAsistencias(){
    if(this.checkasistencias==''){this.checkasistencias='&incluye_asistencia=';
    }else{this.checkasistencias='';}
    this.getAsistenciasDiarias();
  }

  listCheckFaltas(){
    if(this.checkfaltas==''){this.checkfaltas='&incluye_falta=';
    }else{this.checkfaltas='';}
    this.getAsistenciasDiarias();
  }

  listCheckIncapacidad(){
    if(this.checkincapacidad==''){this.checkincapacidad='&incluye_incapacidad=';
    }else{this.checkincapacidad='';}
    this.getAsistenciasDiarias();
  }

  listCheckDescansos(){
    if(this.checkdescansos==''){this.checkdescansos='&incluye_descanso=';
    }else{this.checkdescansos='';}
    this.getAsistenciasDiarias();
  }

  listCheckNolaboro(){
    if(this.checknolaboro==''){this.checknolaboro='&incluye_no_laboro=';
    }else{this.checknolaboro='';}
    this.getAsistenciasDiarias();
  }

  searchAsitenciaByCriterio = (criterioSearch: any) =>{
    this.searchCrit = criterioSearch ;
    this.getAsistenciasDiarias();
  }

  getAsistenciasDiarias = () => {
    this.showLoadingBar = true;
    this.criteria = `entidades=${this.entidadId}&fecha_desde=${this.fecha}&fecha_hasta=${this.fecha}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}&search=${this.searchCrit}${this.checkasistencias}${this.checkfaltas}${this.checkincapacidad}${this.checkdescansos}${this.checknolaboro}`;
    this.asistenciaService.getAsistenciaCriteria(this.criteria).subscribe((res: any) => {
      let resumenes: any[] = [];
      for (const [key, value] of Object.entries(res)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      let paginate = this.commonService.paginateItems(resumenes, this.pageNumberDiarias, this.pageSizeDiarias);
      this.dataSource = paginate.data;
      this.totalItemsDiarias = paginate.total;
      this.showLoadingBar = false;
    }, () => {this.showLoadingBar = false;});
  }

  exportToExcel = () => {
    this.showLoadingBar = true;
    this.criteria = `entidades=${this.entidadId}&fecha_desde=${this.fecha}&fecha_hasta=${this.fecha}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}&search=${this.searchCrit}${this.checkasistencias}${this.checkfaltas}${this.checkincapacidad}${this.checkdescansos}${this.checknolaboro}`;
    this.asistenciaService.getAsistenciaCriteria(this.criteria).subscribe((res: any) => {
      let resumenes: any[] = [];
      for (const [key, value] of Object.entries(res)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }

      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          {
            A: 'ID_empleado',
            B: 'Nombre',
            C: 'Apellidos',
            D: 'Entidad',
            E: 'Cargo',
            F: 'Hora_de_entrada',
            G: 'Estatus'
          }, // table header
        ],
        skipHeader: true,
      };
      resumenes.forEach((item: any) => {
        udt.data.push({
          A: item.trab_id,
          B: item.nomb_trab,
          C: item.apell_trab,
          D: item.ent_nombre,
          E: item.categ,
          F: item.punch_time,
          G: item.status
        });
      });
      edata.push(udt);
      this.exportService.exportJsonToExcelColor(edata, 'Reporte_Asistencia_Diaria');
      this.showLoadingBar = false;
    }, () => {this.showLoadingBar = false;});
  }

  cleanFilters = () => {
    this.showLoadingBar = true;

    this.fecha = '';
    let resumenes: any[] = [];
    let paginate = this.commonService.paginateItems(resumenes, this.pageNumberDiarias, this.pageSizeDiarias);
    this.dataSource = paginate.data;
    this.totalItemsDiarias = paginate.total;

    this.checkasistencias = '';
    this.checkfaltas = '';
    this.checkincapacidad = '';
    this.checkdescansos = '';
    this.checknolaboro = '';

    this.cleanTrabajadores();
    this.cleanProyectos();
    this.ngOnInit();
    this.showLoadingBar = false;
  }

  getEntityAndProyectsByWorker() {
    this.cleanProyectos();
    let criteriopt = `de_trabajadores=${this.selectedWorker}&no_paginate`;
    this.proyectoService.getProyectoByWorker(criteriopt).subscribe((res: any) => {
      if(res.length == 1){ this.numeroProyectos = 1;}
      else{this.numeroProyectos = 0;}
      this.proyectos = res;
    });
    this.getAsistenciasDiarias();
  }

  getEntityAndWorkerByProyect() {
    this.cleanTrabajadores();
    let criteriotp = this.selectedProyecto;
    this.trabajadorService.getWorkersByProyect(criteriotp, this.entidadId).subscribe((res: any) => {
      if(res.length <= 1){ this.numeroWorkers = 1;}
      else{this.numeroWorkers = 0;}
      this.workers = res;
    });
    this.getAsistenciasDiarias();
  }
}
