import {Component, OnInit, SecurityContext, TemplateRef} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {EntidadesService} from "../../services/entidades.service";
import {TrabajadorService} from "../../services/trabajador.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ExportService} from "../../services/export.service";
import {ExcelJson} from "../../interfaces/excel-json";
import * as moment from "moment";
import Swal from "sweetalert2";
import {BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-matriz-altas-bajas',
  templateUrl: './matriz-altas-bajas.component.html',
  styleUrls: ['./matriz-altas-bajas.component.css']
})
export class MatrizAltasBajasComponent implements OnInit {

  entidades:any[]=[];
  trabajadores:any[]=[];
  matriz:any[]=[];

  disabledFilters:boolean = true;

  selectedEntidad:any='';
  selectedTrabajador:any='';
  selectedTipo:any='';

  numeroEntidades:boolean=false;
  numeroTrabajadores:boolean=false;

  selected:boolean=true;

  entidadString:string='';
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
              private modalService: BsModalService

  ) { }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadTrabajadores();
  }

  loadEntidades = () => {
    this.commonService.getEntidades().subscribe((resE: any) => {
      this.entidades = resE;
    })
  }

  loadTrabajadores = () => {
    this.trabajadoresService.getWorkersList().subscribe((resT:any) => {
      this.orderBy(resT);
      this.trabajadores = resT;
    });
  }

  getTrabajadoresByEntidad(){
    this.pageNumberDiarias = 1;
    if(!this.selectedTrabajador){
      this.numeroTrabajadores=false;
      this.trabajadores=[];
      this.selectedTrabajador='';
      this.trabajadoresService.getWorkersByEntity(this.selectedEntidad).subscribe((resTR:any) => {
        if(resTR.length==1){this.numeroTrabajadores=true;
        }else{this.numeroTrabajadores=false;}
        this.trabajadores=resTR;
      });
    }
    this.cleanPagination();
    this.getMatrizList();
  }

  getEntidadByTrabajador(){
    this.pageNumberDiarias = 1;
    if(!this.selectedEntidad){
      this.numeroEntidades=false;
      this.entidades=[];
      this.selectedEntidad='';
      this.entidadService.getEntityByWorker(this.selectedTrabajador).subscribe((resET: any) => {
        if(resET.length==1){this.numeroEntidades=true;
        }else{this.numeroEntidades=false;}
        this.entidades=resET;
      });
    }
    this.cleanPagination();
    this.getMatrizList();
  }

  openMotivoModal = (trabajador:any,template: TemplateRef<any>) => {
    this.motivoBaja = '';
    this.motivoBaja = trabajador.motivo_baja;
    this.modalRef = this.modalService.show(template);
  }

  getMatrizList = () => {
    this.matriz = [];
    if(this.selectedEntidad){this.entidadString='&entidades='+this.selectedEntidad;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    if(this.selectedTipo=='alta'){this.tipoString='&solo_altas=';
    }else if(this.selectedTipo=='baja'){this.tipoString='&solo_bajas=';
    }else{this.tipoString='';}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+this.entidadString+''+this.trabajadorString+''+this.tipoString;
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
    if(this.selectedEntidad){this.entidadString='&entidades='+this.selectedEntidad;}
    if(this.selectedTrabajador){this.trabajadorString='&trabajadores='+this.selectedTrabajador;}
    if(this.selectedTipo=='alta'){this.tipoString='&solo_altas=';
    }else if(this.selectedTipo=='baja'){this.tipoString='&solo_bajas=';
    }else{this.tipoString='';}
    const consulta = 'fecha_desde='+this.fecha_desde+'&fecha_hasta='+this.fecha_hasta+''+this.entidadString+''+this.trabajadorString+''+this.tipoString;
    this.trabajadoresService.getWorkersUpDown(consulta).subscribe((res: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'', },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'', },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'', },
          { // table headers
            A: '',
            B: 'Nombre de la entidad',
            C: 'Id Trabajador',
            D: 'Nombre',
            E: 'Estatus',
            F: 'Fecha',
            G: ''
          },
        ],
        skipHeader: true,
      };
      res.forEach((item: any) => {
        this.nombrecompleto = item.nomb_trab+' '+item.apell_trab;
        if(item.alta){this.estado='Alta'}else{this.estado='Baja'}
        if(item.fecha_alta){
          this.fechafinal=moment(item.fecha_alta).format('YYYY-MM-DD');
        }else{
          this.fechafinal=moment(item.fecha_baja).format('YYYY-MM-DD');
        }
        udt.data.push({
          A: '',
          B: item.nomb_ent,
          C: item.id_trab,
          D: this.nombrecompleto,
          E: this.estado,
          F: this.fechafinal,
          G: ''
        });
      });
      edata.push(udt);
      let dia = moment(new Date()).format()
      this.exportService.exportEconomicReport(edata, 'Matriz de altas y bajas_'+dia);
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
    this.pageNumberDiarias = 1;
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
