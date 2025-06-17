import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonService} from "../../services/common.service";
import {EntidadesService} from "../../services/entidades.service";
import {TrabajadorService} from "../../services/trabajador.service";
import {ProyectoService} from "../../services/proyecto.service";
import {EconomicoService} from "../../services/economico.service";
import {CuotasPagablesComponent} from "../cuotas-pagables/cuotas-pagables.component";
import {DomSanitizer} from "@angular/platform-browser";
import {ExportService} from "../../services/export.service";
import {ExcelJson} from "../../interfaces/excel-json";
import * as moment from "moment";
import {CuotasService} from "../../services/cuotas.service";
import {PagosService} from "../../services/pagos.service";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import Swal from "sweetalert2";

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {

  entidades:any[]=[];
  trabajadores:any[]=[];
  proyectos:any[]=[];
  cuotasPagables:any[]=[];
  pagos:any[]=[];

  proyectosList:any[]=[];
  wntidadesList:any[]=[];
  trabajadoresList:any[]=[];
  cuotasPagablesList:any[]=[];


  fecha:string = '';

  disabledFilters:boolean = true;
  disabledFiltersTrabajadores:boolean = true;

  selectedEntidad:number=0;
  selectedProyecto:number=0;
  selectedTrabajador:number=0;
  selectedCuotas:number=0;
  selectedFecha:string='';
  selectedPago:number=0;

  numeroEntidades:boolean=false;
  numeroProyectos:boolean=false;
  numeroTrabajadores:boolean=false;

  selected:boolean=true;

  entidadString:string='';
  trabajadorString:string='';
  proyectoString:string='';
  mesString:string='';
  cuotaString:string='';

  paginationId = 'paginationDaily';
  paginationVisible = false;
  contentArray: any[] = [];
  returnedArray: any[] = [];

  showLoadingBar = false;

  modalRef?: BsModalRef;
  pageNumberMensual = 1;
  fecha_completa = '';
  monthYear: any;
  today = new Date();
  fecha_desde:any = '';
  fecha_hasta:any = '';

  entidadExport:string='';
  proyectoExport:string='';
  trabajadorExport:string='';
  cuotaPagoExport:string='';

  pagoProyectoId:any='';
  pagoEntidadId:any='';
  pagoTrabajadorId:any='';
  pagoCuotaPagoId:any='';
  pagoMes:string='';
  pagoMonto:number=0;

  constructor(private commonService: CommonService,
              private entidadService: EntidadesService,
              private trabajadoresService: TrabajadorService,
              private proyectoService: ProyectoService,
              private economicoService: EconomicoService,
              private cuotasService: CuotasService,
              private pagoService: PagosService,
              private domSanitizer: DomSanitizer,
              private exportService: ExportService,
              private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.loadEntidades();
    this.loadProyectos();
    this.loadTrabajadores();
    this.loadCuotasPagables();
  }

  loadEntidades = () => {
    this.entidadService.getEntitysList().subscribe((resE: any) => {
      this.entidades=resE;
      this.wntidadesList=resE;
    })
  }

  loadProyectos = () => {
    this.proyectoService.getProyectList().subscribe((resP: any) => {
      this.commonService.orderBy(resP,'nombre','asc');
      this.proyectos=resP;
      this.proyectosList=resP;
    });
  }

  loadTrabajadores = () => {
    this.trabajadoresService.getWorkersList().subscribe((resT: any) => {
      this.commonService.orderBy(resT,'nombre','asc');
      this.trabajadores=resT;
      this.trabajadoresList=resT;
    });
  }

  loadCuotasPagables = () => {
    this.cuotasService.getCuotasPagablesList().subscribe((resCP: any) => {
      this.cuotasPagables=resCP;
      this.cuotasPagablesList=resCP;
    });
  }

  dateCreated(event: any) {
    this.fecha = moment(event).format('YYYY-MM');
    this.getPagos();
  }

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
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
    this.getPagos();
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
    this.getPagos();
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
    this.getPagos();
  }

  getPagos = () => {
    this.showLoadingBar = true;
    if(this.selectedEntidad){this.entidadString='&entidad='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&proyecto='+this.selectedProyecto;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajador='+this.selectedTrabajador;}
    if(this.fecha){this.mesString='&cubre_mes='+this.fecha;}
    if(this.selectedCuotas){this.cuotaString='&cuota_pagable='+this.selectedCuotas;}
    const consulta = this.proyectoString+''+this.entidadString+''+this.trabajadorString+''+this.mesString+''+this.cuotaString;
    this.pagoService.getPagosList(consulta).subscribe((resPA: any) => {
      this.loadPaginate(resPA);
      this.paginationVisible = true;
      this.showLoadingBar = false;
    });

  }

  getTrabajadoresByEntidadModal = () => {
      this.trabajadoresList=[];
      this.trabajadoresService.getWorkersByEntity(this.pagoEntidadId).subscribe((resTR:any) => {
        this.trabajadoresList=resTR;
      });
  }

  deletePago = (pago:any) => {
    Swal.fire({
      title: '¿Deseas eliminar el pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pagoService.deletePay(pago.id).subscribe((resDelete: any) => {
          console.log("Eliminado",resDelete);
          this.getPagos();
          this.ngOnInit();
        });
      }
    })
    this.getPagos();
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

  exportToExcel = () => {
    if(this.selectedEntidad){this.entidadString='&entidad='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&proyecto='+this.selectedProyecto;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajador='+this.selectedTrabajador;}
    if(this.fecha){this.mesString='&cubre_mes='+this.fecha;}
    if(this.selectedCuotas){this.cuotaString='&cuota_pagable='+this.selectedCuotas;}
    const consulta = this.proyectoString+''+this.entidadString+''+this.trabajadorString+''+this.mesString+''+this.cuotaString;
    this.pagoService.getPagosList(consulta).subscribe((resPA: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          { // table headers
            A: 'Entidad',
            B: 'Proyecto',
            C: 'Trabajador',
            D: 'Cuota Pagable',
            E: 'Mes',
            F: 'Monto'
          },
        ],
        skipHeader: true,
      };
      resPA.forEach((item: any) => {
        this.entidadExport = '';
        this.proyectoExport = '';
        this.trabajadorExport = '';
        this.cuotaPagoExport = '';
        for(let enti of this.entidades){if(enti.id==item.entidad_id){this.entidadExport = enti.nombre}}
        for(let proy of this.proyectos){if(proy.id==item.proyecto_id){this.proyectoExport = proy.nombre}}
        for(let trab of this.trabajadores){if(trab.id==item.trabajador_id){this.trabajadorExport = trab.nombre+' '+trab.apellidos}}
        for(let cuot of this.cuotasPagables){if(cuot.id==item.cuota_pagable_id){this.cuotaPagoExport = cuot.nombre}}
        udt.data.push({
          A: this.entidadExport ,
          B: this.proyectoExport,
          C: this.trabajadorExport,
          D: this.cuotaPagoExport,
          E: item.cubre_mes,
          F: item.monto
        });
      });
      edata.push(udt);
      this.exportService.exportPagos(edata, 'Lista de Pagos');
    });
  }

  newPago = (template:TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
  }

  savePago = () => {
      if(this.pagoProyectoId){
        if(this.pagoEntidadId){
          if(this.pagoTrabajadorId){
            if(this.pagoCuotaPagoId){
              if(this.pagoMes){
                if(this.pagoMonto){
                  this.pagoMes = moment(this.pagoMes).format('YYYY-MM');
                  this.pagoService.addPago(this.pagoMonto,this.pagoMes,this.pagoEntidadId,this.pagoProyectoId,this.pagoCuotaPagoId,this.pagoTrabajadorId).subscribe((resI: any) => {
                    console.log("Incapacidad registrado ",resI );
                    this.closeModal();
                    this.getPagos();
                  });
                }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe de agregar un monto o cantidad de pago'});}
              }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar una fecha del mes'});}
            }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar una cuota de pago'});}
          }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar un trabajador'});}
        }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar una entidad'});}
      }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar un proyecto'});}
  }

  cleanFilters = () => {
    window.location.reload();
  }

  closeModal = () => {

    this.proyectosList=[];
    this.wntidadesList=[];
    this.trabajadoresList=[];
    this.cuotasPagablesList=[];

    this.pagoProyectoId='';
    this.pagoEntidadId='';
    this.pagoTrabajadorId='';
    this.pagoCuotaPagoId='';
    this.pagoMes='';
    this.pagoMonto=0;

    this.modalRef?.hide()

  }

}
