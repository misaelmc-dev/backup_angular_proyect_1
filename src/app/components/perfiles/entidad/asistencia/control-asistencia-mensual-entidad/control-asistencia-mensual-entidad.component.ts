import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../../../../services/common.service";
import {AsistenciaService} from "../../../../../services/asistencia.service";
import * as moment from "moment";
import {TrabajadorService} from "../../../../../services/trabajador.service";
import {ExcelJson} from "../../../../../interfaces/excel-json";
import {ExportService} from "../../../../../services/export.service";
import {ProyectoService} from "../../../../../services/proyecto.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-control-asistencia-mensual-entidad',
  templateUrl: './control-asistencia-mensual-entidad.component.html',
  styleUrls: ['./control-asistencia-mensual-entidad.component.css']
})
export class ControlAsistenciaMensualEntidadComponent implements OnInit {

  entidadId: number
  criteria!: string;
  proyectos: any[] = [];
  selectedProyecto = '';
  workers: any[] = [];
  selectedWorker = '';
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
  numeroWorkers: number = 0;
  searchCrit:string = '';

  constructor(private commonService: CommonService,
              private asistenciaService: AsistenciaService,
              private trabajadorService: TrabajadorService,
              private exportService: ExportService,
              private proyectoService: ProyectoService,
              private route: ActivatedRoute)
  {
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

  handlePageMensualChange = (event: number) => {
    this.pageNumberMensual = event;
    this.getAsistenciasMensuales();
  }

  dateRangeCreated(event: any) {
    this.monthYear = moment(event);
    let month = this.getMonthDateRange(this.monthYear.year(), this.monthYear.month())
    this.fecha_desde = month.start.format('YYYY-MM-DD');
    this.fecha_hasta = month.end.format('YYYY-MM-DD');
    this.fecha_completa = this.fecha_desde+" - "+this.fecha_hasta;
    this.getAsistenciasMensuales();
  }

  getMonthDateRange = (year: any, month: any) => {
    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    let startDate = moment([year, month]);

    // Clone the value before .endOf()
    let endDate = moment(startDate).endOf('month');

    // just for demonstration:
    console.log(startDate.toDate());
    console.log(endDate.toDate());

    // make sure to call toDate() for plain JavaScript date type
    return { start: startDate, end: endDate };
  }

  getEntityAndProyectsByWorker = () => {
    this.cleanProyectos();
    let criteriopt = `de_trabajadores=${this.selectedWorker}&de_entidad=${this.entidadId}&no_paginate`;
    this.proyectoService.getProyectoByWorker(criteriopt).subscribe((res: any) => {
      if(res.length == 1){ this.numeroProyectos = 1;}
      else{this.numeroProyectos = 0;}
      this.proyectos = res;
    });
    this.getAsistenciasMensuales();
  }

  getEntityAndWorkerByProyect = () => {
    this.cleanTrabajadores();
    let criteriotp = `de_proyecto=${this.selectedProyecto}&de_entidad=${this.entidadId}&no_paginate`;
    this.trabajadorService.getWorkers(criteriotp).subscribe((res: any) => {
      if(res.length <= 1){ this.numeroWorkers = 1;}
      else{this.numeroWorkers = 0;}
      this.workers = res;
    });
    this.getAsistenciasMensuales();
  }

  getAsistenciasMensuales = () => {
    this.showLoadingBar = true;
    this.criteria = `entidades=${this.entidadId}&fecha_desde=${this.fecha_desde}&fecha_hasta=${this.fecha_hasta}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}&search=${this.searchCrit}`;
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
    }, () => {
      this.showLoadingBar = false;
    });
  }

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  searchAsitenciaByCriterio = (criterioSearch: any) =>{
    this.searchCrit = criterioSearch ;
    this.getAsistenciasMensuales();
  }

  exportToExcel = () => {
    this.showLoadingBar = true;
    this.criteria = `entidades=${this.entidadId}&fecha_desde=${this.fecha_desde}&fecha_hasta=${this.fecha_hasta}&trabajadores=${this.selectedWorker}&proyectos=${this.selectedProyecto}&search=${this.searchCrit}`;
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
          {
            A: 'Id',
            B: 'Nombre',
            C: 'Apellidos',
            D: 'Entidad',
            E: 'Categoría',
            F: 'Total_de_asistencias',
            G: 'Total_de_faltas',
            H: 'Incapacidades',
            I: 'Total_descansos',
            J: 'Cotizados',
            K: 'Total_mes',
            L: 'Total_día_mes'
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
          F: item.asist,
          G: item.faltas,
          H: item.incap,
          I: item.desc,
          J: item.cotiz,
          K: item.tot_calc_mes,
          L: item.tot_dias_mes
        });
      });
      edata.push(udt);
      this.exportService.exportJsonToExcel(edata, 'Reporte_Asistencia_Mensual');
      this.showLoadingBar = false;
    }, () => {
      this.showLoadingBar = false;
    });

  }

  cleanFilters = () => {
    this.showLoadingBar = true;

    this.fecha_desde = '';
    this.fecha_hasta = '';
    this.fecha_completa = '';
    let resumenes: any[] = [];
    let paginate = this.commonService.paginateItems(resumenes, this.pageNumberMensual, this.pageSizeMensual);
    this.dataSource = paginate.data;
    this.totalItemsMensual = paginate.total;

    this.cleanTrabajadores();
    this.cleanProyectos();
    this.ngOnInit();
    this.showLoadingBar = false;
  }
}
