import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import { TrabajadorService } from 'src/app/services/trabajador.service';
import {CommonService} from "../../../../services/common.service";
import {ExcelJson} from "../../../../interfaces/excel-json";
import {ExportService} from "../../../../services/export.service";
import {EntidadesService} from "../../../../services/entidades.service";
import {ProyectoService} from "../../../../services/proyecto.service";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {BsModalService} from "ngx-bootstrap/modal";
import {CategoriaService} from "../../../../services/categoria.service";
import Swal from "sweetalert2";
import * as moment from "moment";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-trabajadores-crud-entidad',
  templateUrl: './trabajadores-crud-entidad.component.html',
  styleUrls: ['./trabajadores-crud-entidad.component.css']
})
export class TrabajadoresCrudEntidadComponent implements OnInit {

  entidadId: number
  proyectos:any[]=[];
  trabajadores:any[]=[];
  listCategorias:any[]=[];
  trabajadorDatos:any[]=[];

  selectedProyecto:number=0;
  searchCriterio:any;
  numeroProyectos:boolean=false;

  proyectoString:string='';
  searchString:string='';
  consulta:string='';

  selected:boolean = true;
  disabled:string = 'disabled';

  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;

  paginationId = 'paginationWorker';
  paginationVisible = false;
  contentArray: any[] = [];
  dataArray: any[] = [];

  modalRef: any;

  trabajadorId:any='';
  trabajadorNombre:string='';
  trabajadorApellidos:string='';
  trabajadorRfc:string='';
  trabajadorCurp:string='';
  trabajadorNss:string='';
  trabajadorFechaNacimiento:string='';
  trabajadorGenero:boolean=false;
  trabajadorNombreGenero:string='';
  trabajadorCorreo:string='';
  trabajadorTelefono:any='';
  trabajadorDomicilio:string='';
  trabajadorPersonaContacto:string='';
  trabajadorTelefonoContact:string='';
  trabajadorEntidad:any;
  entidadFechaAlta:string='';
  entidadSueldo:any;
  entidadAltaIMSS:string='';
  trabajadorCategoria:any;
  trabajadorCargoAnterior:any='';
  trabajadorCargoNombre:any='';
  trabajadorMotivoBaja:string='';
  trabajadorFechaBaja:string='';
  trabajadorBajaFile!: File


  constructor(private trabajadorService: TrabajadorService,
              private commonService: CommonService,
              private entidadService: EntidadesService,
              private proyectoService: ProyectoService,
              private exportService: ExportService,
              private modalService: BsModalService,
              private categoriaService: CategoriaService,
              private route: ActivatedRoute)
  {
    this.entidadId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadProyectos();
    this.loadCategorias();
  }

  loadCategorias = () => {
    this.categoriaService.getCategoriasList().subscribe((resC: any)=>{
      this.listCategorias = resC;
    })
  }

  loadProyectos = () => {
    this.commonService.getProyectos(this.entidadId).subscribe((resP: any)=>{
      this.proyectos = resP;
    })
  }

  filtrarTrabajadores = () => {
    this.trabajadores=[];
    if(this.searchCriterio){this.searchString='&search='+this.searchCriterio;}
    if(this.selectedProyecto){this.proyectoString='&de_proyecto='+this.selectedProyecto;}
    this.consulta = '&no_paginate='+this.searchString+''+`&de_entidad=${this.entidadId}`+''+this.proyectoString+'';
    this.trabajadorService.getWorkers(this.consulta).subscribe((resT: any) => {
      for(let trabajador of resT){
        if(trabajador.entidades[0]){
          this.trabajadores.push(trabajador);
        }
      }
      this.loadPaginate(this.trabajadores);
      this.paginationVisible = true;
    });
  }

  addTrabajdorModal = (template: TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
  }

  changeGenero = () => {
    this.trabajadorGenero = !this.trabajadorGenero;
  }

  addTrabajador = () => {
    if(this.trabajadorNombre && this.trabajadorApellidos){
      if(this.entidadId){
        if(this.trabajadorCategoria){
          if(this.entidadFechaAlta){
            if(this.trabajadorGenero){this.trabajadorNombreGenero='f';;}
            else{this.trabajadorNombreGenero='m';}
            console.log("nombre",this.trabajadorNombre,"apellidos",this.trabajadorApellidos,"rfc",this.trabajadorRfc,"curp",this.trabajadorCurp,"nss",this.trabajadorNss,"correo",this.trabajadorCorreo,"telefono",this.trabajadorTelefono,"domicilio",this.trabajadorDomicilio,"genero",this.trabajadorNombreGenero,"fecha_nacimiento",this.trabajadorFechaNacimiento,"nombre_persona_contacto",this.trabajadorPersonaContacto,"telefono_persona_contacto",this.trabajadorTelefonoContact);
            this.trabajadorService.addWorker(this.trabajadorNombre,this.trabajadorApellidos,this.trabajadorRfc,this.trabajadorCurp,this.trabajadorNss,this.trabajadorCorreo,this.trabajadorTelefono,this.trabajadorDomicilio,this.trabajadorNombreGenero,this.trabajadorFechaNacimiento,this.trabajadorPersonaContacto,this.trabajadorTelefonoContact).subscribe((res: any) => {
              this.trabajadorService.addEntityToWorker(res,this.entidadId,this.entidadFechaAlta,this.entidadSueldo,this.entidadAltaIMSS).subscribe((resAE: any) => {
                console.log("Entidad asignada",resAE);
                this.trabajadorService.addCategoryToWorker(res,this.entidadId,this.trabajadorCategoria).subscribe((resAC: any) => {
                  console.log("Cargo Asignado ",resAC);
                });
              });
            });
            this.modalRef.hide();
            this.filtrarTrabajadores();
            this.ngOnInit();
          }else{Swal.fire({icon:'error',title: 'No se pudo crear',text:'Debe agregar una fecha de alta para la entidad'});}
        }else{Swal.fire({icon:'error',title: 'No se pudo crear',text:'Debe seleccionar el cargo del trabajador'});}
      }else{Swal.fire({icon:'error',title: 'No se pudo crear',text:'Debe de seleccionar una entidad'});}
    }else{Swal.fire({icon:'error',title: 'No se pudo crear',text:'Debe ingresar el nombre y apellidos del trabajador'});}
  }

  updateTrabajadorModal = (template: TemplateRef<any>,trabajador:any) => {
    this.trabajadorDatos=trabajador;
    this.trabajadorId=trabajador.id;
    this.trabajadorNombre=trabajador.nombre;
    this.trabajadorApellidos=trabajador.apellidos;
    this.trabajadorRfc=trabajador.rfc;
    this.trabajadorCurp=trabajador.curp;
    this.trabajadorNss=trabajador.nss;
    this.trabajadorFechaNacimiento=trabajador.fecha_nacimiento;
    if(trabajador.genero=='m' || trabajador.genero==null){
      this.trabajadorGenero=false;
      this.trabajadorNombreGenero='m';
    }else if(trabajador.genero=='f'){
      this.trabajadorGenero=true;
      this.trabajadorNombreGenero='f';
    }
    this.trabajadorCorreo=trabajador.correo;
    this.trabajadorTelefono=trabajador.telefono;
    this.trabajadorDomicilio=trabajador.domicilio;
    this.trabajadorPersonaContacto=trabajador.nombre_persona_contacto;
    this.trabajadorTelefonoContact=trabajador.telefono_persona_contacto;
    this.trabajadorEntidad=trabajador.entidades[0].id;
    this.entidadFechaAlta=trabajador.entidades[0].fecha_alta;
    this.entidadSueldo=trabajador.entidades[0].sueldo_total;
    this.entidadAltaIMSS=trabajador.entidades[0].clinica_alta_imss;
    if(trabajador.entidades[0].categorias[0]){
      this.trabajadorCategoria=trabajador.entidades[0].categorias[0].id;
      this.trabajadorCargoAnterior=trabajador.entidades[0].categorias[0].id;
    }
    this.modalRef = this.modalService.show(template);
  }

  updateTrabajador = () => {
    if(this.trabajadorNombre && this.trabajadorApellidos){
      if(this.entidadId){
        if(this.trabajadorCategoria){
          if(this.entidadFechaAlta){
            if(this.trabajadorGenero){this.trabajadorNombreGenero='f';;}
            else{this.trabajadorNombreGenero='m';}
            console.log("nombre",this.trabajadorNombre,"apellidos",this.trabajadorApellidos,"rfc",this.trabajadorRfc,"curp",this.trabajadorCurp,"nss",this.trabajadorNss,"correo",this.trabajadorCorreo,"telefono",this.trabajadorTelefono,"domicilio",this.trabajadorDomicilio,"genero",this.trabajadorNombreGenero,"fecha_nacimiento",this.trabajadorFechaNacimiento,"nombre_persona_contacto",this.trabajadorPersonaContacto,"telefono_persona_contacto",this.trabajadorTelefonoContact);
            this.trabajadorService.updateWorker(this.trabajadorId,this.trabajadorNombre,this.trabajadorApellidos,this.trabajadorRfc,this.trabajadorCurp,this.trabajadorNss,this.trabajadorCorreo,this.trabajadorTelefono,this.trabajadorDomicilio,this.trabajadorNombreGenero,this.trabajadorFechaNacimiento,this.trabajadorPersonaContacto,this.trabajadorTelefonoContact).subscribe((res: any) => {
              this.trabajadorService.addEntityToWorker(this.trabajadorId,this.entidadId,this.entidadFechaAlta,this.entidadSueldo,this.entidadAltaIMSS).subscribe((resAE: any) => {
                console.log("Entidad actualizado",resAE);
                if(this.trabajadorCargoAnterior!=this.trabajadorCategoria){
                  this.trabajadorService.deleteCategoryToWorker(this.trabajadorId,this.entidadId,this.trabajadorCargoAnterior).subscribe((resAC: any) => {
                    console.log("cargo eliminado ",resAC);
                  });
                  this.trabajadorService.addCategoryToWorker(this.trabajadorId,this.entidadId,this.trabajadorCategoria).subscribe((resAC: any) => {
                    console.log("Cargo actualizado ",resAC);
                  });
                }
                this.modalRef.hide();
                this.ngOnInit();
                this.filtrarTrabajadores();
              });
            });
          }else{Swal.fire({icon:'error',title: 'No se pudo Actualizar',text:'Debe agregar una fecha de alta para la entidad'});}
        }else{Swal.fire({icon:'error',title: 'No se pudo Actualizar',text:'Debe seleccionar el cargo del trabajador'});}
      }else{Swal.fire({icon:'error',title: 'No se pudo Actualizar',text:'Debe de seleccionar una entidad'});}
    }else{Swal.fire({icon:'error',title: 'No se pudo Actualizar',text:'Debe ingresar el nombre y apellidos del trabajador'});}
  }

  deleteTrabajador = (template: TemplateRef<any>,trabajador:any) => {
    this.trabajadorId='';
    this.trabajadorNombre='';
    this.trabajadorEntidad='';
    this.trabajadorCategoria='';
    this.trabajadorId=trabajador.id;
    this.trabajadorNombre=trabajador.nombre;
    this.trabajadorEntidad=trabajador.entidades[0].id;
    if(trabajador.entidades[0].categorias[0]){
      this.trabajadorCategoria=trabajador.entidades[0].categorias[0].id;
    }else{
      this.trabajadorCategoria='';
    }
    this.modalRef = this.modalService.show(template);
  }

  registrarBaja = async () => {
    if(this.trabajadorFechaBaja){
      this.trabajadorFechaBaja = moment(this.trabajadorFechaBaja).format('YYYY-MM-DD');
      if(this.trabajadorMotivoBaja) {
        this.trabajadorService.uploadDownFile(this.trabajadorId, this.entidadId, this.trabajadorFechaBaja,
          this.trabajadorMotivoBaja, this.trabajadorBajaFile).subscribe((res: any) =>
        {
          console.log("Entidad desasignada,", res);
          this.trabajadorService.deleteWorker(this.trabajadorId).subscribe((resET: any) => {
            console.log("Trabajador eliminado", resET);
          });
          this.modalRef.hide();
          this.filtrarTrabajadores();
          this.messageAlert(JSON.stringify(res), 'success');
        }, (err: any) => {
          this.messageAlert(JSON.stringify(err.error), 'error');
        });
      }else{Swal.fire({icon:'error',title: 'No se pudo registrar la baja',text:'Debe agregar una fecha de baja'});}
    }else{Swal.fire({icon:'error',title: 'No se pudo registrar la baja',text:'Debe agregar un motivo de baja'});}
  }

  extractFileFromEvent(event: any) {
    this.trabajadorBajaFile = event.target.files[0]
  }

  messageAlert = (message: string, type: string) => {
    if (type === 'success'){
      Swal.fire('', message, 'success');
    }else {
      Swal.fire('', message, 'error');
    }
  }

  exportToExcel = () => {
    if(this.searchCriterio){this.searchString='&search='+this.searchCriterio;}
    if(this.selectedProyecto){this.proyectoString='&de_proyecto='+this.selectedProyecto;}
    this.consulta = '&no_paginate='+this.searchString+''+`&de_entidad=${this.entidadId}`+''+this.proyectoString+'';
    this.trabajadorService.getWorkers(this.consulta).subscribe((resT: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [{
          A: 'Id',
          B: 'Nombre',
          C: 'Apellidos',
          D: 'RFC',
          E: 'CURP',
          F: 'NSS',
          G: 'Fecha de nacimiento',
          H: 'Género',
          I: 'Correo',
          J: 'Teléfono',
          K: 'Domicilio',
          L: 'Persona de contacto',
          M: 'Teléfono contacto',
          N: 'Fecha de creación',
          O: 'Fecha de actualización',
          P: 'Fecha de eliminación',
          Q: 'Entidad',
          R: 'Cargo'
        }],
        skipHeader: true,
      };
      resT.forEach((item: any) => {
        if(item.entidades[0]){
          if(item.entidades[0].categorias[0]){
            this.trabajadorCargoNombre = item.entidades[0].categorias[0].nombre;
          }
          udt.data.push({
            A: item.id,
            B: item.nombre,
            C: item.apellidos,
            D: item.rfc,
            E: item.curp,
            F: item.nss,
            G: item.fecha_nacimiento,
            H: item.genero,
            I: item.correo,
            J: item.telefono,
            K: item.domicilio,
            L: item.nombre_persona_contacto,
            M: item.telefono_persona_contact,
            N: item.created_at,
            O: item.updated_at,
            P: item.deleted_at,
            Q: item.entidades[0].nombre,
            R: this.trabajadorCargoNombre
          });
        }
      });
      edata.push(udt);
      this.exportService.exportTrabajadoresColor(edata, "Lista de trabajadores");
    });
  }

  cleanFilters = () => {
    window.location.reload();
  }

  loadPaginate = (data:any) => {
    this.contentArray = data;
    this.trabajadores = this.contentArray.slice(0, 10);

  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.trabajadores = this.contentArray.slice(startItem, endItem);
  }

  closeModal = () => {
    this.trabajadorDatos=[];
    this.trabajadorId='';
    this.trabajadorNombre='';
    this.trabajadorApellidos='';
    this.trabajadorRfc='';
    this.trabajadorCurp='';
    this.trabajadorNss='';
    this.trabajadorFechaNacimiento='';
    this.trabajadorGenero=false;
    this.trabajadorNombreGenero='';
    this.trabajadorCorreo='';
    this.trabajadorTelefono='';
    this.trabajadorDomicilio='';
    this.trabajadorPersonaContacto='';
    this.trabajadorTelefonoContact='';
    this.trabajadorEntidad='';
    this.entidadFechaAlta='';
    this.entidadSueldo='';
    this.entidadAltaIMSS='';
    this.trabajadorCategoria='';
    this.trabajadorMotivoBaja='';
    this.trabajadorFechaBaja='';
    this.modalRef.hide();
  }
}
