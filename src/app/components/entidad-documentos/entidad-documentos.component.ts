import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentoService } from "../../services/documento.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import Swal from "sweetalert2";
@Component({
  selector: 'app-entidad-documentos',
  templateUrl: './entidad-documentos.component.html',
  styleUrls: ['./entidad-documentos.component.css']
})
export class EntidadDocumentosComponent implements OnInit {

  entidadId:number = Number(this.route.snapshot.paramMap.get('id'));
  entidadNombre:string = String(this.route.snapshot.paramMap.get('nombre'));

  documentosEntregables: any[] = [];
  asignados: any[] = [];

  /* Variables de paginacion */
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  showLoadingBar: boolean = false ;
  paginationId = 'paginationDaily';
  //variables Frecencia del Documento
  frecuencias: any[] = [];
  //variables Tipo documento
  tipos: any[] = [];

  status:boolean=false;

  constructor(private route: ActivatedRoute,
              private documentoService: DocumentoService) { }

  ngOnInit(): void {
    this.loadDocumentos();
    this.loadFiltrosAndTipos();
  }

  loadFiltrosAndTipos = () => {
    this.documentoService.getDocumentosFrecuenciasList().subscribe((resDF: any) => {
      this.orderBy(resDF);
      this.frecuencias = resDF;
    })
    this.documentoService.getDocumentosTiposList().subscribe((resDT: any) => {
      this.orderBy(resDT);
      this.tipos = resDT;
    })
  }

  loadDocumentos(){
    this.asignados = [];
    this.documentoService.getDocumentosEntregablesList().subscribe((resDocEnt: any) => {
      this.documentoService.getDocumentosEntregablesByEntidad(this.entidadId).subscribe((resDocAsig: any) => {
        this.orderBy(resDocEnt);
        console.log("entregables",resDocEnt);
        console.log("Asignado",resDocAsig);
        for(let doc of resDocEnt){
          this.status = false;
          for(let asing of resDocAsig){
            if(doc.id==asing.id){this.status = true;}
          }
          if(this.status){
            doc['guardado'] = this.status;
            this.asignados.push(doc);
          }else{
            doc['duardado'] = this.status;
            this.asignados.push(doc);
          }
        }
        console.log("lista Asignado",this.asignados);
        this.documentosEntregables = this.asignados;
      });
    });
  }

  addDocumentoToEntidad = (documentoId:number) => {
    this.documentoService.addDocumentosToEntidad(this.entidadId,documentoId).subscribe((resAsigDoc: any) => {
      console.log("asignado",resAsigDoc);
      this.loadDocumentos()
    });
  }

  asignarTodos = () => {
    Swal.fire({
      title: '¿Deseas asignar todos los documentos a esta entidad?',
      text: this.entidadNombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, Asignar todos',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentoService.asignateAllDocumentsEntity(this.entidadId).subscribe((resAsigTod: any) => {
          console.log("asignado",resAsigTod);
          this.loadDocumentos()
        });
      }
    })
  }

  deleteDocumentoToEntidad = (documentoId:number) => {
    this.documentoService.deleteDocumentosToEntidad(this.entidadId,documentoId).subscribe((resDeletDoc: any) => {
      if(resDeletDoc==1){
        console.log("Eliminado Correctamente");
        this.loadDocumentos()
      }
    });
  }

  limpiarAsignados = () => {
    Swal.fire({
      title: '¿Deseas quitar todos los documentos asignados a esta entidad?',
      text: this.entidadNombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, Quitar a todos',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentoService.deleteAllDocumentsEntity(this.entidadId).subscribe((resAsigDoc: any) => {
          console.log("asignado",resAsigDoc);
          this.loadDocumentos()
        });
      }
    })
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.id > n2.id) {return 1;}
      if (n1.id < n2.id) {return -1;}
      return 0;
    });
  }

}
