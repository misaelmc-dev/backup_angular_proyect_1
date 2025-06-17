import {Component, OnInit, SecurityContext, TemplateRef} from '@angular/core';
import {TrabajadorService} from "../../services/trabajador.service";
import {EntidadesService} from "../../services/entidades.service";
import {IncapacidadService} from "../../services/incapacidad.service";
import {CommonService} from "../../services/common.service";
import {ExcelJson} from "../../interfaces/excel-json";
import {ExportService} from "../../services/export.service";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {DomSanitizer} from "@angular/platform-browser";
import {BsModalService} from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import * as moment from "moment";

@Component({
  selector: 'app-incapacidades',
  templateUrl: './incapacidades.component.html',
  styleUrls: ['./incapacidades.component.css']
})
export class IncapacidadesComponent implements OnInit {

  entidades:any[]=[];
  trabajadores:any[]=[];
  incapacidades:any[]=[];
  entidadesList:any[]=[];
  trabajadoresList:any[]=[];

  numeroEntidades:boolean=false;
  numeroTrabajadores:boolean=false;

  selectedEntidad:any=0;
  selectedTrabajador:any=0;

  entidadString:string='';
  trabajadorString:string='';
  consulta:string='';

  selected:boolean = true;
  disabled:string = 'disabled';


  paginationId = 'paginationIncapacity';
  paginationVisible = false;
  contentArray: any[] = [];

  modalRef: any;

  incapacidadId:any='';
  incapacidadTrabajadorId:any='';
  incapacidadEntidadId:any='';
  incapacidadMotivo:string='';
  incapacidadFechaInicio:string='';
  incapacidadFechaFin:string='';
  incapacidadFile:any;

  constructor(private commonService: CommonService,
              private trabajadorService: TrabajadorService,
              private entidadService: EntidadesService,
              private incapacidadesService: IncapacidadService,
              private domSanitizer: DomSanitizer,
              private exportService: ExportService,
              private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadTrabajadores();
  }

  loadEntidades = () => {
    this.entidadService.getEntidadesList().subscribe((resE: any) => {
      this.commonService.orderBy(resE, 'nombre','asc');
      this.entidades = resE;
      this.entidadesList = resE;
    })
  }

  loadTrabajadores = () => {
    this.trabajadorService.getWorkersList().subscribe((resT:any) => {
      this.commonService.orderBy(resT, 'nombre','asc');
      this.trabajadores = resT;
      this.trabajadoresList = resT;
    });
  }

  getTrabajadoresByEntidad(){
    if(!this.selectedTrabajador){
      this.trabajadores=[];
      this.trabajadorService.getWorkersByEntity(this.selectedEntidad).subscribe((resTR:any) => {
        if(resTR.length <= 1){
          for(let t of resTR){this.selectedTrabajador=t.id;}
        }else{
          this.selectedTrabajador=0;
        }
        this.trabajadores=resTR;
      });
    }
    this.getIncapacidadesList();
  }

  getTrabajadoresByEntidadModal = () => {
    this.trabajadorService.getWorkersByEntity(this.incapacidadEntidadId).subscribe((resTR:any) => {
      this.trabajadoresList=resTR;
    });
  }

  getEntidadByTrabajador = () => {
    if(!this.selectedEntidad){
      this.entidades=[];
      this.entidadService.getEntityByWorker(this.selectedTrabajador).subscribe((resET: any) => {
        if(resET.length <= 1){
          for(let t of resET){this.selectedEntidad=t.id;}
        }else{
          this.selectedEntidad=0;
        }
        this.entidades=resET;
        console.log("this.entidades",this.entidades)
      });
    }
    this.getIncapacidadesList();
  }

  getIncapacidadesList = () => {
    this.incapacidades = [];
    if(this.selectedEntidad){this.entidadString='&de_entidad='+this.selectedEntidad;}
    if(this.selectedTrabajador){this.trabajadorString='&de_trabajador='+this.selectedTrabajador;}
    this.consulta = ''+this.entidadString+''+this.trabajadorString;
    this.incapacidadesService.getIncapacitisList(this.consulta).subscribe((resI: any) => {
      this.incapacidades = resI;
      this.loadPaginate(this.incapacidades);
    });
  }

  addIncapacidadModal = (template: TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
  }

  addIncapacidad = () => {
    if(this.incapacidadEntidadId){
      if(this.incapacidadTrabajadorId){
        if(this.incapacidadFile){
          if(this.incapacidadFechaInicio){
            this.incapacidadFechaInicio = moment(this.incapacidadFechaInicio).format('YYYY-MM-DD');
            if(this.incapacidadFechaFin){
              this.incapacidadFechaFin = moment(this.incapacidadFechaFin).format('YYYY-MM-DD');
              if(this.incapacidadMotivo){
                this.incapacidadesService.addIncapacity(this.incapacidadTrabajadorId,this.incapacidadEntidadId,this.incapacidadMotivo,this.incapacidadFechaInicio,this.incapacidadFechaFin,this.incapacidadFile).subscribe((resI: any) => {
                  console.log("Incapacidad registrado ",resI );
                  this.closeModal();
                  this.getIncapacidadesList();
                });
              }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe de agregar una pequeña descripcion de motivo de incapacidad'});}
            }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar una fecha de fin'});}
          }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar una fecha de inicio'});}
        }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar un documento'});}
      }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar un trabajador'});}
    }else{Swal.fire({icon:'error',title: 'No se pudo registrar',text:'Debe seleccionar una entidad'});}
  }

  updateIncapacidadModal = (template: TemplateRef<any>,incapacidad:any) => {
    this.loadTrabajadores();
    this.incapacidadId=incapacidad.id;
    this.incapacidadTrabajadorId=incapacidad.trabajador.id;
    this.incapacidadEntidadId=incapacidad.entidad.id;
    this.incapacidadMotivo=incapacidad.motivo;
    this.incapacidadFechaInicio=incapacidad.fecha_inicio;
    this.incapacidadFechaFin=incapacidad.fecha_fin;
    this.incapacidadFile=incapacidad.archivo_url;
    this.modalRef = this.modalService.show(template);
  }

  updateIncapacidad = () => {
    if(this.incapacidadFechaInicio){
      this.incapacidadFechaInicio = moment(this.incapacidadFechaInicio).format('YYYY-MM-DD');
      if(this.incapacidadFechaFin){
        this.incapacidadFechaFin = moment(this.incapacidadFechaFin).format('YYYY-MM-DD');
        if(this.incapacidadMotivo){
          console.log("Id",this.incapacidadId,"Motivo",this.incapacidadMotivo,"fecha inicio",this.incapacidadFechaInicio,"fecha final",this.incapacidadFechaFin);
          this.incapacidadesService.updateIncapacity(this.incapacidadId,this.incapacidadMotivo,this.incapacidadFechaInicio,this.incapacidadFechaFin).subscribe((resI: any) => {
            console.log("Incapacidad actualizado ", resI );
            this.closeModal();
            this.getIncapacidadesList();
          });
        }else{Swal.fire({icon:'error',title: 'No se pudo actualizar',text:'Debe de agregar una pequeña descripcion de motivo de incapacidad'});}
      }else{Swal.fire({icon:'error',title: 'No se pudo actualizar',text:'Debe seleccionar una fecha de fin'});}
    }else{Swal.fire({icon:'error',title: 'No se pudo actualizar',text:'Debe seleccionar una fecha de inicio'});}
  }

  deleteIncapacidad = (incapacidad:any) => {
    Swal.fire({
        title: '¿Deseas eliminar la incapacidad?',
        text: 'Id:'+incapacidad.id+' Nombre: '+incapacidad.trabajador.nombre+' '+incapacidad.trabajador.apellidos,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
          this.incapacidadesService.deleteIncapacity(incapacidad.id).subscribe((resDelete: any) => {
            console.log("Eliminado",resDelete);
            this.getIncapacidadesList();
            this.ngOnInit();
          });
        }
    })
  }

  exportToExcel = () => {
    if(this.selectedEntidad){this.entidadString='&de_entidad='+this.selectedEntidad;}
    if(this.selectedTrabajador){this.trabajadorString='&de_trabajador='+this.selectedTrabajador;}
    this.consulta = ''+this.entidadString+''+this.trabajadorString;
    this.incapacidadesService.getIncapacitisList(this.consulta).subscribe((resI: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [{
          A: 'Id',
          B: 'Trabajador',
          C: 'Entidad',
          D: 'Motivo',
          E: 'Fecha Inicio',
          F: 'Fecha fin',
        }],
        skipHeader: true,
      };
      resI.forEach((item: any) => {
        udt.data.push({
          A: item.id,
          B: item.trabajador.nombre+' '+item.trabajador.apellidos,
          C: item.entidad.nombre,
          D: item.motivo,
          E: item.fecha_inicio,
          F: item.fecha_fin,
        });
      });
      edata.push(udt);
      this.exportService.exportTIncapacidadesColor(edata, "Lista de incapacidades");
    });
  }

  viewIncapacidad = (archivo:string) => {
    this.incapacidadesService.viewIncapacityFile(archivo).subscribe((resfile: Blob) => {
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore
      window.open(fileUrl.toString(), '_blank');
    });
  }

  extractFileFromEvent(event: any) {
    this.incapacidadFile = event.target.files[0]
  }

  messageAlert = (message: string, type: string) => {
    if (type === 'success'){
      Swal.fire('', message, 'success');
    }else {
      Swal.fire('', message, 'error');
    }
  }

  loadPaginate = (data:any) => {
    this.contentArray = data;
    this.incapacidades = this.contentArray.slice(0, 10);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.incapacidades = this.contentArray.slice(startItem, endItem);
  }

  clearFilters = () => {
    this.selectedTrabajador=0;
    this.selectedEntidad=0;
    this.incapacidades=[];
    //window.location.reload();
    this.ngOnInit()
  }

  closeModal = () => {
    this.incapacidadId='';
    this.incapacidadTrabajadorId='';
    this.incapacidadEntidadId='';
    this.incapacidadMotivo='';
    this.incapacidadFechaInicio='';
    this.incapacidadFechaFin='';
    this.incapacidadFile='';
    this.modalRef.hide();
  }

}
