import {Component, OnInit, SecurityContext, TemplateRef} from '@angular/core';
import {CommonService} from "../../../../services/common.service";
import {EntidadesService} from "../../../../services/entidades.service";
import {TrabajadorService} from "../../../../services/trabajador.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ExportService} from "../../../../services/export.service";
import {ExcelJson} from "../../../../interfaces/excel-json";
import * as moment from "moment";
import Swal from "sweetalert2";
import {BsModalService} from "ngx-bootstrap/modal";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-matriz-altas-bajas-entidad',
  templateUrl: './matriz-altas-bajas-entidad.component.html',
  styleUrls: ['./matriz-altas-bajas-entidad.component.css']
})
export class MatrizAltasBajasEntidadComponent implements OnInit {

  entidadId: number
  trabajadores:any[]=[];
  matriz:any[]=[];
  disabledFilters:boolean = true;
  selectedTrabajador:any='';
  selectedTipo:any='';
  numeroTrabajadores:boolean=false;
  selected:boolean=true;
  trabajadorString:string='';
  tipoString:string='';
  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  paginationId = 'paginationDaily';
  showLoadingBar = false;

  today = new Date();
  fecha_desde = '';
  fecha_hasta = '';

  nombrecompleto = '';
  fechafinal = '';
  estado = '';

  modalRef: any;
  motivoBaja :string='';

  constructor(private commonService: CommonService,
              private entidadService: EntidadesService,
              private trabajadoresService: TrabajadorService,
              private domSanitizer: DomSanitizer,
              private exportService: ExportService,
              private modalService: BsModalService,
              private route: ActivatedRoute)
  {
    this.entidadId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadTrabajadores();
  }

  loadTrabajadores = () => {
    this.trabajadoresService.getWorkersList(this.entidadId).subscribe((resT:any) => {
      this.orderBy(resT);
      this.trabajadores = resT;
    });
  }

  openMotivoModal = (trabajador:any,template: TemplateRef<any>) => {
    this.motivoBaja = '';
    this.motivoBaja = trabajador.motivo_baja;
    this.modalRef = this.modalService.show(template);
  }

  getMatrizList = () => {
    this.matriz = [];
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    if(this.selectedTipo=='alta'){this.tipoString='&solo_altas=';
    }else if(this.selectedTipo=='baja'){this.tipoString='&solo_bajas=';
    }else{this.tipoString='';}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+`&entidades=${this.entidadId}`+''+this.trabajadorString+''+this.tipoString;
    this.trabajadoresService.getWorkersUpDown(consulta).subscribe((resM: any) => {
      this.matriz = resM;
      this.pagination(this.matriz);
    });
  }

  selectedMatrizTipo = () => {
    this.cleanPagination();
    this.getMatrizList();
  }

  exportToExcel = () => {
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    if(this.selectedTipo=='alta'){this.tipoString='&solo_altas=';
    }else if(this.selectedTipo=='baja'){this.tipoString='&solo_bajas=';
    }else{this.tipoString='';}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+`&entidades=${this.entidadId}`+''+this.trabajadorString+''+this.tipoString;
    this.trabajadoresService.getWorkersUpDown(consulta).subscribe((res: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          { // table headers
            A: 'Id tranajador',
            B: 'Nombre',
            C: 'Nombre de la entidad',
            D: 'Estatus',
            E: 'Fecha'
          },
        ],
        skipHeader: true,
      };
      res.forEach((item: any) => {
        this.nombrecompleto = item.nomb_trab+''+item.apell_trab;
        if(item.alta){this.estado='Alta'}else{this.estado='Baja'}
        if(item.fecha_alta){
          this.fechafinal=moment(item.fecha_alta).format('YYYY-MM-DD');
        }else{
          this.fechafinal=moment(item.fecha_baja).format('YYYY-MM-DD');
        }
        udt.data.push({
          A: item.id_trab,
          B: this.nombrecompleto,
          C: item.nomb_ent,
          D: this.estado,
          E: this.fechafinal
        });
      });
      edata.push(udt);
      this.exportService.exportMatrizColor(edata, 'Matriz de altas y bajas');
      this.showLoadingBar = false;
    });
  }

  viewContrato = (archivo:string) => {
    this.trabajadoresService.viewBajaFile(archivo).subscribe((resfile: Blob) => {
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore
      window.open(fileUrl.toString(), '_blank');
    });
  }

  cleanFilters() {
    window.location.reload();
  }

  handlePageDiariasChange = (event: number) => {
    this.pageNumberDiarias = event;
    this.getMatrizList();
  }

  dateRangeCreated(event: any) {
    this.fecha_desde = event[0].toJSON().split('T')[0];
    this.fecha_hasta = event[1].toJSON().split('T')[0];
    var f1 = moment(this.fecha_desde).format('DD/MM/YYYY');;
    var f2 = moment(this.fecha_hasta).format('DD/MM/YYYY');;
    var dias = this.restaFechas(f1,f2);
    if(dias<=60){
      this.disabledFilters = false;
      this.getMatrizList();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Filtrado no valido',
        text: 'El periodo máximo de búsqueda es de 2 meses'
      });
    }
  }

  orderBy = (sin_orden: any) => {
    let con_orden: any[] = sin_orden;
    con_orden.sort((n1,n2) => {
      if (n1.nombre > n2.nombre) {return 1;}
      if (n1.nombre < n2.nombre) {return -1;}
      return 0;
    });
  }

  restaFechas = (f1:any,f2:any) => {
    var aFecha1 = f1.split('/');
    var aFecha2 = f2.split('/');
    var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
    var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
  }

  pagination = (data:any) => {
    let resumenes: any[] = [];
    for (const [key, value] of Object.entries(data)) {
      let response = value as any;
      let data = response.data;
      resumenes = resumenes.concat(data);
    }
    let paginate = this.commonService.paginateItems(resumenes, this.pageNumberDiarias, this.pageSizeDiarias);
    this.dataSource = paginate.data;
    this.totalItemsDiarias = paginate.total;
  }

  cleanPagination = () => {
    this.dataSource = [];
    this.pageSizeDiarias = 10;
    this.pageNumberDiarias = 1;
    this.totalItemsDiarias = '';
    this.paginationId = 'paginationDaily';
  }
}
