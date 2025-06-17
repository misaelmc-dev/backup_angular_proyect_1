import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-asistencia-entidad',
  templateUrl: './control-asistencia-entidad.component.html',
  styleUrls: ['./control-asistencia-entidad.component.css']
})
export class ControlAsistenciaEntidadComponent implements OnInit {
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
    if(!this.showSemanal && !this.showMensual){
      this.title = "Reporte Diario";
      this.showDiario=true;
      this.showSemanal=false;
      this.showMensual=false;
    }else if(this.showDiario){
      this.title = "Reporte Diario";
    }else if(this.showSemanal){
      this.title = "Reporte Semanal";
    }else if(this.showMensual){
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
