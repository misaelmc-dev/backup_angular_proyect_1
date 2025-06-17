import {Component, OnInit, TemplateRef} from '@angular/core';
import {ProyectoService} from "../../services/proyecto.service";
import {CommonService} from "../../services/common.service";
import {BsModalService} from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import * as moment from "moment";

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  proyectos: any[] = [];
  proyectos_tipo: any[] = [];
  /* Variables de paginacion */
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  showLoadingBar = false;
  paginationId = 'paginationDaily';
  //variable modal
  modalRef: any;
  proyectosId: any = '';
  proyectosName: any = '';
  proyectosRegistro: any = '';
  proyectosSuperficie: any = '';
  proyectosPropietario: any = '';
  proyectosMonto: any = '';
  proyectosFechaini: any = '';
  proyectosFechafin: any = '';
  proyectosUbicacion: any = '';
  proyectosCodigo: any = '';
  proyectosTipo: any = '';
  proyectosTipoId: any = '';
  proyectosTipoValue: any = '';
  search: string = '';

  constructor(private proyectoService: ProyectoService,
              private commonService: CommonService,
              private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadProyectos();
  }

  loadProyectos= () => {
    this.showLoadingBar = true;
    this.proyectoService.getProyectList().subscribe((res: any) => {
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
      this.proyectos = res;
    })
    this.proyectoService.getProyectosTipos().subscribe((resProyTipo: any) => {
      let resumenes: any[] = [];
      for (const [value] of Object.entries(resProyTipo)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      this.orderBy(resProyTipo);
      this.proyectos_tipo = resProyTipo;
    })
    this.showLoadingBar = false;
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.id < n2.id) {return 1;}
      if (n1.id > n2.id) {return -1;}
      return 0;
    });
  }

  searchProyectosByCriterio(){
    this.proyectoService.searchProyecto(this.search).subscribe((res: any) => {
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
      this.proyectos = res;
      this.showLoadingBar = false;
    })
  }

  getProyectosById = (crit: any, template: TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
    let proy = crit;
    console.log("criterio",crit);
    this.proyectosId = proy.id;
    this.proyectosName = proy.nombre;
    this.proyectosMonto = proy.monto;
    this.proyectosTipo = proy.tipo;
    if(this.proyectosId){
      for(let tipo_proy of this.proyectos_tipo){
        if(proy.tipo_id==tipo_proy.id){
          this.proyectosTipoId = tipo_proy.id;
          this.proyectosTipoValue = tipo_proy.tipo;
        }
      }
    }else{
      this.proyectosTipoId = '';
      this.proyectosTipoValue = '';
    }
    this.proyectosFechaini = moment(proy.fecha_inicio).format('YYYY-MM-DD');
    this.proyectosFechafin = moment(proy.fecha_fin).format('YYYY-MM-DD');
    this.proyectosCodigo = proy.cod_biotime;
    this.proyectosUbicacion = proy.ubicacion;
    this.proyectosRegistro = proy.registro_obra;
    this.proyectosPropietario = proy.reg_obra_propietario_o_num_aviso_ubic_obra;
    this.proyectosSuperficie = proy.superficie;
  }

  handlePageDiariasChange = (event: number) => {
    this.pageNumberDiarias = event;
    this.loadProyectos();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.proyectosId = '';
    this.proyectosName = '';
    this.proyectosMonto = '';
    this.proyectosTipo = '';
    this.proyectosTipoId = '';
    this.proyectosTipoValue = '';
    this.proyectosFechaini = '';
    this.proyectosFechafin = '';
    this.proyectosCodigo = '';
    this.proyectosUbicacion = '';
    this.proyectosRegistro = '';
    this.proyectosPropietario = '';
    this.proyectosSuperficie = '';
  }

  addProyectos = (name:string,registro:string,superficie:string,propietario:string,monto:string,FI:string,FF:string,ubicacion:string,proycodigo:string,tipo:string) => {
    console.log("name",name,"registro",registro,"superficie",superficie,"propietario",propietario,"monto",monto,"Fecha ini",FI,"Fecha fin",FF,"ubicacion",ubicacion,"proycodigo",proycodigo,"tipo",tipo);
    if(name){
      if(tipo){
      this.proyectoService.addProyecto(name,registro,superficie,propietario,monto,FI,FF,ubicacion,proycodigo,tipo).subscribe((res: any) => {
        console.log("Cargado", res);
        this.modalRef.hide();
        this.loadProyectos();
        this.ngOnInit();
      });
      }else{Swal.fire({icon: 'error',title: 'No se pudo agregar',text: 'Se debe seleccionar un tipo de proyecto'});}
    }else{Swal.fire({icon: 'error',title: 'No se pudo agregar',text: 'Se debe ingresar un nombre de proyecto'});}
  }

  updateProyectos = (claveid:number,name:string,registro:string,superficie:string,propietario:string,monto:string,FI:string,FF:string,ubicacion:string,proycodigo:string,proytipo:string) => {
    console.log("name",name,"registro",registro,"superficie",superficie,"propietario",propietario,"monto",monto,"Fecha ini",FI,"Fecha fin",FF,"ubicacion",ubicacion,"proycodigo",proycodigo,"tipo",proytipo);
    if(name){
      if(proytipo){
      this.proyectoService.updateProyecto(claveid,name,registro,superficie,propietario,monto,FI,FF,ubicacion,proycodigo,proytipo).subscribe((resUpdate: any) => {
        this.proyectosId = '';
        this.proyectosName = '';
        this.proyectosMonto = '';
        this.proyectosTipo = '';
        this.proyectosTipoId = '';
        this.proyectosTipoValue = '';
        this.proyectosFechaini = '';
        this.proyectosFechafin = '';
        this.proyectosCodigo = '';
        this.proyectosUbicacion = '';
        this.proyectosRegistro = '';
        this.proyectosPropietario = '';
        this.proyectosSuperficie = '';
        this.modalRef.hide();
        this.loadProyectos();
        this.ngOnInit();
      });
      }else{Swal.fire({icon: 'error',title: 'No se pudo actualizar',text: 'Se debe ingresar un tipo de proyecto'})}
    }else{Swal.fire({icon: 'error',title: 'No se pudo actualizar',text: 'Se debe ingresar un nombre de proyecto'})}
  }

  deleteProyectos = (crit: any) => {
    let entity = crit;
    this.proyectosId = entity.id;
    this.proyectosName = entity.nombre;

    Swal.fire({
      title: '¿Deseas eliminar el proyecto?',
      text: this.proyectosName,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proyectoService.deleteProyecto(this.proyectosId).subscribe((resDelete: any) => {
          console.log("Eliminado",resDelete);
          this.loadProyectos();
          this.ngOnInit();
        });
      }
    })
  }

  clearFilters () {
    this.ngOnInit()
  }
}
