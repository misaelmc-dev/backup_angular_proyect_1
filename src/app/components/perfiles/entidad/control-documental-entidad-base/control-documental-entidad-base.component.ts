import {ChangeDetectorRef, Component, ElementRef, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {CommonService} from "../../../../services/common.service";
import {DocumentoService} from "../../../../services/documento.service";
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {DatepickerOptions} from "ng2-datepicker";
import locale from 'date-fns/locale/es';
import {ProyectoService} from "../../../../services/proyecto.service";
import {EntidadesService} from "../../../../services/entidades.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {ExcelJson} from "../../../../interfaces/excel-json";
import * as XLSX from "xlsx-js-style";
import {ExportService} from "../../../../services/export.service";

@Component({
  selector: 'app-control-documental-entidad-base',
  templateUrl: './control-documental-entidad-base.component.html',
  styleUrls: ['./control-documental-entidad-base.component.css']
})
export class ControlDocumentalEntidadBaseComponent implements OnInit {

  @ViewChild('inicial')
  inicialInput!: ElementRef;
  @ViewChild('mensual')
  mensualInput!: ElementRef;
  @ViewChild('bimensual')
  bimensualInput!: ElementRef;

  estatus = 'Por Entregar';
  entidadId: number

  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;

  documents: any[] = [];
  proyectos: any[] = [];
  frecuencias: any[] = [];
  tiposDocumentos: any[] = [];
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
  numeroProyectos: boolean = false; //Solo es true cuando el numero de proyectos es 1
  entidadproyecto: string = '';
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

  proyectoExcel:string = '';
  entregadoExcel:string = '';
  atiempoExcel:string = '';

  constructor(private commonService: CommonService,
              private documentoService: DocumentoService,
              private proyectoService: ProyectoService,
              private entidadService: EntidadesService,
              private ref: ChangeDetectorRef,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private exportService: ExportService
  )
  {
    this.entidadId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadProyectos();
    this.loadFrecuencias();
    this.loadTipoDocumentos();
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
    this.proyectoService.getProyectList(this.entidadId).subscribe((res: any) => {
      this.proyectos = res;
    });
  }

  getDocumentosCriteria = () => {
    if(this.docProyecto){this.selectedProyecto=this.docProyecto}
    this.entidadproyecto = '';
    this.docTipo = '';
    this.docFrecuencia = '';
    this.docEstado = '';
    if(this.tipoDocumento){this.docTipo = '&tipos='+this.tipoDocumento;}
    if(this.estado){this.docEstado = '&'+this.estado;}
    if(this.frecuencia){this.docFrecuencia = '&'+this.frecuencia;}
    if(this.desde){this.desde = '&fecha_desde='+this.desde;}
    if(this.hasta){this.hasta = '&fecha_hasta='+this.hasta;}
    //this.criteria = `${this.entidadproyecto}${this.docTipo}${this.docEstado}${this.docFrecuencia}${this.desde}${this.hasta}`;
    this.criteria = `entidades=${this.entidadId}&proyectos=${(this.selectedProyecto) ? this.selectedProyecto : ''}${this.docTipo}${this.docEstado}${this.docFrecuencia}${this.desde}${this.hasta}`;
    this.documentoService.getDocumentosCriteria(this.criteria).subscribe((res: any) => {
      let paginate = this.commonService.paginateItems(res, this.pageNumber, this.pageSize);
      this.documents = paginate.data;
      this.totalItems = paginate.total;
    });
  }

  getDocumentosCriteriaEvent = (event: Event) => {
    this.desde = moment(this.fecha_desde).format('DD-MM-YYYY');
    this.hasta = moment(this.fecha_hasta).format('DD-MM-YYYY');
    console.log(this.desde);
    console.log(this.hasta);
    this.entidadproyecto = '';
    this.docTipo = '';
    this.docFrecuencia = '';
    this.docEstado = '';
    if(this.tipoDocumento){this.docTipo = '&tipos='+this.tipoDocumento;}
    if(this.estado){this.docEstado = '&'+this.estado;}
    if(this.frecuencia){this.docFrecuencia = '&'+this.frecuencia;}
    if(this.desde){this.desde = '&fecha_desde='+this.desde;}
    if(this.hasta){this.hasta = '&fecha_hasta='+this.hasta;}
    //this.criteria = `${this.entidadproyecto}${this.docTipo}${this.docEstado}${this.docFrecuencia}${this.desde}${this.hasta}`;
    this.criteria = `entidades=${this.entidadId}&proyectos=${(this.selectedProyecto) ? this.selectedProyecto : ''}${this.docTipo}${this.docEstado}${this.docFrecuencia}${this.desde}${this.hasta}`;
    this.documentoService.getDocumentosCriteria(this.criteria).subscribe((res: any) => {
      this.documents = res;
      let paginate = this.commonService.paginateItems(res, this.pageNumber, this.pageSize);
      this.documents = paginate.data;
      this.totalItems = paginate.total;
    });
  }

  exportToExcel = () => {
    if(this.docProyecto){this.selectedProyecto=this.docProyecto}
    this.entidadproyecto = '';
    this.docTipo = '';
    this.docFrecuencia = '';
    this.docEstado = '';
    if(this.tipoDocumento){this.docTipo = '&tipos='+this.tipoDocumento;}
    if(this.estado){this.docEstado = '&'+this.estado;}
    if(this.frecuencia){this.docFrecuencia = '&'+this.frecuencia;}
    if(this.desde){this.desde = '&fecha_desde='+this.desde;}
    if(this.hasta){this.hasta = '&fecha_hasta='+this.hasta;}
    //this.criteria = `${this.entidadproyecto}${this.docTipo}${this.docEstado}${this.docFrecuencia}${this.desde}${this.hasta}`;
    this.criteria = `entidades=${this.entidadId}&proyectos=${(this.selectedProyecto) ? this.selectedProyecto : ''}${this.docTipo}${this.docEstado}${this.docFrecuencia}${this.desde}${this.hasta}`;
    this.documentoService.getDocumentosCriteria(this.criteria).subscribe((res: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          {
            A: 'Proyecto',
            B: 'Documento',
            C: 'Frecuencia',
            D: 'Tipo de Documento',
            E: 'Entregado',
            F: 'A tiempo',
            G: 'Fecha de entrega',
            H: 'Desde',
            I: 'Hasta'
          }, // table header
        ],
        skipHeader: true,
      };
      res.forEach((item: any) => {
        this.proyectoExcel = '';
        for (let proy of this.proyectos) {
          if (proy.id == item.proyecto_id) {
            this.proyectoExcel = proy.nombre;
          }
        }
        if(item.fecha_entrega){
          this.entregadoExcel = 'Entregado';
        }else{
          this.entregadoExcel = 'No entregado';
        }
        if(item.a_tiempo){
          this.atiempoExcel = 'A tiempo';
        }else{
          this.atiempoExcel = 'Retrasado';
        }
        udt.data.push({
          A: this.proyectoExcel,
          B: item.nombre_doc,
          C: item.frecuencia_doc,
          D: item.tipo_doc,
          E: this.entregadoExcel,
          F: this.atiempoExcel,
          G: item.fecha_entrega,
          H: item.cubre_desde,
          I: item.cubre_hasta
        });
      });
      edata.push(udt);
      this.exportService.exportDocumental(edata, 'Control de Entrega Documental');
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
          this.getDocumentosCriteria();
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
        this.getDocumentosCriteria();
        this.messageAlert(res, 'success');
      }, (err: any) => {
        this.messageAlert(err.error, 'error');
      });
    }
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

  cleanFilters = () => {
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
