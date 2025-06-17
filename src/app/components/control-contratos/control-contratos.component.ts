import { Component, OnInit,  } from '@angular/core';

@Component({
  selector: 'app-control-contratos',
  templateUrl: './control-contratos.component.html',
  styleUrls: ['./control-contratos.component.css']
})
export class ControlContratosComponent implements OnInit {

  showMatriz: boolean = false;
  showCumplimiento: boolean = false;
  title:string = '';

  constructor() {
  }

  ngOnInit() {
    this.displayTitle();
  }

  displayTitle(){
    if(this.showMatriz==false && this.showCumplimiento==false){
      this.title = "Matriz de control";
      this.showMatriz=true;
      this.showCumplimiento=false;
    }else if(this.showMatriz==true){
      this.title = "Matriz de control";
    }else if(this.showCumplimiento==true){
      this.title = "Cumplimiento";
    }
  }

  onMatrizSeleccionada() {
    this.showMatriz=true;
    this.showCumplimiento=false;
    this.displayTitle();
  }

  onCumplimientoSeleccionada() {
    this.showMatriz=false;
    this.showCumplimiento=true;
    this.displayTitle();
  }

  cleanTarget(target: string) {
    if(target=="matriz"){
      window.location.reload();
    }else if(target=="cumplimiento"){
      this.onCumplimientoSeleccionada();
    }
  }
}
