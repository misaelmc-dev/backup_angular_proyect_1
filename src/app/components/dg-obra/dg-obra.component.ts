import { Component, OnInit } from '@angular/core';
import {ProyectoService} from "../../services/proyecto.service";
import {Proyecto} from "../../interfaces/proyecto";
import {FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'app-dg-obra',
  templateUrl: './dg-obra.component.html',
  styleUrls: ['./dg-obra.component.css']
})
export class DgObraComponent implements OnInit {

  proyectos: any[] = [];
  proyecto!: Proyecto;
  proyectoId!: any;
  proyectoControl = new FormControl();
  proyectoFormBuilder: FormBuilder = new FormBuilder();
  proyectoForm = this.proyectoFormBuilder.group({
    id: new FormControl({ value: '', disabled: true }),
    nombre: new FormControl(''),
    registro_obra: new FormControl(''),
    superficie: new FormControl(''),
    reg_obra_propietario_o_num_aviso_ubic_obra: new FormControl(''),
    tipo: new FormControl(''),
    clase: new FormControl(''),
    monto: new FormControl({ value: '', disabled: true }),
    fecha_inicio_tentativa: new FormControl(''),
    fecha_fin_tentativa: new FormControl(''),
    fecha_inicio: new FormControl(''),
    fecha_fin: new FormControl(''),
    ubicacion: new FormControl(''),
    created_at: new FormControl(''),
    updated_at: new FormControl(''),
    deleted_at: new FormControl(''),
    cod_biotime: new FormControl(''),
  });

  constructor(private proyectoService: ProyectoService) { }

  ngOnInit(): void {
    this.getProyectlist();
  }

  getProyectlist = () => {
    this.proyectoService.getProyectList().subscribe((result: any) => {
      this.proyectos = result;
    });
  }

  getProductById = () => {
    this.proyectoService.getProductoById(this.proyectoId).subscribe((result: any) => {
      this.proyecto = result;
      this.proyectoForm = this.proyectoFormBuilder.group({
        nombre: new FormControl(result.nombre),
        registro_obra: new FormControl(result.registro_obra),
        superficie: new FormControl(result.superficie),
        reg_obra_propietario_o_num_aviso_ubic_obra: new FormControl(result.reg_obra_propietario_o_num_avis),
        tipo: new FormControl(result.tipo),
        clase: new FormControl(result.clase),
        monto: new FormControl(result.monto),
        fecha_inicio_tentativa: new FormControl(result.fecha_inicio_tentativa),
        fecha_fin_tentativa: new FormControl(result.fecha_fin_tentativa),
        fecha_inicio: new FormControl(result.fecha_inicio),
        fecha_fin: new FormControl(result.fecha_fin),
        ubicacion: new FormControl(result.ubicacion),
        created_at: new FormControl(result.created_at),
        updated_at: new FormControl(result.updated_at),
        deleted_at: new FormControl(result.deleted_at),
        cod_biotime: new FormControl(result.cod_biotime),
      });
    });
  }

}
