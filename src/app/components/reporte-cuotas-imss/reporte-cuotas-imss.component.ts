import {Component, OnInit, TemplateRef} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {AsistenciaService} from "../../services/asistencia.service";
import {TrabajadorService} from "../../services/trabajador.service";
import {EconomicoService} from "../../services/economico.service";
import {ExportService} from "../../services/export.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {EntidadesService} from "../../services/entidades.service";
import {ProyectoService} from "../../services/proyecto.service";
import {DomSanitizer} from "@angular/platform-browser";

import * as moment from "moment";
import Swal from "sweetalert2";
import {ExcelJson} from "../../interfaces/excel-json";

@Component({
  selector: 'app-reporte-cuotas-imss',
  templateUrl: './reporte-cuotas-imss.component.html',
  styleUrls: ['./reporte-cuotas-imss.component.css']
})
export class ReporteCuotasImssComponent implements OnInit {

  calculos:any=[];
  entidades:any[]=[];
  trabajadores:any[]=[];
  proyectos:any[]=[];
  filtroIMSS:any[]=[];

  disabledFilters:boolean = true;
  disabledFiltersTrabajadores:boolean = true;

  selectedEntidad:number=0;
  selectedProyecto:number=0;
  selectedTrabajador:number=0;

  numeroEntidades:boolean=false;
  numeroProyectos:boolean=false;
  numeroTrabajadores:boolean=false;

  selected:boolean=true;

  entidadString:string='';
  trabajadorString:string='';
  proyectoString:string='';

  paginationId = 'paginationDaily';
  paginationVisible = false;
  contentArray: any[] = [];
  returnedArray: any[] = [];

  showLoadingBar = false;

  today = new Date();
  fecha_desde = '';
  fecha_hasta = '';
  rangoFechas='';

  nombreTrabajador = "";
  details: any;

  modalRef?: BsModalRef;

  primaNombre:string = '';
  primaValor:number = 0;
  primaPorciento:boolean = false;
  salarioNombre:string = '';
  salarioValor:number = 0;
  salarioPorciento:boolean = false;
  umaNombre:string = '';
  umaValor:number = 0;
  umaPorciento:boolean = false;

  totCuotasEst:number=0;

  rangeMonthSelected:string = '';

  constructor(private commonService: CommonService,
              private entidadService: EntidadesService,
              private trabajadoresService: TrabajadorService,
              private proyectoService: ProyectoService,
              private economicoService: EconomicoService,
              private domSanitizer: DomSanitizer,
              private exportService: ExportService,
              private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.loadCalculos();
    this.loadEntidades();
    this.loadProyectos();
    this.loadTrabajadores();
  }

  loadCalculos = () => {
    this.economicoService.getVariablesDeCalculo().subscribe((res: any) => {
      for(let calculo of res){
        if(calculo.nombre=="Prima Riesgo de Trabajo"){
          this.primaNombre = calculo.nombre;
          this.primaValor = calculo.valor;
          this.primaPorciento = calculo.es_porciento;
        }else if(calculo.nombre=="Salario Diario Mínimo General (SMG)"){
          this.salarioNombre = calculo.nombre;
          this.salarioValor = calculo.valor;
          this.salarioPorciento = calculo.es_porciento;
        }else if(calculo.nombre=="UMA"){
          this.umaNombre = calculo.nombre;
          this.umaValor = calculo.valor;
          this.umaPorciento = calculo.es_porciento;
        }
      }
      this.calculos = res;
    });
  }

  loadEntidades = () => {
    this.entidadService.getEntitysList().subscribe((resE: any) => {
      this.entidades = resE;
    })
  }

  loadProyectos = () => {
    this.proyectoService.getProyectList().subscribe((resP: any) => {
      this.commonService.orderBy(resP,'nombre','asc');
      this.proyectos = resP;
    });
  }

  loadTrabajadores = () => {
    this.trabajadoresService.getWorkersList().subscribe((resT: any) => {
      this.commonService.orderBy(resT,'nombre','asc');
      this.trabajadores = resT;
    });
  }

  getProyectosAndTrabajadoresByEntidad = () => {
    if(!this.selectedProyecto){
      this.numeroProyectos=false;
      this.proyectos=[];
      this.selectedProyecto=0;
      this.proyectoService.getProyectsByEntity(this.selectedEntidad).subscribe((resPE:any) => {
        if(resPE.length==1){this.numeroProyectos=true;
        }else{this.numeroProyectos=false;}
        this.proyectos=resPE;
      });
    }
    if(!this.selectedTrabajador){
      this.numeroTrabajadores=false;
      this.trabajadores=[];
      this.selectedTrabajador=0;
      this.trabajadoresService.getWorkersByEntity(this.selectedEntidad).subscribe((resTE:any) => {
        if(resTE.length==1){this.numeroTrabajadores=true;
        }else{this.numeroTrabajadores=false;}
        this.trabajadores=resTE;
      });
    }
    this.disabledFiltersTrabajadores=false;
    this.getEconomicReportIMSS();
  }

  getEntidadAndTrabajadorByProyecto(){
    if(!this.selectedEntidad){
      this.numeroEntidades=false;
      this.entidades=[];
      this.selectedEntidad=0;
      this.entidadService.getEntitysByProyect(this.selectedProyecto).subscribe((resEP:any) => {
        if(resEP.length==1){this.numeroEntidades=true;
        }else{this.numeroEntidades=false;}
        this.entidades=resEP;
      });
    }
    if(!this.selectedTrabajador){
      this.numeroTrabajadores=false;
      this.trabajadores=[];
      this.selectedTrabajador=0;
      this.proyectoService.getWorkersByProyect(this.selectedProyecto).subscribe((resTP:any) => {
        if(resTP.length==1){this.numeroTrabajadores=true;
        }else{this.numeroTrabajadores=false;}
        this.trabajadores=resTP;
      });
    }
    this.disabledFiltersTrabajadores=false;
    this.getEconomicReportIMSS();
  }

  getEntidadAndProyectoByTrabajador = () => {
    if(!this.selectedEntidad){
      this.numeroEntidades=false;
      this.entidades=[];
      this.selectedEntidad=0;
      this.entidadService.getEntitysByWorker(this.selectedTrabajador).subscribe((resET:any) => {
        if(resET.length==1){this.numeroEntidades=true;
        }else{this.numeroEntidades=false;}
        this.entidades=resET;
      });
    }
    if(!this.selectedProyecto){
      this.numeroProyectos=false;
      this.proyectos=[];
      this.selectedProyecto=0;
      this.proyectoService.getProyectsByWorker(this.selectedTrabajador).subscribe((resPT:any) => {
        if(resPT.length==1){this.numeroProyectos=true;
        }else{this.numeroProyectos=false;}
        this.proyectos=resPT;
      });
    }
    this.getEconomicReportIMSS();
  }

  getEconomicReportIMSS = () => {
    this.showLoadingBar = true;
    if(this.selectedEntidad){this.entidadString='&entidades='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&proyectos='+this.selectedProyecto;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+this.entidadString+''+this.proyectoString+''+this.trabajadorString;
    this.economicoService.getReportEconomic(consulta).subscribe((resREI: any) => {
      this.paginationVisible = true;
      this.loadPaginate(resREI.data);
    });
    this.showLoadingBar = false;
  }

  openCuotasModal = (template: TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
  }

  changePorciento = (clave:number,activo:string) => {
    if(clave==1){
      if(activo=='T'){this.primaPorciento = false ;
      }else{this.primaPorciento = true ;}
    }else if(clave==2){
      if(activo=='T'){this.salarioPorciento = false ;
      }else{this.salarioPorciento = true ;}
    }else if(clave==3){
      if(activo=='T'){this.umaPorciento = false ;
      }else{this.umaPorciento = true ;}
    }
  }

  updateCuotaSIMSS = () => {
    this.economicoService.updateCuotasIMSS(1,this.primaValor).subscribe((res: any) => {console.log("Prima Riesgo de Trabajo",res)});
    this.economicoService.updateCuotasIMSS(2,this.salarioValor).subscribe((res: any) => {console.log("Salario Diario Mínimo General (SMG)",res)});
    this.economicoService.updateCuotasIMSS(3,this.umaValor ).subscribe((res: any) => {console.log("UMA",res)});
    this.loadCalculos();
    this.modalRef?.hide();
  }

  exportToExcel = () => {
    if(this.selectedEntidad){this.entidadString='&entidades='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&proyectos='+this.selectedProyecto;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+this.entidadString+''+this.proyectoString+''+this.trabajadorString;
    this.economicoService.getReportEconomic(consulta).subscribe((resREI: any) => {
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
            H: 'Total cuota IMSS',
            I: ''
          },
        ],
        skipHeader: true,
      };
      let arrayToExcel = [];
      for(let e of resREI.data){
        for(let t of this.trabajadores){
          if(e.trab_id == t.id){
            var nombre_completo = e.nomb_trab+''+e.apell_trab
            const cuotas = e.tot_presuntivo_pagad_sua
            const cuota = cuotas.toFixed(2);
            arrayToExcel.push({
              entidad:t.entidades[0].nombre,
              id_trab:t.id,
              nombre:nombre_completo,
              nss:e.nss,
              sbc:e.sbc,
              dias_lab:e.tot_lab,
              cuota_imss:cuota})
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
          H: item.cuota_imss,
          I: ''
        });
      });
      edata.push(udt);
      let dia = moment(new Date()).format()
      this.exportService.exportEconomicReport(edata, 'Reporte de cuotas IMSS_'+dia);
    });
  }

  cleanFilters = () => {
    this.entidades=[];
    this.trabajadores=[];
    this.proyectos=[];
    this.disabledFilters=true;
    this.selectedEntidad=0;
    this.selectedProyecto=0;
    this.selectedTrabajador=0;
    this.numeroEntidades=false;
    this.numeroProyectos=false;
    this.numeroTrabajadores=false;
    this.selected=true;
    this.entidadString='';
    this.trabajadorString='';
    this.proyectoString='';
    this.showLoadingBar=false;
    this.today=new Date();
    this.fecha_desde='';
    this.fecha_hasta='';
    this.rangoFechas='';
    this.rangeMonthSelected='';
    this.entidadString='';
    this.trabajadorString='';
    this.proyectoString='';
    this.paginationVisible = false;
    this.contentArray = [];
    this.returnedArray = [];
    this.totCuotasEst=0;
    this.ngOnInit();
    this.disabledFiltersTrabajadores = true
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

  loadPaginate = (data:any) => {
    this.contentArray = data;
    this.returnedArray = this.contentArray.slice(0, 10);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
  }

  showDetails = (template: TemplateRef<any>, worker: any) => {
    this.nombreTrabajador = '';
    this.nombreTrabajador = worker.nomb_trab+' '+worker.apell_trab;
    this.details = worker.cuotas_est;
    this.modalRef = this.modalService.show(template);
  }

}
