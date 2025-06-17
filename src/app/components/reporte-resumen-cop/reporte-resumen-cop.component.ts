import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {TrabajadorService} from "../../services/trabajador.service";
import {EconomicoService} from "../../services/economico.service";
import {ExportService} from "../../services/export.service";
import {BsModalRef} from "ngx-bootstrap/modal";
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {EntidadesService} from "../../services/entidades.service";
import {ProyectoService} from "../../services/proyecto.service";
import * as moment from "moment";
import Swal from "sweetalert2";
import {ExcelJson} from "../../interfaces/excel-json";
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-reporte-resumen-cop',
  templateUrl: './reporte-resumen-cop.component.html',
  styleUrls: ['./reporte-resumen-cop.component.css']
})

export class ReporteResumenCopComponent implements OnInit {

  entidades:any[]=[];
  trabajadores:any[]=[];
  proyectos:any[]=[];

  cuotasPag:any[]=[];
  totCuotasEst:number=0;
  totCuotasPag:number=0;

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

  modalRef?: BsModalRef;

  cuotaImms:number=9;
  cuotaDiff:number=9;

  rangeMonthSelected:string='';

  constructor(private commonService: CommonService,
              private entidadService: EntidadesService,
              private trabajadoresService: TrabajadorService,
              private proyectoService: ProyectoService,
              private economicoService: EconomicoService,
              private exportService: ExportService,
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
        console.log("this.trabajadores",this.trabajadores)
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

  getEconomicReportImssPagadas(){
    this.showLoadingBar = true;
    if(this.selectedEntidad){this.entidadString='&entidades='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&proyectos='+this.selectedProyecto;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+this.entidadString+''+this.proyectoString+''+this.trabajadorString;
    this.economicoService.getReportEconomic(consulta).subscribe((resREI: any) => {
      this.paginationVisible = true;
      this.cuotasPag = resREI.res_cuotas_pag;
      this.totCuotasEst = resREI.res_cuotas_est.total_cuot_imss;
      this.totCuotasPag = resREI.tot_cuotas_pag;
      this.loadPaginate(resREI.data);
    });
    this.showLoadingBar = false;
  }

  exportToExcel(){
    if(this.selectedEntidad){this.entidadString='&entidades='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&proyectos='+this.selectedProyecto;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+this.entidadString+''+this.proyectoString+''+this.trabajadorString+'&entidades=';
    this.economicoService.getReportEconomic(consulta).subscribe((resREI: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'' },
          { // table headers
            A: '',
            B: 'Entidad',
            C: 'Nombre del trabajador',
            D: 'NSS',
            E: 'SBC',
            F: 'Días laborados',
            G: 'Días cotizados',
            H: 'Diferencia de días',
            I: 'Cuotas IMSS',
            J: 'Cuotas IMSS pagadas',
            K: 'Diferencia de cuotas',
            L: ''
          },
        ],
        skipHeader: true,
      };
      if(resREI.data.length>0){
        let arrayToExcel = [];
        for(let e of resREI.data){
          for(let t of this.trabajadores){
            if(e.trab_id == t.id){
              var nombre_completo = e.nomb_trab+''+e.apell_trab
              const diferencia_dias = (e.tot_lab - e.tot_dias_pagad);
              const cuotas = (e.tot_presuntivo_pagad_sua - e.tot_pagad)
              const diferencia_cuotas = cuotas.toFixed(2);
              arrayToExcel.push({entidad:t.entidades[0].nombre,
                                nombre:nombre_completo,
                                nss:e.nss,
                                sbc:e.sbc,
                                dias_lab:e.tot_lab,
                                dias_pagad:e.tot_dias_pagad,
                                diff_dias:diferencia_dias,
                                cuot_imss:e.tot_presuntivo_pagad_sua,
                                cuot_pagad:e.tot_pagad,
                                diff_cuotas:diferencia_cuotas})
            }
          }
        }
        arrayToExcel.forEach((item: any) => {
          udt.data.push({
            A: '',
            B: item.entidad,
            C: item.nombre,
            D: item.nss,
            E: item.sbc,
            F: item.dias_lab,
            G: item.dias_pagad,
            H: item.diff_dias,
            I: item.cuot_imss,
            J: item.cuot_pagad,
            K: item.diff_cuotas,
            L: '',
          });
        });
        edata.push(udt);
        let dia = moment(new Date()).format()
        this.exportService.exportEconomicReport(edata, 'Reporte de cuotas obrero patronales_'+dia);
      }
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
    this.totCuotasPag=0;
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

  loadPaginate = (data:any) => {
    this.contentArray = data;
    this.returnedArray = this.contentArray.slice(0, 10);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
  }

  diferenciaValida(valor1:number,valor2:number){
    var estilo:boolean = true;
    var diferencia = valor2-valor1
    if(diferencia>0){
      estilo = true;
    }else{
      estilo = false;
    }
    return estilo;
  }

  onOpenCalendar(container: any){
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  dateStringToIso8601Start(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').startOf('day').valueOf())).toISOString()
  }

  dateStringToIso8601End(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').endOf('day').valueOf())).toISOString()
  }

}
