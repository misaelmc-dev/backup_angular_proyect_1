import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {CommonService} from "../../services/common.service";
import {EntidadesService} from "../../services/entidades.service";
import {ProyectoService} from "../../services/proyecto.service";
import {TrabajadorService} from "../../services/trabajador.service";
import {EconomicoService} from "../../services/economico.service";
import {ExportService} from "../../services/export.service";
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {ExcelJson} from "../../interfaces/excel-json";
import * as moment from "moment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-reporte-dias-laborados',
  templateUrl: './reporte-dias-laborados.component.html',
  styleUrls: ['./reporte-dias-laborados.component.css']
})
export class ReporteDiasLaboradosComponent implements OnInit {

  entidades:any[]=[];
  trabajadores:any[]=[];
  proyectos:any[]=[];
  reporte:any[]=[];

  disabledFilters:boolean = true;

  selectedEntidad:any='';
  selectedProyecto:any='';
  selectedTrabajador:any='';

  numeroEntidades:boolean=false;
  numeroProyectos:boolean=false;
  numeroTrabajadores:boolean=false;

  selected:boolean=true;

  entidadString:string='';
  trabajadorString:string='';
  proyectoString:string='';

  showLoadingBar = false;

  today = new Date();
  fecha_desde = '';
  fecha_hasta = '';

  paginationId = 'paginationDias';
  paginationVisible = false;
  contentArray: any[] = [];
  returnedArray: any[] = [];

  rangeMonthSelected:string = '';

  constructor(private commonService: CommonService,
              private entidadService: EntidadesService,
              private trabajadoresService: TrabajadorService,
              private proyectoService: ProyectoService,
              private economicService: EconomicoService,
              private domSanitizer: DomSanitizer,
              private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadProyectos();
    this.loadTrabajadores();
  }

  loadEntidades = () => {
    this.entidadService.getEntitysList().subscribe((resE: any) => {
      this.entidades = resE;
    })
  }

  loadProyectos = () => {
    this.proyectoService.getProyectList().subscribe((resP: any) => {
      this.orderBy(resP,'nombre','asc');
      this.proyectos = resP;
    });
  }

  loadTrabajadores = () => {
    this.trabajadoresService.getWorkersList().subscribe((resT: any) => {
      this.orderBy(resT,'nombre','asc');
      this.trabajadores = resT;
    });
  }

  getProyectosAndTrabajadoresByEntidad = () => {
    if(!this.selectedProyecto){
      this.numeroProyectos=false;
      this.proyectos=[];
      this.selectedProyecto='';
      this.proyectoService.getProyectsByEntity(this.selectedEntidad).subscribe((resPE:any) => {
        if(resPE.length==1){this.numeroProyectos=true;
        }else{this.numeroProyectos=false;}
        this.proyectos=resPE;
      });
    }
    if(!this.selectedTrabajador){
      this.numeroTrabajadores=false;
      this.trabajadores=[];
      this.selectedTrabajador='';
      this.trabajadoresService.getWorkersByEntity(this.selectedEntidad).subscribe((resTE:any) => {
        if(resTE.length==1){this.numeroTrabajadores=true;
        }else{this.numeroTrabajadores=false;}
        this.trabajadores=resTE;
      });
    }
    this.getEconomicReport();
  }

  getEntidadAndTrabajadorByProyecto(){
    if(!this.selectedEntidad){
      this.numeroEntidades=false;
      this.entidades=[];
      this.selectedEntidad='';
      this.entidadService.getEntitysByProyect(this.selectedProyecto).subscribe((resEP:any) => {
        if(resEP.length==1){this.numeroEntidades=true;
        }else{this.numeroEntidades=false;}
        this.entidades=resEP;
      });
    }
    if(!this.selectedTrabajador){
      this.numeroTrabajadores=false;
      this.trabajadores=[];
      this.selectedTrabajador='';
      this.proyectoService.getWorkersByProyect(this.selectedProyecto).subscribe((resTP:any) => {
        if(resTP.length==1){this.numeroTrabajadores=true;
        }else{this.numeroTrabajadores=false;}
        this.trabajadores=resTP;
      });
    }
    this.getEconomicReport();
  }

  getEntidadAndProyectoByTrabajador = () => {
    if(!this.selectedEntidad){
      this.numeroEntidades=false;
      this.entidades=[];
      this.selectedEntidad='';
      this.entidadService.getEntitysByWorker(this.selectedTrabajador).subscribe((resET:any) => {
        if(resET.length==1){this.numeroEntidades=true;
        }else{this.numeroEntidades=false;}
        this.entidades=resET;
      });
    }
    if(!this.selectedProyecto){
      this.numeroProyectos=false;
      this.proyectos=[];
      this.selectedProyecto='';
      this.proyectoService.getProyectsByWorker(this.selectedTrabajador).subscribe((resPT:any) => {
        if(resPT.length==1){this.numeroProyectos=true;
        }else{this.numeroProyectos=false;}
        this.proyectos=resPT;
      });
    }
    this.getEconomicReport();
  }

  getEconomicReport = () => {
    this.showLoadingBar = true;
    if(this.selectedEntidad){this.entidadString='&entidades='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&proyectos='+this.selectedProyecto;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+this.entidadString+''+this.proyectoString+''+this.trabajadorString;
    this.economicService.getReportEconomic(consulta).subscribe((resRE: any) => {
      this.reporte = resRE.data;
      this.paginationVisible = true;
      this.loadPaginate(this.reporte);
    });
    this.showLoadingBar = false;
  }

  exportToExcel(){
    if(this.selectedEntidad){this.entidadString='&entidades='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&proyectos='+this.selectedProyecto;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+this.entidadString+''+this.proyectoString+''+this.trabajadorString;
    this.economicService.getReportEconomic(consulta).subscribe((resRE: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'' },
          { // table headers
            A: '',
            B: 'Entidad',
            C: 'Id',
            D: 'Nombre del trabajador',
            E: 'NSS',
            F: 'SBC',
            G: 'Días Laborados',
            H: ''
          },
        ],
        skipHeader: true,
      };
      let arrayToExcel = [];
      for(let e of resRE.data){
        for(let t of this.trabajadores){
          if(e.trab_id == t.id){
            var nombre_completo = e.nomb_trab+''+e.apell_trab
            arrayToExcel.push({
              entidad:t.entidades[0].nombre,
              id_trab:t.id,
              nombre:nombre_completo,
              nss:e.nss,
              sbc:e.sbc,
              dias_lab:e.tot_lab})
          }
        }
      }
      arrayToExcel.forEach((item: any) => {
        udt.data.push({
          A: '',
          B: item.entidad,
          C: item.id_trab,
          D: item.nombre,
          E: item.nss,
          F: item.sbc,
          G: item.dias_lab,
          H: ''
        });
      });
      edata.push(udt);
      let dia = moment(new Date()).format()
      this.exportService.exportEconomicReport(edata, 'Reporte de dias laborados_'+dia);
    });
  }

  cleanFilters = () => {
    window.location.reload();
  }

  restaFechas = (f1:any,f2:any) => {
    var aFecha1=f1.split('/');
    var aFecha2=f2.split('/');
    var fFecha1=Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
    var fFecha2=Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
    var dif=fFecha2-fFecha1;
    var dias=Math.floor(dif/(1000*60*60*24));
    return dias;
  }

  dateRangeCreated(event: any) {
    var mes = moment(event);
    let rangoMes = this.getMonthDateRange(mes.year(), mes.month())
    this.fecha_desde = rangoMes.start.format('YYYY-MM-DD')
    this.fecha_hasta = rangoMes.end.format('YYYY-MM-DD')
    this.rangeMonthSelected = this.fecha_desde+" - "+this.fecha_hasta;
    this.disabledFilters=false;
  }

  getMonthDateRange = (year: any, month: any) => {
    let startDate = moment([year, month]);
    let endDate = moment(startDate).endOf('month');
    return { start: startDate, end: endDate };
  }

  onOpenCalendar(container: any){
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  orderBy = (sin_orden:any,campo:string,orden:string) => {
    let con_orden:any[]=sin_orden;
    con_orden.sort((n1,n2) => {
      if(campo=='Nombre'){
        if(orden=='asc'){
          if(n1.nombre>n2.nombre){return 1;}
          if(n1.nombre<n2.nombre){return -1;}
        }else if(orden=='desc'){
          if(n1.nombre<n2.nombre){return 1;}
          if(n1.nombre>n2.nombre){return -1;}
        }
      }
      if(campo=='id'){
        if(orden=='asc'){
          if(n1.id>n2.id){return 1;}
          if(n1.id<n2.id){return -1;}
        }else if(orden=='desc'){
          if(n1.id<n2.id){return 1;}
          if(n1.id>n2.id){return -1;}
        }
      }
      return 0;
    });
  }

  loadPaginate = (data:any) => {
    this.contentArray = data;
    this.returnedArray = this.contentArray.slice(0, 10);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
  }

}
