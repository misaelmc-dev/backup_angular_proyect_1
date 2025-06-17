import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-asistencia',
  templateUrl: './control-asistencia.component.html',
  styleUrls: ['./control-asistencia.component.css']
})
export class ControlAsistenciaComponent implements OnInit {
  showDiario: boolean = false
  /**
   * ¿Se debe mostrar o no asistencia semanal?
   */
  showSemanal: boolean = false
  /**
   * ¿Se debe mostrar o no asistencia mensual?
   */
  showMensual: boolean = false

  title:string = '';

  constructor() {
  }

  ngOnInit() {
    this.displayTitle();
  }

  displayTitle(){
    if(this.showSemanal==false && this.showMensual==false){
      this.title = "Reporte Diario";
      this.showDiario=true;
      this.showSemanal=false;
      this.showMensual=false;
    }else if(this.showDiario==true){
      this.title = "Reporte Diario";
    }else if(this.showSemanal==true){
      this.title = "Reporte Semanal";
    }else if(this.showMensual==true){
      this.title = "Reporte Mensual";
    }
  }
  onAsistenciaDiariaSeleccionada() {
    this.showDiario=true;
    this.showSemanal=false;
    this.showMensual=false;
    this.displayTitle();
  }
  /**
   * Muestra el contenido del tab de asistencia semanal
   */

  onAsistenciaSemanalSeleccionada() {
    this.showDiario=false;
    this.showSemanal=true;
    this.showMensual=false;
    this.displayTitle();
  }

  /**
   * Muestra el contenido del tab de asistecia mensual
   */
  onAsistenciaMensualSeleccionada() {
    this.showDiario=false;
    this.showSemanal=false;
    this.showMensual=true;
    this.displayTitle();
  }
}
