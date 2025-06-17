import {Component, OnInit, TemplateRef} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {DocumentoService} from "../../services/documento.service";
import {BsModalService} from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import * as moment from "moment";

@Component({
  selector: 'app-documentos-entregables',
  templateUrl: './documentos-entregables.component.html',
  styleUrls: ['./documentos-entregables.component.css']
})
export class DocumentosEntregablesComponent implements OnInit {

  documentosEntregables: any[] = [];
  documentoId = '';
  documentoNombre = '';
  documentoFrecuencia = '';
  documentoTipo = '';
  documentoNomenclatura = '';
  /* Variables de paginacion */
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  showLoadingBar: boolean = false ;
  paginationId = 'paginationDaily';
  //variable modal
  modalRef: any;
  documentosId: any = '';
  documentosName: any = '';
  //variables Frecencia del Documento
  frecuencias: any[] = [];
  documentoIdFrecuencia: any = '';
  documentonombreFrecuencia: any = '';
  //variables Tipo documento
  tipos: any[] = [];
  documentoIdTipo: any = '';
  documentoNombreTipo: any = '';


  constructor(private commonService: CommonService,
              private documentoService:DocumentoService,
              private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.loadDocumentosEntregables();
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.id < n2.id) {return 1;}
      if (n1.id > n2.id) {return -1;}
      return 0;
    });
  }

  handlePageDiariasChange = (event: number) => {
    this.pageNumberDiarias = event;
    this.loadDocumentosEntregables();
  }

  loadDocumentosEntregables = () => {
    this.showLoadingBar = true;
    this.documentoService.getDocumentosEntregablesList().subscribe((resDE: any) => {
      let resumenes: any[] = [];
      for (const [value] of Object.entries(resDE)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      this.orderBy(resDE);
      let paginate = this.commonService.paginateItems(resumenes, this.pageNumberDiarias, this.pageSizeDiarias);
      this.dataSource = paginate.data;
      this.totalItemsDiarias = paginate.total;
      this.documentosEntregables = resDE;
    })
    this.documentoService.getDocumentosFrecuenciasList().subscribe((resDF: any) => {
      this.orderBy(resDF);
      this.frecuencias = resDF;
    })
    this.documentoService.getDocumentosTiposList().subscribe((resDT: any) => {
      this.orderBy(resDT);
      this.tipos = resDT;
    })
    this.showLoadingBar = false;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.documentoId = '';
    this.documentoNombre = '';
    this.documentoFrecuencia = '';
    this.documentoTipo = '';
    this.documentoNomenclatura = '';
    this.documentoIdFrecuencia = '';
    this.documentonombreFrecuencia = '';
    this.documentoIdTipo = '';
    this.documentoNombreTipo = '';
  }

  getDocumentosEntregablesById = (documento:any,template:TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
    this.documentoId = documento.id;
    this.documentoNombre = documento.nombre;
    this.documentoFrecuencia = documento.frecuencia_documento_id;
    this.documentoTipo = documento.tipo_id;
    this.documentoNomenclatura = documento.nomenclatura_nombre_archivo;
    for(let frec of this.frecuencias){
      if(documento.frecuencia_documento_id==frec.id){
        this.documentoIdFrecuencia = frec.id;
        this.documentonombreFrecuencia = frec.frecuencia;
      }
    }
    for(let tip of this.tipos){
      if(documento.tipo_id==tip.id){
        this.documentoIdTipo = tip.id;
        this.documentoNombreTipo = tip.tipo;
      }
    }
  }

  addDocumentosEntregables = (nombre:string,frecuencia:any,tipo:any,nomenclatura:string) => {
    console.log("nombre",nombre,"frecuencia",frecuencia,"tipo",tipo,"nomenclatura",nomenclatura);
    if(nombre){
      this.documentoService.addDocumentosEntregables(nombre,frecuencia,tipo,nomenclatura).subscribe((res: any) => {
        console.log("Cargado", res);
      });
      this.loadDocumentosEntregables();
      this.ngOnInit();
      this.modalRef.hide();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo agregar',
        text: 'Debe ingresar un nombre documento entregable'
      });
    }
  }

  updateDocumentosEntregables = (claveid:any,nombre:string,frecuencia:any,tipo:any,nomenclatura:string) => {
    if(nombre){
      this.documentoService.updateDocumentosEntregables(claveid,nombre,frecuencia,tipo,nomenclatura).subscribe((resUpdate: any) => {
        console.log("Actualizado",resUpdate);
      });
      this.documentoId = '';
      this.documentoNombre = '';
      this.documentoFrecuencia = '';
      this.documentoTipo = '';
      this.documentoNomenclatura = '';
      this.documentoIdFrecuencia = '';
      this.documentonombreFrecuencia = '';
      this.documentoIdTipo = '';
      this.documentoNombreTipo = '';
      this.modalRef.hide();
      this.loadDocumentosEntregables();
      this.ngOnInit();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar',
        text: 'Debe ingresar un nombre de documento entregable'
      })
    }
  }

  deleteDocumentosEntregables = (documento:any) => {
    this.documentoNombre = documento.nombre;
    Swal.fire({
      title: '¿Deseas eliminar el Documento?',
      text: this.documentoNombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentoService.deleteDocumentosEntregables(documento.id).subscribe((resDelete: any) => {
          console.log("Eliminado",resDelete);
        });
        this.loadDocumentosEntregables();
        this.ngOnInit();
      }
    })
    this.loadDocumentosEntregables();
    this.ngOnInit();
  }
}
