import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../../../../services/common.service";
import {AsistenciaService} from "../../../../../services/asistencia.service";
import * as moment from 'moment';
import {TrabajadorService} from "../../../../../services/trabajador.service";
import {ExcelJson} from "../../../../../interfaces/excel-json";
import {ExportService} from "../../../../../services/export.service";
import {ProyectoService} from "../../../../../services/proyecto.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-control-asistencia-semanal-entidad',
  templateUrl: './control-asistencia-semanal-entidad.component.html',
  styleUrls: ['./control-asistencia-semanal-entidad.component.css']
})
export class ControlAsistenciaSemanalEntidadComponent implements OnInit {

  criteria!: string;
  entidadId: number
  proyectos: any[] = [];
  selectedProyecto = '';
  workers: any[] = [];
  selectedWorker = '';
  dataSource: any[] = [];
  pageSizeSemanal = 10;
  pageNumberSemanal = 1;
  totalItemsSemanal: any;
  fecha_desde = '';
  fecha_hasta = '';
  fecha_completa = '';
  showLoadingBar = false;
  paginationId = 'paginationSemanal';
  today = new Date();
  numeroProyectos: number = 0;
  numeroWorkers: number = 0;
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

  loadTrabajadores = () => {
    this.workers = [];
    this.selectedWorker = '';
    this.numeroWorkers = 0;
    this.asistenciaService.getWorkers(this.entidadId).subscribe((res: any) => {
      this.workers = res.map((item: any) => {
        return {'id': item.id, 'nombre': item.nombre + ' ' + item.apellidos}
      });
    })
  }

  loadProyectos = () => {
    this.proyectos = [];
    this.selectedProyecto = '';
    this.numeroProyectos = 0;
    this.commonService.getProyectos(this.entidadId).subscribe((res: any) => {
      this.proyectos = res;
    });
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

  getEntityAndProyectsByWorker = () => {
    this.cleanProyectos()
    let criteriopt = `de_trabajadores=${this.selectedWorker}&no_paginate`;
    this.proyectoService.getProyectoByWorker(criteriopt).subscribe((res: any) => {
      if(res.length == 1){ this.numeroProyectos = 1;}
      else{this.numeroProyectos = 0;}
      this.proyectos = res;
    });
    this.getAsistenciasCriteria();
  }

  getEntityAndWorkerByProyect = () => {
    this.cleanTrabajadores();
    let criteriotp = `de_proyecto=${this.selectedProyecto}&de_entidad=${this.entidadId}&no_paginate`;
    this.trabajadorService.getWorkers(criteriotp).subscribe((res: any) => {
      if(res.length <= 1){ this.numeroWorkers = 1;}
      else{this.numeroWorkers = 0;}
      this.workers = res;
    });
    this.getAsistenciasCriteria();
  }

  handlePageSemanalChange(event: any) {
    this.pageNumberSemanal = event;
    this.getAsistenciasCriteria();
  }

  dateRangeCreated(event: any) {
    this.fecha_desde = moment(event).format('YYYY-MM-DD');
    let num_dia:any = moment(event).format('E');
    if(num_dia==7){
      this.fecha_desde = moment(this.fecha_desde).subtract(6, 'days').format('YYYY-MM-DD');
    }else if(num_dia==6){
      this.fecha_desde = moment(this.fecha_desde).subtract(5, 'days').format('YYYY-MM-DD');
    }else if(num_dia==5){
      this.fecha_desde = moment(this.fecha_desde).subtract(4, 'days').format('YYYY-MM-DD');
    }else if(num_dia==4){
      this.fecha_desde = moment(this.fecha_desde).subtract(3, 'days').format('YYYY-MM-DD');
    }else if(num_dia==3){
      this.fecha_desde = moment(this.fecha_desde).subtract(2, 'days').format('YYYY-MM-DD');
    }else if(num_dia==2){
      this.fecha_desde = moment(this.fecha_desde).subtract(1, 'days').format('YYYY-MM-DD');
    }
    this.fecha_hasta = moment(this.fecha_desde).add(6, 'days').format('YYYY-MM-DD');
    this.fecha_completa = this.fecha_desde+" - "+this.fecha_hasta;
    this.getAsistenciasCriteria();
  }

  searchAsitenciaByCriterio = (criterioSearch: any) =>{
    this.searchCrit = criterioSearch ;
    this.getAsistenciasCriteria();
  }

  exportToExcel = () => {
    this.showLoadingBar = true;
    this.criteria = `entidades=${this.entidadId}&fecha_desde=${this.fecha_desde}&fecha_hasta=${this.fecha_hasta}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}&search=${this.searchCrit}`;
    this.asistenciaService.getAsistenciaCriteria(this.criteria).subscribe((res: any) => {
      let resumenes: any[] = [];
      for (const [key, value] of Object.entries(res)) {
        let response = value as any;
        let resumen = {
          trab_id: '',
          nomb_trab: '',
          apell_trab: '',
          ent_nombre: '',
          categ: '',
          lunes: {
            status: '',
            style: ''
          },
          martes: {
            status: '',
            style: ''
          },
          miercoles: {
            status: '',
            style: ''
          },
          jueves: {
            status: '',
            style: ''
          },
          viernes: {
            status: '',
            style: ''
          },
          sabado: {
            status: '',
            style: ''
          },
          domingo: {
            status: '',
            style: ''
          },
        };
        resumen.trab_id = response.data[0].trab_id;
        resumen.nomb_trab = response.data[0].nomb_trab;
        resumen.apell_trab = response.data[0].apell_trab;
        resumen.ent_nombre = response.data[0].ent_nombre;
        resumen.categ = response.data[0].categ;
        for (const item of response.data) {
          switch (item.w_day){
            case 0:
              resumen.domingo.status = item.status;
              resumen.domingo.style = this.findStatusColor(item.status);
              break;
            case 1:
              resumen.lunes.status = item.status;
              resumen.lunes.style = this.findStatusColor(item.status);
              break;
            case 2:
              resumen.martes.status = item.status;
              resumen.martes.style = this.findStatusColor(item.status);
              break;
            case 3:
              resumen.miercoles.status = item.status;
              resumen.miercoles.style = this.findStatusColor(item.status);
              break;
            case 4:
              resumen.jueves.status = item.status;
              resumen.jueves.style = this.findStatusColor(item.status);
              break;
            case 5:
              resumen.viernes.status = item.status;
              resumen.viernes.style = this.findStatusColor(item.status);
              break;
            case 6:
              resumen.sabado.status = item.status;
              resumen.sabado.style = this.findStatusColor(item.status);
              break;
          }
        }
        resumenes.push(resumen);
      }

      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          {
            A: 'Id',
            B: 'Nombre',
            C: 'Apellidos',
            D: 'Entidad',
            E: 'Cargo',
            F: 'Lunes',
            G: 'Martes',
            H: 'Miércoles',
            I: 'Jueves',
            J: 'Viernes',
            K: 'Sábado',
            L: 'Domingo'
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
          F: item.lunes.status,
          G: item.martes.status,
          H: item.miercoles.status,
          I: item.jueves.status,
          J: item.viernes.status,
          K: item.sabado.status,
          L: item.domingo.status
        });
      });
      edata.push(udt);
      this.exportService.exportJsonToExcelColor(edata, 'Reporte_Asistencia_Semanal');
      this.showLoadingBar = false;
    }, () => {
      this.showLoadingBar = false;
    });
  }

  getAsistenciasCriteria = () => {
    this.showLoadingBar = true;
    this.fecha_completa = this.fecha_desde+" - "+this.fecha_hasta;
    this.criteria = `entidades=${this.entidadId}&fecha_desde=${this.fecha_desde}&fecha_hasta=${this.fecha_hasta}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}&search=${this.searchCrit}`;
    this.asistenciaService.getAsistenciaCriteria(this.criteria).subscribe((res: any) => {
      let resumenes: any[] = [];
      for (const [key, value] of Object.entries(res)) {
        let response = value as any;
        let resumen = {
          trab_id: '',
          nomb_trab: '',
          apell_trab: '',
          ent_nombre: '',
          categ: '',
          lunes: {
            status: '',
            style: ''
          },
          martes: {
            status: '',
            style: ''
          },
          miercoles: {
            status: '',
            style: ''
          },
          jueves: {
            status: '',
            style: ''
          },
          viernes: {
            status: '',
            style: ''
          },
          sabado: {
            status: '',
            style: ''
          },
          domingo: {
            status: '',
            style: ''
          },
        };
        resumen.trab_id = response.data[0].trab_id;
        resumen.nomb_trab = response.data[0].nomb_trab;
        resumen.apell_trab = response.data[0].apell_trab;
        resumen.categ = response.data[0].categ;
        resumen.ent_nombre = response.data[0].ent_nombre;
        for (const item of response.data) {
          switch (item.w_day){
            case 0:
              resumen.domingo.status = item.status;
              resumen.domingo.style = this.findStatusColor(item.status);
              break;
            case 1:
              resumen.lunes.status = item.status;
              resumen.lunes.style = this.findStatusColor(item.status);
              break;
            case 2:
              resumen.martes.status = item.status;
              resumen.martes.style = this.findStatusColor(item.status);
              break;
            case 3:
              resumen.miercoles.status = item.status;
              resumen.miercoles.style = this.findStatusColor(item.status);
              break;
            case 4:
              resumen.jueves.status = item.status;
              resumen.jueves.style = this.findStatusColor(item.status);
              break;
            case 5:
              resumen.viernes.status = item.status;
              resumen.viernes.style = this.findStatusColor(item.status);
              break;
            case 6:
              resumen.sabado.status = item.status;
              resumen.sabado.style = this.findStatusColor(item.status);
              break;
          }
        }
        resumenes.push(resumen);
      }
      let paginate = this.commonService.paginateItems(resumenes, this.pageNumberSemanal, this.pageSizeSemanal);
      this.dataSource = paginate.data;
      this.totalItemsSemanal = paginate.total;
      this.showLoadingBar = false;
    }, () => {
      this.showLoadingBar = false;
    });
  }

  findWeekDay = (item: any, resumen: any, w_day: number) => {
    switch (w_day){
      case 0:
        resumen.domingo = item.status;
        break;
      case 1:
        resumen.lunes = item.status;
        break;
      case 2:
        resumen.martes = item.status;
        break;
      case 3:
        resumen.miercoles = item.status;
        break;
      case 4:
        resumen.jueves = item.status;
        break;
      case 5:
        resumen.viernes = item.status;
        break;
      case 6:
        resumen.sabado = item.status;
        break;
    }
  }

  findStatusColor = (status: string) => {
    let bgcolor = '';
    let font_color = '';
    switch (status){
      case 'A':
        bgcolor = '#198754';
        font_color = 'white';
        break;
      case 'F':
        bgcolor = '#dc3545';
        font_color = 'white';
        break;
      case 'I':
        bgcolor = '#6610f2';
        font_color = 'white';
        break;
      case 'D':
        bgcolor = '#0dcaf0';
        font_color = 'black';
        break;
      case 'NL':
        bgcolor = '#ffc107';
        font_color = 'black';
        break;
    }
    return `background-color: ${bgcolor}; color: ${font_color};`;
  }

  cleanFilters = () => {
    this.showLoadingBar = true;

    this.fecha_desde = '';
    this.fecha_hasta = '';
    this.fecha_completa = '';
    let resumenes: any[] = [];
    let paginate = this.commonService.paginateItems(resumenes, this.pageNumberSemanal, this.pageSizeSemanal);
    this.dataSource = paginate.data;
    this.totalItemsSemanal = paginate.total;

    this.cleanTrabajadores();
    this.cleanProyectos();
    this.ngOnInit();
    this.showLoadingBar = false;
  }
}
