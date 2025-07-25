import {ChangeDetectorRef, Component, ElementRef, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {DocumentoService} from "../../services/documento.service";
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {DatepickerOptions} from "ng2-datepicker";
import locale from 'date-fns/locale/es';
import {ProyectoService} from "../../services/proyecto.service";
import {EntidadesService} from "../../services/entidades.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ExcelJson} from "../../interfaces/excel-json";
import {ExportService} from "../../services/export.service";

@Component({
  selector: 'app-perfil-contratista',
  templateUrl: './perfil-contratista.component.html',
  styleUrls: ['./perfil-contratista.component.css']
})
export class PerfilContratistaComponent implements OnInit {

  @ViewChild('inicial')
  inicialInput!: ElementRef;
  @ViewChild('mensual')
  mensualInput!: ElementRef;
  @ViewChild('bimensual')
  bimensualInput!: ElementRef;

  estatus = 'Por Entregar';

  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;

  documents: any[] = [];
  entidades: any[] = [];
  proyectos: any[] = [];
  frecuencias: any[] = [];
  tiposDocumentos: any[] = [];
  selectedEntidad: number = 0;
  selectedProyecto!: string;
  tipoDocumento = '';
  estado = '';
  frecuencia = '';
  fecha_desde!: any;
  fecha_hasta!: any;
  desde = '';
  hasta = '';
  criteria = '';
  filtros: string = "";
  numeroEntidades: boolean = false; //Solo es true cuando el numero de entidades es 1
  numeroProyectos: boolean = false; //Solo es true cuando el numero de proyectos es 1
  entidadproyecto: string = '';
  docEntidad: number = 0;
  docProyecto: string = '';
  docTipo: string = '';
  docFrecuencia: string = '';
  docEstado: string = '';

  optionsFechaInicio: DatepickerOptions = {
    placeholder: 'Fecha Inicio', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'yyyy-MM-dd', // date format to display in input
    formatTitle: 'LLLL yyyy',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: locale,
    position: 'bottom',
    inputClass: 'form-control', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
  };

  optionsFechaFin: DatepickerOptions = {
    placeholder: 'Fecha Fin', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'yyyy-MM-dd', // date format to display in input
    formatTitle: 'LLLL yyyy',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: locale,
    position: 'bottom',
    inputClass: 'form-control', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
  };

  entregadoExcel:string = '';
  atiempoExcel:string = '';

  constructor(private commonService: CommonService,
              private documentoService: DocumentoService,
              private proyectoService: ProyectoService,
              private entidadService: EntidadesService,
              private ref: ChangeDetectorRef,
              private domSanitizer: DomSanitizer,
              private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadProyectos();
    this.loadFrecuencias();
    this.loadTipoDocumentos();
  }

  loadEntidades = () => {
    this.commonService.getEntidades().subscribe((res: any)=>{
      this.entidades = res;
    })
  }

  loadTipoDocumentos = () => {
    this.commonService.getTipoDocumentos().subscribe((res: any) => {
      this.tiposDocumentos = res;
    });
  }

  loadFrecuencias = () => {
    this.commonService.getFrecuencias().subscribe((res: any) => {
      this.frecuencias = res;
    });
  }

  loadProyectos = () => {
    this.proyectoService.getProyectList().subscribe((res: any) => {
      this.proyectos = res;
    });
  }

  getDocumentsByEntidad(){
    this.pageNumber = 1;
    if(!this.docProyecto){
      this.proyectoService.getProyectoByEntity(this.selectedEntidad).subscribe((resE: any) => {
        this.numeroProyectos = resE.length == 1;
        this.proyectos = resE;
      });
    }
    this.docEntidad = this.selectedEntidad;
    this.getDocumentosCriteria();
  }

  getDocumentsByProyecto(){
    this.pageNumber = 1;
    if(!this.docEntidad){
      this.entidadService.getEntidadesByProyect(this.selectedProyecto).subscribe((resP: any) => {
        this.numeroEntidades = resP.length == 1;
        this.entidades = resP.data;
      });
    }
    this.docProyecto = this.selectedProyecto;
    this.getDocumentosCriteria();
  }

  getDocumentosCriteria(pagination?:string){
    if(pagination=='resetPagination'){this.pageNumber=1}
    if(this.docEntidad){this.selectedEntidad=this.docEntidad;this.numeroEntidades=true;}
    if(this.docProyecto){this.selectedProyecto=this.docProyecto;this.numeroEntidades=true;}
    this.entidadproyecto = '';
    this.docTipo = '';
    this.docFrecuencia = '';
    this.docEstado = '';
    if(this.selectedEntidad && this.selectedProyecto){
      this.entidadproyecto = 'entidades='+this.selectedEntidad+'&proyectos='+this.selectedProyecto;
    }else if(!this.selectedEntidad && this.selectedProyecto){
      this.entidadproyecto = 'proyectos='+this.selectedProyecto;
    }else if(this.selectedEntidad && !this.selectedProyecto){
      this.entidadproyecto = 'entidades='+this.selectedEntidad;
    }else{this.entidadproyecto = '';}
    if(this.tipoDocumento){this.docTipo = '&tipos='+this.tipoDocumento;}
    if(this.estado){this.docEstado = '&'+this.estado;}
    if(this.frecuencia){this.docFrecuencia = '&'+this.frecuencia;}
    if(this.desde){this.desde = '&fecha_desde='+this.desde;}
    if(this.hasta){this.hasta = '&fecha_hasta='+this.hasta;}
    this.criteria = `${this.entidadproyecto}${this.docTipo}${this.docEstado}${this.docFrecuencia}${this.desde}${this.hasta}`;
    this.documentoService.getDocumentosCriteria(this.criteria).subscribe((res: any) => {
      let paginate = this.commonService.paginateItems(res, this.pageNumber, this.pageSize);
      this.documents = paginate.data;
      this.totalItems = paginate.total;
    });
  }

  getDocumentosCriteriaEvent = (event: Event) => {
    this.pageNumber = 1;
    this.desde = moment(this.fecha_desde).format('DD-MM-YYYY');
    this.hasta = moment(this.fecha_hasta).format('DD-MM-YYYY');
    this.entidadproyecto = '';
    this.docTipo = '';
    this.docFrecuencia = '';
    this.docEstado = '';
    if(this.selectedEntidad && this.selectedProyecto){
      this.entidadproyecto = 'entidades='+this.selectedEntidad+'&proyectos='+this.selectedProyecto;
    }else if(!this.selectedEntidad && this.selectedProyecto){
      this.entidadproyecto = 'proyectos='+this.selectedProyecto;
    }else if(this.selectedEntidad && !this.selectedProyecto){
      this.entidadproyecto = 'entidades='+this.selectedEntidad;
    }else{this.entidadproyecto = '';}
    if(this.tipoDocumento){this.docTipo = '&tipos='+this.tipoDocumento;}
    if(this.estado){this.docEstado = '&'+this.estado;}
    if(this.frecuencia){this.docFrecuencia = '&'+this.frecuencia;}
    if(this.desde){this.desde = '&fecha_desde='+this.desde;}
    if(this.hasta){this.hasta = '&fecha_hasta='+this.hasta;}
    this.criteria = `${this.entidadproyecto}${this.docTipo}${this.docEstado}${this.docFrecuencia}${this.desde}${this.hasta}`;
    this.documentoService.getDocumentosCriteria(this.criteria).subscribe((res: any) => {
      this.documents = res;
      let paginate = this.commonService.paginateItems(res, this.pageNumber, this.pageSize);
      this.documents = paginate.data;
      this.totalItems = paginate.total;
    });
  }

  deleteDocument = (documentName: string) => {
    Swal.fire({
      title: '¿Deseas eliminar este documento?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.documentoService.deleteDocument(documentName).subscribe((res: any) => {
          this.getDocumentsByEntidad();
          this.messageAlert('El documento se ha eliminado correctamente', 'success');
        });
      }
    });
  }

  uploadDocument = async (entityId: string, proyectoId: string, documentoId: string, fechaDebida: string) => {
    const { value: file } = await Swal.fire({
      title: 'Seleccionar documento',
      input: 'file',
      inputAttributes: {
        'accept': 'application/pdf,application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'aria-label': 'Upload your profile picture'
      },
      confirmButtonText: 'Guardar Archivo',
      showCancelButton: true
    })

    if (file){
      this.documentoService.uploadFile(entityId, proyectoId, documentoId, fechaDebida, file).subscribe((res:any) => {
        this.getDocumentsByEntidad();
        this.messageAlert(res, 'success');
      }, (err: any) => {
        this.messageAlert(err.error, 'error');
      });
    }
  }

  exportToExcel(){
    if(this.docEntidad){this.selectedEntidad=this.docEntidad;this.numeroEntidades=true;}
    if(this.docProyecto){this.selectedProyecto=this.docProyecto;this.numeroEntidades=true;}
    this.entidadproyecto = '';
    this.docTipo = '';
    this.docFrecuencia = '';
    this.docEstado = '';
    if(this.selectedEntidad && this.selectedProyecto){
      this.entidadproyecto = 'entidades='+this.selectedEntidad+'&proyectos='+this.selectedProyecto;
    }else if(!this.selectedEntidad && this.selectedProyecto){
      this.entidadproyecto = 'proyectos='+this.selectedProyecto;
    }else if(this.selectedEntidad && !this.selectedProyecto){
      this.entidadproyecto = 'entidades='+this.selectedEntidad;
    }else{this.entidadproyecto = '';}
    if(this.tipoDocumento){this.docTipo = '&tipos='+this.tipoDocumento;}
    if(this.estado){this.docEstado = '&'+this.estado;}
    if(this.frecuencia){this.docFrecuencia = '&'+this.frecuencia;}
    if(this.desde){this.desde = '&fecha_desde='+this.desde;}
    if(this.hasta){this.hasta = '&fecha_hasta='+this.hasta;}
    this.criteria = `${this.entidadproyecto}${this.docTipo}${this.docEstado}${this.docFrecuencia}${this.desde}${this.hasta}`;
    this.documentoService.getDocumentosCriteria(this.criteria).subscribe((res: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'' },
          { // table headers
            A: '',
            B: 'Proyecto',
            C: 'Entidad',
            D: 'Documento',
            E: 'Frecuencia',
            F: 'Tipo de Documento',
            G: 'Entregado',
            H: 'A tiempo',
            I: 'Fecha de entrega',
            J: 'Desde',
            K: 'Hasta',
            L: ''
          }, // table header
        ],
        skipHeader: true,
      };
      res.forEach((item: any) => {
        var proyectoExcel = '';
        for (let proy of this.proyectos) { if (proy.id == item.proyecto_id) {proyectoExcel = proy.nombre;} }
        var entidadExcel = '';
        for (let ent of this.entidades) { if (ent.id == item.entidad_id) {entidadExcel = ent.nombre;} }
        if(item.fecha_entrega){ this.entregadoExcel = 'Entregado' }else{ this.entregadoExcel = 'No entregado'; }
        if(item.a_tiempo){ this.atiempoExcel = 'A tiempo' }else{ this.atiempoExcel = 'Retrasado'; }
        var fecha_entrega = '';
        var cubre_desde = '';
        var cubre_hasta = '';
        if(item.fecha_entrega){fecha_entrega = moment(item.fecha_entrega).format('YYYY-MM-DD')}
        if(item.cubre_desde){cubre_desde = moment(item.cubre_desde).format('YYYY-MM-DD')}
        if(item.cubre_hasta){cubre_hasta = moment(item.cubre_hasta).format('YYYY-MM-DD')}
        udt.data.push({
          A: '',
          B: proyectoExcel,
          C: entidadExcel,
          D: item.nombre_doc,
          E: item.frecuencia_doc,
          F: item.tipo_doc,
          G: this.entregadoExcel,
          H: this.atiempoExcel,
          I: fecha_entrega,
          J: cubre_desde,
          K: cubre_hasta,
          L: ''
        });
      });
      edata.push(udt);
      let dia = moment(new Date()).format()
      this.exportService.exportEconomicReport(edata, 'Control de Entrega Documental_'+dia);
    });
  }

  handlePageChange(event: any) {
    this.pageNumber = event;
    this.getDocumentosCriteria();
  }

  messageAlert = (message: string, type: string) => {
    if (type === 'success'){
      Swal.fire('', message, 'success');
    }else {
      Swal.fire('', message, 'error');
    }
  }

  clearFilters = () => {
    window.location.reload();
  }

  viewDocument = (archivo:string) => {
    this.documentoService.viewDocumentFile(archivo).subscribe((resfile: Blob) => {
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore
      window.open(fileUrl.toString(), '_blank');
    });
  }

}
