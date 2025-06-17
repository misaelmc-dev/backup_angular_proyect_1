import { Component, OnInit } from '@angular/core';
import {ProyectoService} from "../../services/proyecto.service";
import {ProyectoPageable} from "../../interfaces/proyecto";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-dg-proyectos',
  templateUrl: './dg-proyectos.component.html',
  styleUrls: ['./dg-proyectos.component.css']
})
export class DgProyectosComponent implements OnInit {

  proyectoPageable!: ProyectoPageable;
  pageNumber = 1;
  pageSize = 15;
  dataSource: any[] = [];
  entidades: any[] = [];
  selectedEntidad!: any;

  constructor(private proyectoService: ProyectoService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadProyectos();
  }

  loadProyectos = () => {
    this.proyectoService.findProyectosByPage(this.pageSize).subscribe((res: any) => {
      this.proyectoPageable = res;
      this.dataSource = this.proyectoPageable.data;
    });
  }

  loadEntidades = () => {
    this.commonService.getEntidades().subscribe((res: any)=>{
      this.entidades = res;
    })
  }

}
