import {Component, EventEmitter, OnInit, Output, SecurityContext} from '@angular/core';
import {EntidadesService} from "../../services/entidades.service";
import {ProyectoService} from "../../services/proyecto.service";
import {CommonService} from "../../services/common.service";
import {ContratoService} from "../../services/contrato.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ExcelJson} from "../../interfaces/excel-json";
import {ExportService} from "../../services/export.service";
import * as moment from "moment";

@Component({
  selector: 'app-control-contratos-cumplimiento',
  templateUrl: './control-contratos-cumplimiento.component.html',
  styleUrls: ['./control-contratos-cumplimiento.component.css']
})
export class ControlContratosCumplimientoComponent implements OnInit {

  @Output() eventClean = new EventEmitter<string>();

  selectedEntidad:any='';
  selectedProyecto:any='';
  numeroEntidades:boolean=false;
  numeroProyectos:boolean=false;
  entidades:any[]=[];
  entidad:any=[];
  proyectos:any[]=[];
  proyecto:any=[];
  contratos:any[]=[];
  contratosObser:any[]=[];
  searchEntidad:boolean=false;
  searchProyecto:boolean=false;

  dataSource: any[] = [];
  pageSizeDiarias = 10;
  pageNumberDiarias = 1;
  totalItemsDiarias: any;
  showLoadingBar = false;

  proyectoString:string='';
  entidadString:string='';
  proyectoId:number=0;
  entidadId:number=0;

  entidadesList:any[]=[];

  razon:string="";
  observaciones:string="";

  constructor(private entidadService: EntidadesService,
              private proyectoService: ProyectoService,
              private commonService: CommonService,
              private contratoService: ContratoService,
              private domSanitizer: DomSanitizer,
              private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadProyectos();
    this.loadObservaciones();
  }

  loadEntidades = () => {
    this.entidadService.getEntidadesList().subscribe((res: any) => {
      this.entidades = res;
      this.entidadesList = res;
    })
  }

  loadProyectos = () => {
    this.proyectoService.getProyectList().subscribe((res: any) => {
      this.proyectos = res;
    });
  }

  loadObservaciones = () => {
    const criteriob = '?no_paginate=&proyecto=&entidad=';
    this.contratoService.getObservacionesDataList(criteriob).subscribe((res: any) => {
      this.contratosObser = res;
    });
  }

  getProyectoByEntidad = () => {
    this.numeroProyectos = false;
    if(!this.selectedProyecto){
      this.proyectos=[];
      this.selectedProyecto='';
      let criteriope = this.selectedEntidad;
      this.proyectoService.getProyectoByEntity(criteriope).subscribe((res: any) => {
        if(res.length == 1){
          this.numeroProyectos = true;
          this.proyecto = res[0];
          this.proyectoId = res[0].id;
        }else{
          this.numeroProyectos = false;
          this.proyectos = res;
        }
        this.orderBy(res);
      });
    }else{
      this.searchProyecto = true;
    }
    this.getContratosList();
  }

  getEntidadByProyecto = () => {
    this.numeroEntidades = false;
    if(!this.selectedEntidad){
      this.entidades=[];
      let criterioep = `de_proyectos=${this.selectedProyecto}&no_paginate`;
      this.commonService.getEntidadesByProyect(criterioep).subscribe((res: any) => {
        if(res.length == 1){
          this.numeroEntidades = true;
          this.entidad = res[0];
          this.entidadId = res[0].id;
        }else{
          this.numeroEntidades = false;
          this.entidades = res;
        }
        this.orderBy(res);
      });

    }else{
      this.searchEntidad==true;
    }
    this.getContratosList();
  }

  getContratosList = () => {
    this.showLoadingBar = true;
    if(this.selectedEntidad){this.entidadString='&de_entidades='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&de_proyectos='+this.selectedProyecto;}
    const criterio = '?no_paginate='+this.proyectoString+''+this.entidadString;
    this.contratoService.getContratosData(criterio).subscribe((res: any) => {
      let resumenes: any[] = [];
      for (const [key, value] of Object.entries(res)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      let paginate = this.commonService.paginateItems(resumenes, this.pageNumberDiarias, this.pageSizeDiarias);
      this.dataSource = paginate.data;
      this.totalItemsDiarias = paginate.total;
      this.contratos = res;
    });
    if(this.selectedProyecto){this.proyectoString='&proyecto='+this.selectedProyecto;}
    if(this.selectedEntidad){this.entidadString='&entidad='+this.selectedEntidad;}
    const criteriob = '?no_paginate='+this.proyectoString+''+this.entidadString;
    this.contratoService.getObservacionesDataList(criteriob).subscribe((res: any) => {
      this.contratosObser = res;
    });
    this.showLoadingBar = false;
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.nombre > n2.nombre) {return 1;}
      if (n1.nombre < n2.nombre) {return -1;}
      return 0;
    });
  }

  viewContrato = (archivo:string) => {
    this.contratoService.viewContratFile(archivo).subscribe((resfile: Blob) => {
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore
      window.open(fileUrl.toString(), '_blank');
    });
  }

  exportToExcel = () => {
    this.showLoadingBar = true;
    if(this.selectedEntidad){this.entidadString='&de_entidades='+this.selectedEntidad;}
    if(this.selectedProyecto){this.proyectoString='&de_proyectos='+this.selectedProyecto;}
    const criterio = '?no_paginate='+this.proyectoString+''+this.entidadString;
    this.contratoService.getContratosData(criterio).subscribe((resCont: any) => {
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'' },
          { A:'',B:'',C:'',D:'',E:'',F:'',G:'' },
          {
            A: '',
            B: 'Razon social',
            C: 'Numero de contrato',
            D: 'Firmas',
            E: 'Registro de Obra',
            F: 'Comentarios',
            G: ''
          },
        ],
        skipHeader: true,
      };
      resCont.forEach((item: any) => {
        this.entidadesList.forEach((entity:any) => {
          if(item.entidad_id==entity.id){this.razon = entity.nombre;}
        });
        this.observaciones='';
        this.contratosObser.forEach((observa:any) => {
          if(item.entidad_id==observa._entidad_que_ejecuta_proyecto.entidad_id && item.proyecto_id==observa._entidad_que_ejecuta_proyecto.proyecto_id){
            if(this.observaciones){this.observaciones = this.observaciones+'*'+observa.observacion+" "+"                                                                                                                                                               "+" ";}
            else{this.observaciones = '*'+observa.observacion+" "+"                                                                                                                                                                                                    "+" ";}
          }
        });
        udt.data.push({
          A: '',
          B: this.razon,
          C: item.num_contrato,
          D: item.estatus,
          E: item.num_reg_obra,
          F: this.observaciones,
          G: ''
        });
      });
      edata.push(udt);
      let dia = moment(new Date()).format()
      this.exportService.exportEconomicReport(edata, 'Control de contratos resumen de cumplimiento_'+dia);
      this.showLoadingBar = false;
    });
  }

  cleanFilters() {
    this.eventClean.emit("cumplimiento");
    this.showLoadingBar = false;
    this.selectedEntidad='';
    this.selectedProyecto='';
    this.numeroEntidades=false;
    this.numeroProyectos=false;
    this.entidades=[];
    this.entidad=[];
    this.proyectos=[];
    this.proyecto=[];
    this.contratos=[];
    this.searchEntidad=false;
    this.searchProyecto=false;
    this.dataSource=[];
    this.pageSizeDiarias = 10;
    this.pageNumberDiarias = 1;
    this.proyectoString='';
    this.entidadString='';
    this.proyectoId=0;
    this.entidadId=0;
    this.entidadesList=[];
    this.razon="";
    this.observaciones="";
    this.showLoadingBar = true;
    this.ngOnInit();
  }

}
