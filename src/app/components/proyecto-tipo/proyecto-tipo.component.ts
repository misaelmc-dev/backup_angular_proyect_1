import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ProyectoTipoService } from "../../services/proyecto-tipo.service";
import {CommonService} from "../../services/common.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-proyecto-tipo',
  templateUrl: './proyecto-tipo.component.html',
  styleUrls: ['./proyecto-tipo.component.css']
})
export class ProyectoTipoComponent implements OnInit {

  proyectotipo: any[] = [];
  /* Variables de paginacion */
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  showLoadingBar = false;
  paginationId = 'paginationDaily';
  //variable modal
  modalRef: any;
  provectoTipoId: any = '';
  provectoTipoTipo: any = '';
  provectoTipoPorciento: any = '';
  proyectoTipoCosto: any = '';
  proyectoTipoPrivada: boolean = false;
  search: string = '';


  constructor(private proyectoTipoService: ProyectoTipoService,
              private commonService: CommonService,
              private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadProyectosTipos();
  }

  loadProyectosTipos = () => {
    this.showLoadingBar = true;
    this.proyectoTipoService.getProyectoTipoList().subscribe((res: any) => {
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
      this.proyectotipo = res;
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

  searchProyectoTipoByCriterio(){
    this.proyectoTipoService.searchProyectoTipo(this.search).subscribe((res: any) => {
      let resumenes: any[] = [];
      for (const [value] of Object.entries(res)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      let paginate = this.commonService.paginateItems(resumenes, this.pageNumberDiarias, this.pageSizeDiarias);
      this.dataSource = paginate.data;
      this.totalItemsDiarias = paginate.total;
      this.showLoadingBar = false;
      this.proyectotipo = res;
    })
  }

  getProyectoTipoById = (crit: any, template: TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
    let proy = crit;
    this.provectoTipoId = proy.id;
    this.provectoTipoTipo = proy.tipo;
    this.provectoTipoPorciento = proy.porciento_mano_obra;
    this.proyectoTipoCosto = proy.costo_m2;
    this.proyectoTipoPrivada = proy.privada;
  }

  handlePageDiariasChange = (event: number) => {
    this.pageNumberDiarias = event;
    this.loadProyectosTipos();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.provectoTipoId = '';
    this.provectoTipoTipo = '';
    this.provectoTipoPorciento = '';
    this.proyectoTipoCosto = '';
    this.proyectoTipoPrivada = false;
  }

  changeCheck = () => {
    if(this.proyectoTipoPrivada){this.proyectoTipoPrivada = false;
    }else{this.proyectoTipoPrivada = true;}
  }

  addProyectoTipo = (tipo:string, porciento:any, costo:any) => {
    console.log("tipo:",tipo,"porciento:",porciento,"costo:",costo,"privada:",this.proyectoTipoPrivada);
    if(tipo){
      this.proyectoTipoService.addProyectoTipo(tipo,porciento,costo,this.proyectoTipoPrivada).subscribe((res: any) => {
        console.log("Cargado", res);
        this.modalRef.hide();
        this.loadProyectosTipos();
        this.ngOnInit();
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo agregar',
        text: 'Se necesita ingresar un tipo de proyecto'
      });
    }
  }

  updateProyectosTipos = (claveid:number,tipo:string, porciento:any, costo:any) => {
    console.log("tipo:",tipo,"porciento:",porciento,"costo:",costo,"privada:",this.proyectoTipoPrivada);
    if(tipo){
      this.proyectoTipoService.updateProyectoTipo(claveid,tipo,porciento,costo,this.proyectoTipoPrivada).subscribe((resUpdate: any) => {});
      this.provectoTipoId = '';
      this.provectoTipoTipo = '';
      this.provectoTipoPorciento = '';
      this.proyectoTipoCosto = '';
      this.proyectoTipoPrivada = false;
      this.modalRef.hide();
      this.loadProyectosTipos();
      this.ngOnInit();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar',
        text: 'Se nesesita ingresar un tipo de proyecto'
      })
    }
  }

  deleteProyectosTipos = (crit: any) => {
    let proy = crit;
    this.provectoTipoId = proy.id;
    this.provectoTipoTipo = proy.tipo;
    this.provectoTipoPorciento = proy.porciento_mano_obra;
    this.proyectoTipoCosto = proy.costo_m2;
    this.proyectoTipoPrivada = proy.privada;

    Swal.fire({
      title: '¿Deseas eliminar este tipo de proyecto?',
      text: this.provectoTipoTipo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proyectoTipoService.deleteProyectoTipo(this.provectoTipoId).subscribe((resDelete: any) => {});
        this.loadProyectosTipos();
        this.ngOnInit();
      }
    })
    this.loadProyectosTipos();
    this.ngOnInit();
  }

  clearFilters () {
    this.ngOnInit()
  }
}
