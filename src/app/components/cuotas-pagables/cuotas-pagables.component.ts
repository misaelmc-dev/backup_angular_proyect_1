import { Component, OnInit, TemplateRef} from '@angular/core';
import { CuotasService } from "../../services/cuotas.service";
import {BsModalService} from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import * as moment from "moment";
import {ProyectoService} from "../../services/proyecto.service";
import {EntidadesService} from "../../services/entidades.service";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-cuotas-pagables',
  templateUrl: './cuotas-pagables.component.html',
  styleUrls: ['./cuotas-pagables.component.css']
})
export class CuotasPagablesComponent implements OnInit {

  cuotasPagables: any[] = [];
  tiposCuotas: any[] = [];
  showLoadingBar = false;
  /* Variables de paginacion */
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  paginationId = 'paginationDaily';
  /*Varibles Modal*/
  modalRef: any;
  cuotaId: any = '';
  cuotaNombre: any = '';
  cuotaTipo: any = '';
  cuotaNombreTipo: any = '';
  cuotaValor: any = '';
  cuotaPorcentaje: boolean = false;

  constructor(private cuotasPagablesService: CuotasService,
              private commonService: CommonService,
              private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadCuotasPagables();
  }

  loadCuotasPagables = () => {
    this.showLoadingBar = true;
    this.cuotasPagablesService.getCuotasPagablesList().subscribe((resCuotasPagables: any) => {
      let resumenes: any[] = [];
      for (const [value] of Object.entries(resCuotasPagables)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      this.orderBy(resCuotasPagables);
      this.cuotasPagables = resCuotasPagables;
    });
    this.cuotasPagablesService.getTipoCuotalist().subscribe((resTiposCuotas: any) => {
      let resumenes: any[] = [];
      for (const [value] of Object.entries(resTiposCuotas)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      this.orderBy(resTiposCuotas);
      this.tiposCuotas = resTiposCuotas;
    });
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

  handlePageDiariasChange = (event: number) => {
    this.pageNumberDiarias = event;
    this.loadCuotasPagables();
  }

  updateCuotaPagable = (claveid:number,name:string,tipo_cuota_id:string,valor:string) => {
    //console.log("claveid",claveid,"name",name,"tipo_cuota_id",tipo_cuota_id,"valor",valor,"es_porcent",this.cuotaPorcentaje);
    if(name){
      this.cuotasPagablesService.updateCuotasPagables(claveid,name,tipo_cuota_id,valor,this.cuotaPorcentaje).subscribe((resUpdate: any) => {});
      this.cuotaId = '';
      this.cuotaNombre = '';
      this.cuotaTipo = '';
      this.cuotaNombreTipo = '';
      this.cuotaValor = '';
      this.cuotaPorcentaje = false;
      this.modalRef.hide();
      this.loadCuotasPagables();
      this.ngOnInit();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar',
        text: 'Debe ingresar un nombre de entidad'
      })
    }
  }

  changeCheck = () => {
    if(this.cuotaPorcentaje){this.cuotaPorcentaje = false;
    }else{this.cuotaPorcentaje = true;}
  }

  openModal(cuota:any,template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.cuotaId = cuota.id;
    this.cuotaNombre = cuota.nombre;
    this.cuotaTipo = cuota.tipo_cuota_id;
    this.cuotaValor = cuota.valor;
    this.cuotaPorcentaje = cuota.es_porcent;
    for(let tipos of this.tiposCuotas){
      if(tipos.id==this.cuotaTipo){
        this.cuotaNombreTipo = tipos.tipo;
      }
    }
  }
}
