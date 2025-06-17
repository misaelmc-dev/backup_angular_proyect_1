import {Component, OnInit, TemplateRef} from '@angular/core';
import {CommonService} from "../../services/common.service";
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
  selector: 'app-reporte-cuotas-imss-pagadas',
  templateUrl: './reporte-cuotas-imss-pagadas.component.html',
  styleUrls: ['./reporte-cuotas-imss-pagadas.component.css']
})
export class ReporteCuotasImssPagadasComponent implements OnInit {

  entidades:any[]=[];
  trabajadores:any[]=[];
  proyectos:any[]=[];

  cuotasPag:any[]=[];
  cuotasEst:any[]=[];
  totCuotasPag:any[]=[];
  detailePagos:any[]=[];

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

  paginationId = 'paginationImssPagadas';
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
    this.getEconomicReportImssPagadas();
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
    this.getEconomicReportImssPagadas();
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
    this.getEconomicReportImssPagadas();
  }

  getEconomicReportImssPagadas = () => {
    if(this.selectedEntidad){this.entidadString='&entidades='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&proyectos='+this.selectedProyecto;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+this.entidadString+''+this.proyectoString+''+this.trabajadorString;
    this.economicoService.getReportEconomic(consulta).subscribe((resREI: any) => {
      this.paginationVisible = true;
      this.cuotasPag = resREI.res_cuotas_pag;
      this.cuotasEst = resREI.res_cuotas_est;
      this.totCuotasPag = resREI.tot_cuotas_pag;
      this.loadPaginate(resREI.data);
    });
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
          { // table headers
            A: 'Id',
            B: 'Nombre del trabajador',
            C: 'SBC',
            D: 'Días laborados',
            E: 'Total cuotas IMSS pagadas'
          },
        ],
        skipHeader: true,
      };
      resREI.data.forEach((item: any) => {
        udt.data.push({
          A: item.id_rel_lab,
          B: item.nomb_trab+' '+item.apell_trab,
          C: item.sbc,
          D: item.tot_lab,
          E: item.tot_pagad
        });
      });
      edata.push(udt);
      this.exportService.exportReporte(edata, 'Reporte de cuotas IMSS pagadas');
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
    this.entidadString='';
    this.trabajadorString='';
    this.proyectoString='';

    this.paginationVisible = false;
    this.contentArray = [];
    this.returnedArray = [];
    this.disabledFiltersTrabajadores = true
    this.ngOnInit();
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

  dateRangeCreated = (event:any) => {
    this.fecha_desde = event[0].toJSON().split('T')[0];
    this.fecha_hasta = event[1].toJSON().split('T')[0];
    var f1 = moment(this.fecha_desde).format('DD/MM/YYYY');;
    var f2 = moment(this.fecha_hasta).format('DD/MM/YYYY');;
    var dias = this.restaFechas(f1,f2);
    if(dias<=60){
      this.disabledFilters = false;
      //this.getEconomicReport();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Filtrado no valido',
        text: 'El periodo máximo de búsqueda es de 2 meses'
      });
    }
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

  showDetails = (template: TemplateRef<any>,worker:any) => {
    this.nombreTrabajador = worker.nomb_trab+' '+worker.apell_trab;
    this.detailePagos = worker.pagos;
    this.modalRef = this.modalService.show(template);
  }

}
