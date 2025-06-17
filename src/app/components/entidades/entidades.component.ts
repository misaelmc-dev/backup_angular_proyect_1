import {Component, OnInit, TemplateRef} from '@angular/core';
import {EntidadesService} from "../../services/entidades.service";
import {CommonService} from "../../services/common.service";
import {BsModalService} from "ngx-bootstrap/modal";
import Swal from "sweetalert2";


@Component({
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  styleUrls: ['./entidades.component.css']
})

export class EntidadesComponent implements OnInit {

  entidades: any[] = [];
  /* Variables de paginacion */
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  showLoadingBar = false;
  paginationId = 'paginationDaily';
  //variable modal
  modalRef: any;
  entidadesId: any = '';
  entidadesName: any = '';
  entidadesRFC: any = '';
  entidadesPesrsonaF: boolean = false ;
  entidadesCorreo: any = '';
  entidadesTelefono: any = '';
  entidadesDomicilio: any = '';
  entidadesPais: any = '';
  entidadesCiudad: any = '';
  entidadesWebPage: any = '';
  entidadesCodigo: any = '';
  entidadesCP: any = '';
  entidadesRegistro: any = '';
  entidadesTipoPatron: any = '';
  search: string = '';

  constructor(private entidadesService: EntidadesService,
              private commonService: CommonService,
              private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadEntidades();
  }

  loadEntidades = () => {
    this.showLoadingBar = true;
    this.entidadesService.getEntidadesList().subscribe((res: any) => {
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
      this.entidades = res;
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

  searchEntidadesByCriterio(){
    this.entidadesService.searchEntidad(this.search).subscribe((res: any) => {
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
      this.entidades = res;
      this.showLoadingBar = false;
    })
  }

  getEntidadById = (crit: any, template: TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
    let entity = crit;
    this.entidadesId = entity.id;
    this.entidadesName = entity.nombre;
    this.entidadesRFC = entity.rfc;
    this.entidadesPesrsonaF = entity.persona_fisica;
    this.entidadesCorreo = entity.correo;
    this.entidadesTelefono = entity.telefono;
    this.entidadesDomicilio = entity.domicilio;
    this.entidadesPais = entity.pais;
    this.entidadesCiudad = entity.ciudad;
    this.entidadesWebPage = entity.webpage;
    this.entidadesCodigo = entity.cod_biotime;
    this.entidadesCP = entity.cod_postal;
    this.entidadesRegistro = entity.registro_patronal;
    this.entidadesTipoPatron = entity.tipo_patron;
  }

  handlePageDiariasChange = (event: number) => {
    this.pageNumberDiarias = event;
    this.loadEntidades();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.entidadesId = '';
    this.entidadesName = '';
    this.entidadesRFC = '';
    this.entidadesPesrsonaF = false;
    this.entidadesCorreo = '';
    this.entidadesTelefono = '';
    this.entidadesDomicilio = '';
    this.entidadesPais = '';
    this.entidadesCiudad = '';
    this.entidadesWebPage = '';
    this.entidadesCodigo = '';
    this.entidadesCP = '';
    this.entidadesRegistro = '';
    this.entidadesTipoPatron = '';
  }

  changeCheck = () => {
    if(this.entidadesPesrsonaF){this.entidadesPesrsonaF = false;
    }else{this.entidadesPesrsonaF = true;}
  }

  addEntidades = (name:string,rfc:string,correo:string,telefono:string,domicilio:string,pais:string,ciudad:string,webpage:string,cod_biotime:string,codigo_postal:string,registro:string,tipo_patron:string) => {
    console.log("name",name,"rfc",rfc,"Persona Fisica",this.entidadesPesrsonaF,"correo",correo,"telefono",telefono,"domicilio",domicilio,"pais",pais,"ciudad",ciudad,"webpage",webpage,"cod_biotime",cod_biotime,"codigo_postal",codigo_postal,"registro",registro,"tipo_patron",tipo_patron);
    if(name){
      this.entidadesService.addEntidad(name,rfc,this.entidadesPesrsonaF,correo,telefono,domicilio,pais,ciudad,webpage,cod_biotime,codigo_postal,registro,tipo_patron).subscribe((res: any) => {
        console.log("Cargado", res);
        this.loadEntidades();
        this.ngOnInit();
      });
      this.modalRef.hide();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo agregar',
        text: 'Debe ingresar un nombre de entidad'
      });
    }
  }

  updateEntidades = (claveid:number,name:string,rfc:string,correo:string,telefono:string,domicilio:string,pais:string,ciudad:string,webpage:string,cod_biotime:string,codigo_postal:string,registro:string,tipo_patron:string) => {
    console.log("id",claveid,"name",name,"rfc",rfc,"Persona Fisica",this.entidadesPesrsonaF,"correo",correo,"telefono",telefono,"domicilio",domicilio,"pais",pais,"ciudad",ciudad,"webpage",webpage,"cod_biotime",cod_biotime,"codigo_postal",codigo_postal,"registro",registro,"tipo_patron",tipo_patron);
    if(name){
      this.entidadesService.updateEntidad(claveid,name,rfc,this.entidadesPesrsonaF,correo,telefono,domicilio,pais,ciudad,webpage,cod_biotime,codigo_postal,registro,tipo_patron).subscribe((resUpdate: any) => {
        this.entidadesId = '';
        this.entidadesName = '';
        this.entidadesRFC = '';
        this.entidadesPesrsonaF = false;
        this.entidadesCorreo = '';
        this.entidadesTelefono = '';
        this.entidadesDomicilio = '';
        this.entidadesPais = '';
        this.entidadesCiudad = '';
        this.entidadesWebPage = '';
        this.entidadesCodigo = '';
        this.entidadesCP = '';
        this.entidadesRegistro = '';
        this.entidadesTipoPatron = '';
        this.modalRef.hide();
        this.loadEntidades();
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar',
        text: 'Debe ingresar un nombre de entidad'
      })
    }
  }

  deleteEntidades = (crit: any) => {
    let entity = crit;
    this.entidadesId = entity.id;
    this.entidadesName = entity.nombre;

    Swal.fire({
      title: '¿Deseas eliminar la entidad?',
      text: this.entidadesName,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.entidadesService.deleteEntidad(this.entidadesId).subscribe((resDelete: any) => {
          console.log("Eliminado",resDelete);
          this.loadEntidades();
          this.ngOnInit();
        });
      }
    })
  }

  clearFilters () {
    this.ngOnInit()
  }
}
