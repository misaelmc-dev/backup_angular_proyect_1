import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TipoDocumentoService } from "../../services/tipo-documento.service";
import { CommonService } from "../../services/common.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.css']
})
export class TipoDocumentoComponent implements OnInit {

  tipodocumento: any[] = [];
  /* Variables de paginacion */
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  showLoadingBar = false;
  paginationId = 'paginationDaily';
  //variable modal
  modalRef: any;
  tipoDocumentoId: any = '';
  tipoDocumentoTipo: any = '';

  constructor(private tipoDocumentoService: TipoDocumentoService,
              private commonService: CommonService,
              private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadTiposDocumentos();
  }

  loadTiposDocumentos = () => {
    this.showLoadingBar = true;
    this.tipoDocumentoService.getTipoDocumentoList().subscribe((res: any) => {
      let resumenes: any[] = [];
      for (const [value] of Object.entries(res)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      this.orderBy(res);
      let paginate = this.commonService.paginateItems(resumenes, this.pageNumberDiarias, this.pageSizeDiarias);
      this.dataSource = paginate.data;
      this.totalItemsDiarias = paginate.total;
      this.tipodocumento = res;
      this.showLoadingBar = false;
    })
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.id < n2.id) {return 1;}
      if (n1.id > n2.id) {return -1;}
      return 0;
    });
  }

  getTipoDocumentoById = (crit: any, template: TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
    let docu = crit;
    this.tipoDocumentoId = docu.id;
    this.tipoDocumentoTipo = docu.tipo;
  }

  handlePageDiariasChange = (event: number) => {
    this.pageNumberDiarias = event;
    this.loadTiposDocumentos();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.tipoDocumentoId = '';
    this.tipoDocumentoTipo = '';
  }

  addTiposDocumentos = (tipo:string) => {
    console.log("tipo:",tipo);
    if(tipo){
      this.tipoDocumentoService.addTipoDocumento(tipo).subscribe((res: any) => {
        console.log("Cargado", res);
        this.modalRef.hide();
        this.loadTiposDocumentos();
        this.ngOnInit();
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo agregar',
        text: 'Debe ingresar el nombre del tipo de documento'
      });
    }
  }

  updateTiposDocumentos = (claveid:number,tipo:string) => {
    console.log("tipo:",tipo,"porciento:");
    if(tipo){
      this.tipoDocumentoService.updateTipoDocumento(claveid,tipo).subscribe((resUpdate: any) => {
        this.tipoDocumentoId = '';
        this.tipoDocumentoTipo = '';
        this.modalRef.hide();
        this.loadTiposDocumentos();
        this.ngOnInit();
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar',
        text: 'Debe ingresar el nombre del tipo de documento'
      })
    }
  }

  deleteProyectosTipos = (crit: any) => {
    let docu = crit;
    this.tipoDocumentoId = docu.id;
    this.tipoDocumentoTipo = docu.tipo;

    Swal.fire({
      title: '¿Deseas eliminar el tipo de documento?',
      text: this.tipoDocumentoTipo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoDocumentoService.deleteTipoDocumento(this.tipoDocumentoId).subscribe((resDelete: any) => {
          this.loadTiposDocumentos();
          this.ngOnInit();
        });
      }
    })
  }
}
