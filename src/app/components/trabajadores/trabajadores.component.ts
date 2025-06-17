import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {TrabajadorService} from 'src/app/services/trabajador.service';
import {CommonService} from "../../services/common.service";
import {ExcelJson} from "../../interfaces/excel-json";
import {ExportService} from "../../services/export.service";
import {EntidadesService} from "../../services/entidades.service";
import {ProyectoService} from "../../services/proyecto.service";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {BsModalService} from "ngx-bootstrap/modal";
import {CategoriaService} from "../../services/categoria.service";
import Swal from "sweetalert2";
import * as moment from "moment";

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.css']
})
export class TrabajadoresComponent implements OnInit {

  entidades:any[]=[];
  proyectos:any[]=[];
  trabajadores:any[]=[];
  listEntidades:any[]=[];
  listCategorias:any[]=[];
  trabajadorDatos:any[]=[];

  selectedEntidad:number=0;
  selectedProyecto:number=0;
  searchCriterio:string='';

  numeroEntidades:boolean=false;
  numeroProyectos:boolean=false;

  entidadString:string='';
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
  uploadFile:any;

  constructor(private trabajadorService: TrabajadorService,
              private commonService: CommonService,
              private entidadService: EntidadesService,
              private proyectoService: ProyectoService,
              private exportService: ExportService,
              private modalService: BsModalService,
              private categoriaService: CategoriaService
              ) { }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadProyectos();
    this.loadCategorias();
  }

  loadEntidades = () => {
    this.commonService.getEntidades().subscribe((resE: any)=>{
      this.entidades = resE;
      this.listEntidades = resE;
    })
  }

  loadCategorias = () => {
    this.categoriaService.getCategoriasList().subscribe((resC: any)=>{
      this.listCategorias = resC;
    })
  }

  loadProyectos = () => {
    this.commonService.getProyectos().subscribe((resP: any)=>{
      this.proyectos = resP;
    })
  }

  getTrabajadoresByEntidad = () => {
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
    this.filtrarTrabajadores();
  }

  getTrabajadorByProyecto(){
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
    this.filtrarTrabajadores();
  }

  filtrarTrabajadores = () => {
    this.trabajadores=[];
    if(this.searchCriterio){this.searchString='&search='+this.searchCriterio;}
    if(this.selectedEntidad){this.entidadString='&de_entidad='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&de_proyecto='+this.selectedProyecto;}
    this.consulta = '&no_paginate='+this.searchString+''+this.entidadString+''+this.proyectoString+'';
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
    if(this.trabajadorGenero){
      this.trabajadorGenero = false;
    }else{
      this.trabajadorGenero = true;
    }
  }

  addTrabajador = () => {
    if(this.trabajadorNombre && this.trabajadorApellidos){
      if(this.trabajadorEntidad){
        if(this.entidadFechaAlta){
          if(this.trabajadorGenero){this.trabajadorNombreGenero='f';;}
          else{this.trabajadorNombreGenero='m';}
          //console.log("nombre",this.trabajadorNombre,"apellidos",this.trabajadorApellidos,"rfc",this.trabajadorRfc,"curp",this.trabajadorCurp,"nss",this.trabajadorNss,"correo",this.trabajadorCorreo,"telefono",this.trabajadorTelefono,"domicilio",this.trabajadorDomicilio,"genero",this.trabajadorNombreGenero,"fecha_nacimiento",this.trabajadorFechaNacimiento,"nombre_persona_contacto",this.trabajadorPersonaContacto,"telefono_persona_contacto",this.trabajadorTelefonoContact);
          this.trabajadorService.addWorker(this.trabajadorNombre,this.trabajadorApellidos,this.trabajadorRfc,this.trabajadorCurp,this.trabajadorNss,this.trabajadorCorreo,this.trabajadorTelefono,this.trabajadorDomicilio,this.trabajadorNombreGenero,this.trabajadorFechaNacimiento,this.trabajadorPersonaContacto,this.trabajadorTelefonoContact).subscribe((res: any) => {
            this.trabajadorService.addEntityToWorker(res,this.trabajadorEntidad,this.entidadFechaAlta,this.entidadSueldo,this.entidadAltaIMSS).subscribe((resAE: any) => {
              //console.log("Entidad asignada",resAE);
              this.trabajadorService.addCategoryToWorker(res,this.trabajadorEntidad,this.trabajadorCategoria).subscribe((resAC: any) => {
                //console.log("Cargo Asignado ",resAC);
              });
            });
          });
          this.modalRef.hide();
          this.filtrarTrabajadores();
          this.ngOnInit();
        }else{Swal.fire({icon:'error',title: 'No se pudo crear',text:'Debe agregar una fecha de alta para la entidad'});}
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
      if(this.trabajadorEntidad){
        if(this.entidadFechaAlta){
          if(this.trabajadorGenero){this.trabajadorNombreGenero='f';;}
          else{this.trabajadorNombreGenero='m';}
          //console.log("nombre",this.trabajadorNombre,"apellidos",this.trabajadorApellidos,"rfc",this.trabajadorRfc,"curp",this.trabajadorCurp,"nss",this.trabajadorNss,"correo",this.trabajadorCorreo,"telefono",this.trabajadorTelefono,"domicilio",this.trabajadorDomicilio,"genero",this.trabajadorNombreGenero,"fecha_nacimiento",this.trabajadorFechaNacimiento,"nombre_persona_contacto",this.trabajadorPersonaContacto,"telefono_persona_contacto",this.trabajadorTelefonoContact);
          this.trabajadorService.updateWorker(this.trabajadorId,this.trabajadorNombre,this.trabajadorApellidos,this.trabajadorRfc,this.trabajadorCurp,this.trabajadorNss,this.trabajadorCorreo,this.trabajadorTelefono,this.trabajadorDomicilio,this.trabajadorNombreGenero,this.trabajadorFechaNacimiento,this.trabajadorPersonaContacto,this.trabajadorTelefonoContact).subscribe((res: any) => {
            this.trabajadorService.addEntityToWorker(this.trabajadorId,this.trabajadorEntidad,this.entidadFechaAlta,this.entidadSueldo,this.entidadAltaIMSS).subscribe((resAE: any) => {
              //console.log("Entidad actualizado",resAE);
              if(this.trabajadorCargoAnterior!=this.trabajadorCategoria){
                this.trabajadorService.deleteCategoryToWorker(this.trabajadorId,this.trabajadorEntidad,this.trabajadorCargoAnterior).subscribe((resAC: any) => {
                  //console.log("cargo eliminado ",resAC);
                });
                this.trabajadorService.addCategoryToWorker(this.trabajadorId,this.trabajadorEntidad,this.trabajadorCategoria).subscribe((resAC: any) => {
                  //console.log("Cargo actualizado ",resAC);
                });
              }
              this.modalRef.hide();
              this.ngOnInit();
              this.filtrarTrabajadores();
            });
          });
        }else{Swal.fire({icon:'error',title: 'No se pudo Actualizar',text:'Debe agregar una fecha de alta para la entidad'});}
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
          this.trabajadorService.uploadDownFile(this.trabajadorId, this.trabajadorEntidad, this.trabajadorFechaBaja,
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

  extractFileFromUpload(event: any) {
    this.uploadFile = event.target.files[0]
    this.uploadFileIMSS()
  }

  uploadFileIMSS(){
    if(this.uploadFile){
      var datosActualizados = []
      var tablaDatosActualizados = ''
      this.trabajadorService.uploadFileIMSS(this.uploadFile).subscribe((res: any) => {
        datosActualizados = res.relacionesActualizadas
        //console.log("datosActualizados",datosActualizados)
        Swal.fire({
          icon: 'success',
          html: '<h4>El archivo Excel (representación del .SUA) se ha subido y es válido según las especificaciones del sistema.</h4><br>' +
            '<label class="text-justify">Se actualizaron los datos de cuotas de todos los trabajadores para los cuales hubo una coincidencia entre el NSS previamente registrado en GSS y el indicado en el Excel. Los datos de cuotas actualizados corresponden únicamente al periodo indicado en el archivo Excel subido.</label><br><br>'+
            '<label class="text-justify">Los datos actualizados pueden verificarse en "Seguridad Social" -> "Control de cuotas" -> "Resumen COP" seleccionando el periodo, así como la entidad y/o proyecto correspondiente.</label>',
          width: 800,
          showConfirmButton: true
        })
        this.uploadFile=[];
        this.ngOnInit()
      }, (err:any) =>{
        Swal.fire({icon: 'error',title: err.error.message});
        console.error(err)
      });
    }
  }

  messageAlert = (message: string, type: string) => {
    if (type === 'success'){
      Swal.fire('', message, 'success');
    }else {
      Swal.fire('', message, 'error');
    }
  }

  exportToExcel(){
    if(this.searchCriterio){this.searchString='&search='+this.searchCriterio;}
    if(this.selectedEntidad){this.entidadString='&de_entidad='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&de_proyecto='+this.selectedProyecto;}
    this.consulta = '&no_paginate='+this.searchString+''+this.entidadString+''+this.proyectoString+'';
    this.trabajadorService.getWorkers(this.consulta).subscribe((resT: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'',M:'',N:'',O:'',P:'',Q:'',R:'',S:'',T:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'',M:'',N:'',O:'',P:'',Q:'',R:'',S:'',T:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'',M:'',N:'',O:'',P:'',Q:'',R:'',S:'',T:'' },
          {
            A: '',
            B: 'Entidad',
            C: 'Id',
            D: 'Nombre',
            E: 'Apellidos',
            F: 'RFC',
            G: 'CURP',
            H: 'NSS',
            I: 'Fecha de nacimiento',
            J: 'Género',
            K: 'Correo',
            L: 'Teléfono',
            M: 'Domicilio',
            N: 'Persona de contacto',
            O: 'Teléfono contacto',
            P: 'Fecha de creación',
            Q: 'Fecha de actualización',
            R: 'Fecha de eliminación',
            S: 'Cargo',
            T: ''
          }
        ],
        skipHeader: true,
      };
      resT.forEach((item: any) => {
        if(item.entidades[0]){
          if(item.entidades[0].categorias[0]){this.trabajadorCargoNombre = item.entidades[0].categorias[0].nombre;}
          var gen = ''
          if(item.genero=='m'){ gen = 'Masculino'}
          if(item.genero=='f'){ gen = 'Femenino'}
          var f1 = ''
          var f2 = ''
          var f3 = ''
          var f4 = ''
          if(item.fecha_nacimiento){ f1 = moment(item.fecha_nacimiento).format('YYYY-MM-DD') }
          if(item.created_at){ f2 = moment(item.created_at).format('YYYY-MM-DD') }
          if(item.updated_at){ f3 = moment(item.updated_at).format('YYYY-MM-DD') }
          if(item.deleted_at){ f4 = moment(item.deleted_at).format('YYYY-MM-DD') }
          udt.data.push({
            A: '',
            B: item.entidades[0].nombre,
            C: item.id,
            D: item.nombre,
            E: item.apellidos,
            F: item.rfc,
            G: item.curp,
            H: item.nss,
            I: f1,
            J: gen,
            K: item.correo,
            L: item.telefono,
            M: item.domicilio,
            N: item.nombre_persona_contacto,
            O: item.telefono_persona_contact,
            P: f2,
            Q: f3,
            R: f4,
            S: this.trabajadorCargoNombre,
            T: ''
          });
        }
      });
      edata.push(udt);
      let dia = moment(new Date()).format()
      this.exportService.exportEconomicReport(edata, 'Lista de trabajadores_'+dia);
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
