import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {AsistenciaService} from "../../services/asistencia.service";
import * as moment from "moment";
import {TrabajadorService} from "../../services/trabajador.service";
import {ExcelJson} from "../../interfaces/excel-json";
import {ExportService} from "../../services/export.service";
import {ProyectoService} from "../../services/proyecto.service";

@Component({
  selector: 'app-control-asistencia-mensual',
  templateUrl: './control-asistencia-mensual.component.html',
  styleUrls: ['./control-asistencia-mensual.component.css']
})
export class ControlAsistenciaMensualComponent implements OnInit {

  criteria!: string;
  entidades: any[] = [];
  selectedEntidad:number = 0;
  proyectos: any[] = [];
  selectedProyecto:number = 0;
  workers: any[] = [];
  selectedWorker:number = 0;
  dataSource: any[] = [];
  pageSizeMensual = 10;
  pageNumberMensual = 1;
  totalItemsMensual: any;
  fecha_desde = '';
  fecha_hasta = '';
  fecha_completa = '';
  showLoadingBar = false;
  paginationId = 'paginationMonthly';
  today = new Date();
  monthYear: any;
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
    this.selectedWorker = 0;
    this.numeroWorkers = 0;
    this.asistenciaService.getWorkers().subscribe((res: any) => {
      this.workers = res.map((item: any) => {
        return {'id': item.id, 'nombre': item.nombre + ' ' + item.apellidos}
      });
    })
  }

  loadProyectos = () => {
    this.proyectos = [];
    this.selectedProyecto = 0;
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
    this.selectedWorker = 0;
    this.numeroWorkers = 0;
  }

  cleanProyectos = () => {
    this.proyectos = [];
    this.selectedProyecto = 0;
    this.numeroProyectos = 0;
  }

  handlePageMensualChange = (event: number) => {
    this.pageNumberMensual = event;
    this.getAsistenciasMensuales();
  }

  dateRangeCreated(event: any) {
    this.pageNumberMensual=1;
    this.monthYear = moment(event);
    let month = this.getMonthDateRange(this.monthYear.year(), this.monthYear.month())
    this.fecha_desde = month.start.format('YYYY-MM-DD');
    this.fecha_hasta = month.end.format('YYYY-MM-DD');
    this.fecha_completa = this.fecha_desde+" - "+this.fecha_hasta;
    this.getAsistenciasMensuales();
  }

  getMonthDateRange = (year: any, month: any) => {
    let startDate = moment([year, month]);
    let endDate = moment(startDate).endOf('month');
    console.log(startDate.toDate());
    console.log(endDate.toDate());
    return { start: startDate, end: endDate };
  }

  getWorkersAndProyectByEntityId(){
    this.pageNumberMensual=1;
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
    this.getAsistenciasMensuales();
  }

  getEntityAndProyectsByWorker(){
    this.pageNumberMensual=1;
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
    this.cleanProyectos();
    let criteriopt = `de_trabajadores=${this.selectedWorker}&no_paginate`;
    this.proyectoService.getProyectoByWorker(criteriopt).subscribe((res: any) => {
      if(res.length <= 1){
        for(let t of res){this.selectedProyecto=t.id;}
      }else{
        this.selectedProyecto=0;
      }
      this.proyectos = res;
    });
    this.getAsistenciasMensuales();
  }

  getEntityAndWorkerByProyect(){
    this.pageNumberMensual=1;
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
    this.getAsistenciasMensuales();
  }

  getAsistenciasMensuales = () => {
    this.showLoadingBar = true;
    this.criteria = `entidades=${this.selectedEntidad}&fecha_desde=${this.fecha_desde}&fecha_hasta=${this.fecha_hasta}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}${this.search}`;
    this.asistenciaService.getAsistenciaCriteria(this.criteria).subscribe((res: any) => {
      let resumenes: any[] = [];
      for (const [key, value] of Object.entries(res)) {
        let response = value as any;
        let resumen = response.res;
        resumen.trab_id = response.data[0].trab_id;
        resumen.nomb_trab = response.data[0].nomb_trab;
        resumen.apell_trab = response.data[0].apell_trab;
        resumen.ent_nombre = response.data[0].ent_nombre;
        resumen.categ = response.data[0].categ;
        resumenes.push(resumen);
      }
      let paginate = this.commonService.paginateItems(resumenes, this.pageNumberMensual, this.pageSizeMensual);
      this.dataSource = paginate.data;
      this.totalItemsMensual = paginate.total;
      this.showLoadingBar = false;
    });
  }

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  searchAsitenciaByCriterio = () =>{
    this.pageNumberMensual=1;
    if(this.searchCrit!=''){this.search='&search='+this.searchCrit;}else{this.search='';}
    this.getAsistenciasMensuales();
  }

  exportToExcel = () => {
    this.showLoadingBar = true;
    this.criteria = `entidades=${this.selectedEntidad}&fecha_desde=${this.fecha_desde}&fecha_hasta=${this.fecha_hasta}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}${this.search}`;
    this.asistenciaService.getAsistenciaCriteria(this.criteria).subscribe((res: any) => {
      let resumenes: any[] = [];
      for (const [key, value] of Object.entries(res)) {
        let response = value as any;
        let resumen = response.res;
        resumen.trab_id = response.data[0].trab_id;
        resumen.nomb_trab = response.data[0].nomb_trab;
        resumen.apell_trab = response.data[0].apell_trab;
        resumen.ent_nombre = response.data[0].ent_nombre;
        resumen.categ = response.data[0].categ;
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
            F: 'Categoría',
            G: 'Total_de_asistencias',
            H: 'Total_de_faltas',
            I: 'Incapacidades',
            J: 'Total_descansos',
            K: 'Cotizados',
            L: 'Total_mes',
            M: 'Total_día_mes',
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
          G: item.asist,
          H: item.faltas,
          I: item.incap,
          J: item.desc,
          K: item.cotiz,
          L: item.tot_calc_mes,
          M: item.tot_dias_mes,
          N: ''
        });
      });
      edata.push(udt);
      let dia = moment(new Date()).format()
      this.exportService.exportEconomicReport(edata, 'Reporte asistencia mensual_'+dia);
      this.showLoadingBar = false;
    });

  }

  cleanFilters = () => {
    this.showLoadingBar = true;
    this.search = '';
    this.searchCrit = '';
    this.fecha_desde = '';
    this.fecha_hasta = '';
    this.fecha_completa = '';
    let resumenes: any[] = [];
    this.pageNumberMensual=1;
    let paginate = this.commonService.paginateItems(resumenes, this.pageNumberMensual, this.pageSizeMensual);
    this.dataSource = paginate.data;
    this.totalItemsMensual = paginate.total;
    this.cleanEntidades();
    this.cleanTrabajadores();
    this.cleanProyectos();
    this.ngOnInit();
    this.showLoadingBar = false;
  }
}
