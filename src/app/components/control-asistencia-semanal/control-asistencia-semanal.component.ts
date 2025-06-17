import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {AsistenciaService} from "../../services/asistencia.service";
import * as moment from 'moment';
import {TrabajadorService} from "../../services/trabajador.service";
import {ExcelJson} from "../../interfaces/excel-json";
import {ExportService} from "../../services/export.service";
import {ProyectoService} from "../../services/proyecto.service";

@Component({
  selector: 'app-control-asistencia-semanal',
  templateUrl: './control-asistencia-semanal.component.html',
  styleUrls: ['./control-asistencia-semanal.component.css']
})
export class ControlAsistenciaSemanalComponent implements OnInit {

  criteria!: string;
  entidades: any[] = [];
  selectedEntidad:number = 0;
  proyectos: any[] = [];
  selectedProyecto:any = '';
  workers: any[] = [];
  selectedWorker:any = '';
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
  numeroEntidades:number = 0;
  numeroWorkers: number = 0;
  searchCrit:string = '';
  search:string = '';

  constructor(private commonService: CommonService,
              private asistenciaService: AsistenciaService,
              private trabajadorService: TrabajadorService,
              private exportService: ExportService,
              private proyectoService: ProyectoService) {
  }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadTrabajadores();
    this.loadProyectos();
  }

  loadEntidades = () => {
    this.entidades = [];
    this.selectedEntidad = 0;
    this.numeroEntidades = 0;
    this.commonService.getEntidades().subscribe((res: any) => {
      this.entidades = res;
    })
  }

  loadTrabajadores = () => {
    this.workers = [];
    this.selectedWorker = '';
    this.numeroWorkers = 0;
    this.asistenciaService.getWorkers().subscribe((res: any) => {
      this.workers = res.map((item: any) => {
        return {'id': item.id, 'nombre': item.nombre + ' ' + item.apellidos}
      });
    })
  }

  loadProyectos = () => {
    this.proyectos = [];
    this.selectedProyecto = '';
    this.numeroProyectos = 0;
    this.commonService.getProyectos().subscribe((res: any) => {
      this.proyectos = res;
    });
  }

  cleanEntidades = () => {
    this.entidades = [];
    this.selectedEntidad = 0;
    this.numeroEntidades = 0;
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

  getWorkersAndProyectByEntityId(){
    this.pageNumberSemanal=1;
    this.cleanTrabajadores();
    let criteriote = `de_entidad=${this.selectedEntidad}&no_paginate`;
    this.trabajadorService.getWorkers(criteriote).subscribe((res: any) => {
      if(res.length <= 1){
        for(let t of res){this.selectedWorker=t.id;}
      }else{
        this.selectedWorker=0;
      }
      this.workers = res;
    });
    this.cleanProyectos();
    let criteriope = this.selectedEntidad;
    this.proyectoService.getProyectoByEntity(criteriope).subscribe((res: any) => {
      if(res.length <= 1){
        for(let t of res){this.selectedProyecto=t.id;}
      }else{
        this.selectedProyecto=0;
      }
      this.proyectos = res;
    });
    this.getAsistenciasCriteria();
  }

  getEntityAndProyectsByWorker(){
    this.pageNumberSemanal=1;
    this.cleanEntidades();
    let criterioet = `de_trabajadores=${this.selectedWorker}&no_paginate`;
    this.commonService.getEntidadesByWorker(criterioet).subscribe((res: any) => {
      if(res.length <= 1){
        for(let t of res){this.selectedEntidad=t.id;}
      }else{
        this.selectedEntidad=0;
      }
      this.entidades = res;
    });
    this.cleanProyectos()
    let criteriopt = `de_trabajadores=${this.selectedWorker}&no_paginate`;
    this.proyectoService.getProyectoByWorker(criteriopt).subscribe((res: any) => {
      if(res.length <= 1){
        for(let t of res){this.selectedProyecto=t.id;}
      }else{
        this.selectedProyecto=0;
      }
      this.proyectos = res;
    });
    this.getAsistenciasCriteria();
  }

  getEntityAndWorkerByProyect(){
    this.pageNumberSemanal=1;
    this.cleanEntidades();
    let criterioep = `de_proyectos=${this.selectedProyecto}&no_paginate`;
    this.commonService.getEntidadesByProyect(criterioep).subscribe((res: any) => {
      if(res.length <= 1){
        for(let t of res){this.selectedEntidad=t.id;}
      }else{
        this.selectedEntidad=0;
      }
      this.entidades = res;
    });
    this.cleanTrabajadores();
    let criteriotp = this.selectedProyecto;
    this.trabajadorService.getWorkersByProyect(criteriotp).subscribe((res: any) => {
      if(res.length <= 1){
        for(let t of res){this.selectedWorker=t.id;}
      }else{
        this.selectedWorker=0;
      }
      this.workers = res;
    });
    this.getAsistenciasCriteria();
  }

  handlePageSemanalChange(event: any) {
    this.pageNumberSemanal = event;
    this.getAsistenciasCriteria();
  }

  dateRangeCreated(event: any) {
    this.pageNumberSemanal=1;
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

  searchAsistencias(){
    this.pageNumberSemanal=1;
    if(this.searchCrit!=''){this.search='&search='+this.searchCrit;}else{this.search='';}
    this.getAsistenciasCriteria();
  }

  exportToExcel = () => {
    this.showLoadingBar = true;
    this.criteria = `entidades=${this.selectedEntidad}&fecha_desde=${this.fecha_desde}&fecha_hasta=${this.fecha_hasta}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}${this.search}`;
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
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'',M:'',N:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'',M:'',N:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'',M:'',N:'' },
          {
            A: '',
            B: 'Id',
            C: 'Nombre',
            D: 'Apellidos',
            E: 'Entidad',
            F: 'Cargo',
            G: 'Lunes',
            H: 'Martes',
            I: 'Miércoles',
            J: 'Jueves',
            K: 'Viernes',
            L: 'Sábado',
            M: 'Domingo',
            N: ''
          }, // table header
        ],
        skipHeader: true,
      };
      resumenes.forEach((item: any) => {
        udt.data.push({
          A: '',
          B: item.trab_id,
          C: item.nomb_trab,
          D: item.apell_trab,
          E: item.ent_nombre,
          F: item.categ,
          G: item.lunes.status,
          H: item.martes.status,
          I: item.miercoles.status,
          J: item.jueves.status,
          K: item.viernes.status,
          L: item.sabado.status,
          M: item.domingo.status,
          N: ''
        });
      });
      edata.push(udt);
      let dia = moment(new Date()).format()
      this.exportService.exportEconomicReport(edata, 'Reporte asistencia semanal_'+dia);
      this.showLoadingBar = false;
    });
  }

  getAsistenciasCriteria(){
    this.showLoadingBar = true;
    this.fecha_completa = this.fecha_desde+" - "+this.fecha_hasta;
    this.criteria = `entidades=${this.selectedEntidad}&fecha_desde=${this.fecha_desde}&fecha_hasta=${this.fecha_hasta}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}${this.search}`;
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
        bgcolor = '#c5e0b4';
        font_color = 'black';
        break;
      case 'F':
        bgcolor = '#ffa3a3';
        font_color = 'black';
        break;
      case 'I':
        bgcolor = '#d5b8ea';
        font_color = 'black';
        break;
      case 'D':
        bgcolor = '#c8d6ee';
        font_color = 'black';
        break;
      case 'NL':
        bgcolor = '#ffedb3';
        font_color = 'black';
        break;
    }
    return `background-color: ${bgcolor}; color: ${font_color};`;
  }

  cleanFilters = () => {
    this.showLoadingBar = true;
    this.searchCrit = '';
    this.search = '';
    this.fecha_desde = '';
    this.fecha_hasta = '';
    this.fecha_completa = '';
    let resumenes: any[] = [];
    this.pageNumberSemanal=1;
    let paginate = this.commonService.paginateItems(resumenes, this.pageNumberSemanal, this.pageSizeSemanal);
    this.dataSource = paginate.data;
    this.totalItemsSemanal = paginate.total;

    this.cleanEntidades();
    this.cleanTrabajadores();
    this.cleanProyectos();
    this.ngOnInit();
    this.showLoadingBar = false;
  }
}
