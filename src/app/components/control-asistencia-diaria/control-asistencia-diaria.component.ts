import {Component,OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {AsistenciaService} from "../../services/asistencia.service";
import {ProyectoService} from "../../services/proyecto.service";
import {TrabajadorService} from "../../services/trabajador.service";
import {ExportService} from "../../services/export.service";
import {ExcelJson} from "../../interfaces/excel-json";
import * as moment from "moment";

@Component({
  selector: 'app-control-asistencia-diaria',
  templateUrl: './control-asistencia-diaria.component.html',
  styleUrls: ['./control-asistencia-diaria.component.css']
})
export class ControlAsistenciaDiariaComponent implements OnInit {

  today=new Date();
  diaSelected:any=moment(this.today).format('YYYY-MM-DD');
  criterioBusqueda:string='';
  entidades:any[]=[];
  entidadSelected:number=0;
  proyectos:any[]=[];
  proyectoSelected:number=0;
  trabajadores:any[]=[];
  trabajadorSelected:number=0;


  checkasistencias:string = '';
  checkfaltas:string = '';
  checkincapacidad:string = '';
  checkdescansos:string = '';
  checknolaboro:string = '';

  resumenAsistencia:any[]=[];
  itemsToShow:any[]=[];

  pageNumbers:number = 0;
  pageNumber:number = 1;
  pageNumbersArray:any=[];
  pageStart:number = 0;
  pageEnd:number = 0;
  pageSize:number = 10;
  totalItems:number = 0;
  labelTotalItems:string = '';
  labelTotalPagination:string = '';
  limitStartPage:number = 0;
  limitEndPage:number = 0;
  totalPages:number = 0;

  showLoadingBar:number=0;


  constructor(private commonService: CommonService,
              private asistenciaService: AsistenciaService,
              private proyectoService: ProyectoService,
              private trabajadorService: TrabajadorService,
              private exportService: ExportService) {
  }

  ngOnInit(): void {
    this.cargarEntidades();
    this.cargarProyectos();
    this.cargarTrabajadores();
  }

  crearFecha(event: any){
    this.diaSelected = moment(event).format('YYYY-MM-DD');
    this.obtenerAsistenciasDiarias();
  }

  cargarEntidades(){
    this.showLoadingBar++
    this.commonService.getEntidades().subscribe((resE: any) => {
      this.showLoadingBar--
      this.entidades = this.commonService.orderSimple(resE);
    }, (err:any) => {
      this.showLoadingBar--
      console.error(err)
    });
  }

  cargarTrabajadores(){
    this.showLoadingBar++
    this.asistenciaService.getWorkers().subscribe((resT: any) => {
      this.showLoadingBar--
      this.trabajadores = this.commonService.orderSimple(resT);
    }, (err:any) => {
      this.showLoadingBar--
      console.error(err)
    });
  }

  cargarProyectos(){
    this.showLoadingBar++
    this.commonService.getProyectos().subscribe((resP: any) => {
      this.showLoadingBar--
      this.proyectos = this.commonService.orderSimple(resP);
    }, (err:any) => {
      this.showLoadingBar--
      console.error(err)
    });
  }

  obtenerTrabajadorConProyectoPorIdEntidad(){
    this.limpiarTrabajadores();
    let criteriote = `de_entidad=${this.entidadSelected}&no_paginate`;
    this.trabajadorService.getWorkers(criteriote).subscribe((resTE: any) => {
      if(resTE.length == 1){
        for(let t of resTE){this.trabajadorSelected=t.id}
      }else{
        this.trabajadorSelected=0
      }
      this.trabajadores = resTE;
    });
    this.limpiarProyectos();
    this.proyectoService.getProyectoByEntity(this.entidadSelected).subscribe((resPE: any) => {
      if(resPE.length == 1){
        for(let t of resPE){this.proyectoSelected=t.id;}
      }else{
        this.proyectoSelected=0;
      }
      this.proyectos = resPE;
    });
    this.obtenerAsistenciasDiarias();
  }

  obtenerEntidadConProyectoPorIdTrabajador(){
    this.limpiarEntidades();
    let criterioet = `de_trabajadores=${this.trabajadorSelected}&no_paginate`;
    this.commonService.getEntidadesByWorker(criterioet).subscribe((resET: any) => {
      if(resET.length == 1){
        for(let t of resET){this.entidadSelected=t.id;}
      }else{
        this.entidadSelected = 0;
      }
      this.entidades = resET;
    });
    this.limpiarProyectos();
    let criteriopt = `de_trabajadores=${this.trabajadorSelected}&no_paginate`;
    this.proyectoService.getProyectoByWorker(criteriopt).subscribe((resPT: any) => {
      if(resPT.length == 1){
        for(let t of resPT){this.proyectoSelected=t.id;}
      }else{
        this.proyectoSelected = 0;
      }
      this.proyectos = resPT;
    });
    this.obtenerAsistenciasDiarias();
  }

  obtenerEntidadConTrabajadorPorIdProyecto(){
    this.limpiarEntidades();
    let criterioep = `de_proyectos=${this.proyectoSelected}&no_paginate`;
    this.commonService.getEntidadesByProyect(criterioep).subscribe((resEP: any) => {
      if(resEP.length <= 1){
        for(let t of resEP){this.entidadSelected=t.id;}
      }else{
        this.entidadSelected=0;
      }
      this.entidades = resEP;
    });
    this.limpiarTrabajadores();
    this.trabajadorService.getWorkersByProyect(this.proyectoSelected).subscribe((resTP: any) => {
      if(resTP.length <= 1){
        for(let t of resTP){this.trabajadorSelected=t.id;}
      }else{
        this.trabajadorSelected=0;
      }
      this.trabajadores = resTP;
    });
    this.obtenerAsistenciasDiarias();
  }

  listCheckAsistencias(){
    if(this.checkasistencias==''){this.checkasistencias='&incluye_asistencia=';
    }else{this.checkasistencias='';}
    this.obtenerAsistenciasDiarias();
  }

  listCheckFaltas(){
    if(this.checkfaltas==''){this.checkfaltas='&incluye_falta=';
    }else{this.checkfaltas='';}
    this.obtenerAsistenciasDiarias();
  }

  listCheckIncapacidad(){
    if(this.checkincapacidad==''){this.checkincapacidad='&incluye_incapacidad=';
    }else{this.checkincapacidad='';}
    this.obtenerAsistenciasDiarias();
  }

  listCheckDescansos(){
    if(this.checkdescansos==''){this.checkdescansos='&incluye_descanso=';
    }else{this.checkdescansos='';}
    this.obtenerAsistenciasDiarias();
  }

  listCheckNolaboro(){
    if(this.checknolaboro==''){this.checknolaboro='&incluye_no_laboro=';
    }else{this.checknolaboro='';}
    this.obtenerAsistenciasDiarias();
  }

  obtenerAsistenciasDiarias(){
    this.showLoadingBar++
    var rangoFechas = '';
    var search = '';
    var entidad = '';
    var proyecto = '';
    var trabajador = '';
    if(this.diaSelected){rangoFechas='fecha_desde='+moment(this.diaSelected).format('YYYY-MM-DD')+'&fecha_hasta='+moment(this.diaSelected).format('YYYY-MM-DD')}
    if(this.criterioBusqueda!=''){search='&search='+this.criterioBusqueda}
    if(this.entidadSelected!=0){entidad='&entidades='+this.entidadSelected}
    if(this.proyectoSelected!=0){proyecto='&proyectos='+this.proyectoSelected}
    if(this.trabajadorSelected!=0){trabajador='&trabajadores='+this.trabajadorSelected}
    var consulta = `${rangoFechas}${search}${entidad}${proyecto}${trabajador}${this.checkasistencias}${this.checkfaltas}${this.checkincapacidad}${this.checkdescansos}${this.checknolaboro}`;
    this.asistenciaService.getAsistenciaCriteria(consulta).subscribe((resA: any) => {
      this.showLoadingBar--
      let resumenes: any[] = [];
      for (const [key,value] of Object.entries(resA)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      console.log("resumenes",resumenes)
      this.resumenAsistencia = resumenes;
      this.pageNumber = 1;
      this.cargarPaginacion();
    }, (err:any) => {
      this.showLoadingBar--
      console.error(err)
    });
  }

  colorearFondo(tipo:string){
    var estilo = '';
    switch (tipo) {
      case 'A': estilo = 'green-color'; break;
      case 'F': estilo = 'red-color'; break;
      case 'I': estilo = 'pink-color'; break;
      case 'D': estilo = 'blue-color'; break;
      case 'NL': estilo = 'yellow-color'; break;
    }
    return estilo
  }

  cargarPaginacion(pageValue?:any){
    this.totalItems = this.resumenAsistencia.length;
    this.pageNumbers = Math.ceil(this.totalItems / this.pageSize);
    this.pageNumbersArray = [];
    for(var x=1 ; x<=this.pageNumbers ; x++){
      this.pageNumbersArray.push({"id":x});
    }
    if(pageValue){
      if(pageValue=='prev'){
        this.pageNumber = this.pageNumber-1;
      }else if(pageValue=='next'){
        this.pageNumber = this.pageNumber+1;
      }else{
        this.pageNumber = pageValue;
      }
    }
    this.pageEnd = this.pageNumber * this.pageSize;
    this.pageStart = this.pageEnd - (this.pageSize - 1);
    if(this.pageNumber==this.pageNumbers){
      this.pageEnd = this.totalItems;
    }
    if(this.pageNumber==0 || this.pageNumber==1 || this.pageNumber==2){this.limitStartPage=0}
    if(this.pageNumber>2){this.limitStartPage=this.pageNumber-3}
    if(this.pageNumbersArray.length == this.pageNumber){this.limitEndPage=this.pageNumber}
    if(this.pageNumbersArray.length >= this.pageNumber){this.limitEndPage=this.pageNumber+1}
    let auxPaginas = this.pageNumbersArray
    let auxPaginasShow = []
    var i = 0
    for(let page of this.pageNumbersArray){
      if(i >= this.limitStartPage && i <= this.limitEndPage){
        auxPaginasShow.push(page)
      }
      i++
    }
    this.pageNumbersArray = auxPaginasShow
    var pageNumberSelected=this.pageNumber
    var totalPages = auxPaginas.length
    this.labelTotalItems = "Muestra eventos del "+this.pageStart+" al "+this.pageEnd+", Total: "+this.totalItems;
    this.labelTotalPagination = "Página: "+pageNumberSelected+" de "+totalPages;
    this.totalPages = totalPages;
    this.itemsToShow = this.resumenAsistencia.slice(this.pageStart-1,this.pageEnd);
    console.log("this.resumenAsistencia",this.resumenAsistencia)
    console.log("this.itemsToShow",this.itemsToShow)
  }

  exportarExcel(){
    this.showLoadingBar++
    const edata: Array<ExcelJson> = [];
    const udt: ExcelJson = {
      data: [
        { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'' },
        { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'' },
        { A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'' },
        {
          A: '',
          B: 'ID_empleado',
          C: 'Nombre',
          D: 'Apellidos',
          E: 'Entidad',
          F: 'Cargo',
          G: 'Hora_de_entrada',
          H: 'Estatus',
          I: ''
        }, // table header
      ],
      skipHeader: true,
    };
    this.resumenAsistencia.forEach((item: any) => {
      udt.data.push({
        A: '',
        B: item.trab_id,
        C: item.nomb_trab,
        D: item.apell_trab,
        E: item.ent_nombre,
        F: item.categ,
        G: item.punch_time,
        H: item.status,
        I: ''
      });
    });
    edata.push(udt);
    let dia = moment(new Date()).format()
    this.exportService.exportEconomicReport(edata, 'Reporte asistencia diaria_'+dia);
    this.showLoadingBar--
  }

  limpiarEntidades(){
    this.entidades=[];
    this.entidadSelected=0;
  }

  limpiarTrabajadores(){
    this.trabajadores=[];
    this.trabajadorSelected=0;
  }

  limpiarProyectos(){
    this.proyectos=[];
    this.proyectoSelected=0;
  }

  limpiarFiltros(){
    this.diaSelected='';
    this.criterioBusqueda='';
    this.entidades=[];
    this.entidadSelected=0;
    this.proyectos=[];
    this.proyectoSelected=0;
    this.trabajadores=[];
    this.trabajadorSelected=0;
    this.checkasistencias = '';
    this.checkfaltas = '';
    this.checkincapacidad = '';
    this.checkdescansos = '';
    this.checknolaboro = '';
    this.pageNumber=0;
    this.showLoadingBar=0;
    this.ngOnInit();
  }

}
