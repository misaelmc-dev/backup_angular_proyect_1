import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CategoriaService } from "../../services/categoria.service";
import {CommonService} from "../../services/common.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categorias: any[] = [];
  /* Variables de paginacion */
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  showLoadingBar = false;
  paginationId = 'paginationDaily';
  //variable modal
  modalRef: any;
  categoriaId: any = '';
  categoriaNombre: any = '';
  categoriaCodigo: any = '';
  search: string = '';

  constructor(private categoriaService: CategoriaService,
              private commonService: CommonService,
              private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias = () => {
    this.categoriaService.getCategoriasList().subscribe((res: any) => {
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
      this.showLoadingBar = false;
      this.categorias = res;
    });
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.nombre < n2.nombre) {return 1;}
      if (n1.nombre > n2.nombre) {return -1;}
      return 0;
    });
  }

  searchCategoriasByCriterio(){
    this.categoriaService.searchCategorias(this.search).subscribe((res: any) => {
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
      this.showLoadingBar = false;
      this.categorias = res;
    })
  }

  getCategoriaById = (crit: any, template: TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
    let cat = crit;
    this.categoriaId = cat.id;
    this.categoriaNombre = cat.nombre;
    this.categoriaCodigo = cat.cod_biotime;
  }

  handlePageDiariasChange = (event: number) => {
    this.pageNumberDiarias = event;
    this.loadCategorias();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.categoriaId = '';
    this.categoriaNombre = '';
    this.categoriaCodigo = '';
  }

  addCategorias = (name:string, code:any) => {
    console.log("name", name ,"code", code);
    if(name){
      this.categoriaService.addCategoria(name,code).subscribe((res: any) => {
        console.log("subido", res);
        this.modalRef.hide();
        this.loadCategorias();
        this.ngOnInit();
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo agregar',
        text: 'Se debe ingresar un nombre de categoría'
      });
    }
  }

  updateCategorias = (clave:number,name:string,code:string) => {
    console.log("name", name ,"code", code);
    if(name){
      this.categoriaService.updateCategoria(clave,name,code).subscribe((resUpdate: any) => {
        this.categoriaId = '';
        this.categoriaNombre = '';
        this.categoriaCodigo = '';
        this.modalRef.hide();
        this.loadCategorias();
        this.ngOnInit();
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar',
        text: 'Se debe ingresar un nombre de categoría'
      });
    }
  }

  deleteCategoriasById = (crit: any) => {
    let cat = crit;
    this.categoriaId = cat.id;
    this.categoriaNombre = cat.nombre;
    this.categoriaCodigo = cat.cod_biotime;
    Swal.fire({
      title: '¿Confirma la eliminación de la categoría?',
      text: this.categoriaNombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.deleteCategoria(this.categoriaId).subscribe((resDelete: any) => {
          this.loadCategorias();
          this.ngOnInit();
        });
      }
    })
  }

  clearFilters() {
    this.ngOnInit()
  }
}
