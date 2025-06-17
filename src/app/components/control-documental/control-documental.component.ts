import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DocumentoService } from 'src/app/services/documento.service';

@Component({
  selector: 'app-control-documental',
  templateUrl: './control-documental.component.html',
  styleUrls: ['./control-documental.component.css']
})
export class ControlDocumentalComponent implements OnInit {

  // documentoPageable!: DocumentoPageable;
  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  dataSource: any[] = [];
  tiposDocumento: any[] = [];
  estado!: string;

  entidades: any[] = [];
  proyectos: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};
  entidadesValues = '';
  tipoDocumento!: any;

  constructor(private documentoService: DocumentoService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.getTipoDocumentos();
    this.initMSEntidades();
  }

  initMSEntidades = () => {

    this.commonService.getEntidades().subscribe((res: any) => {
      this.entidades = res.map((item: any) => { return {'id': item.id, 'nombre':item.nombre} });
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'nombre',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: this.entidades.length,
        allowSearchFilter: true
      };
    });
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    if (this.selectedItems.length === 1){
      this.entidadesValues = this.entidadesValues.concat(item.id);
    }else {
      this.entidadesValues = this.entidadesValues.concat(' ').concat(item.id);
    }
    this.loadDocumentosEntidades();
  }
  onSelectAll(items: any) {
    this.selectedItems = items;
    this.entidadesValues = items.map((item: any) => item.id).join(' ');
    this.loadAllDocuments();
  }
  onItemUnselect(item: any) {
    if (this.selectedItems.length > 0){
      this.entidadesValues = this.selectedItems.map((item: any) => item.id).join(' ');
      this.loadDocumentosEntidades();
    }else {
      this.loadAllDocuments();
    }
  }

  handlePageChange(event: any) {
    this.pageNumber = event;
    if (this.tipoDocumento){
      this.getDocumentosByTipo();
    }else {
      this.onEstadoSelected();
    }
  }

  getTipoDocumentos = () => {
    this.commonService.getTipoDocumentos().subscribe((res: any) => {
      this.tiposDocumento = res;
    });
  }

  getProyectos = () => {
    this.commonService.getProyectos().subscribe((res: any) => {
      this.proyectos = res;
    });
  }

  onEstadoSelected= () => {
    this.documentoService.getDocumentos(this.estado, '').subscribe((res: any) => {
      let paginate = this.commonService.paginateItems(res, this.pageNumber, this.pageSize);
      this.dataSource = paginate.data;
      this.totalItems = paginate.total;
      console.log(this.dataSource);
    });
  }

  loadAllDocuments = () => {
    this.estado = 'documentos_entregables';
    this.documentoService.getDocumentos(this.estado, '').subscribe((res: any) => {
      let paginate = this.commonService.paginateItems(res, this.pageNumber, this.pageSize);
      this.dataSource = paginate.data;
      this.totalItems = paginate.total;
    });
  }

  loadDocumentosEntidades = () => {
    this.estado = 'entidades';
    this.documentoService.getDocumentos(this.estado, this.entidadesValues).subscribe((res: any) => {
      let paginate = this.commonService.paginateItems(res, this.pageNumber, this.pageSize);
      this.dataSource = paginate.data;
      this.totalItems = paginate.total;
    });
  }

  getDocumentosByTipo = () => {
    this.estado = 'documentos_entregables';
    this.documentoService.getDocumentos(this.estado, '').subscribe((res: any) => {
      this.dataSource = [];
      let result: any[] = [];
      for (const item of res) {
        let id_tipo_doc = parseInt(this.tipoDocumento);
        if (item.id_tipo_doc === id_tipo_doc){
          result.push(item);
        }
      }
      let paginate = this.commonService.paginateItems(result, this.pageNumber, this.pageSize);
      this.dataSource = paginate.data;
      this.totalItems = paginate.total;
      console.log(this.dataSource);
    });
  }

}
