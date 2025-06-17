import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {TrabajadorService} from 'src/app/services/trabajador.service';

@Component({
  selector: 'app-trabajador-detalle',
  templateUrl: './trabajador-detalle.component.html',
  styleUrls: ['./trabajador-detalle.component.css']
})
export class TrabajadorDetalleComponent implements OnInit {

  trabajadorId:number = Number(this.route.snapshot.paramMap.get('id'));
  trabajador:any[]=[];

  trabajadorNombre:string='';
  trabajadorApellidos:string='';
  trabajadorRfc:string='';
  trabajadorCurp:string='';
  trabajadorNss:string='';
  trabajadorFechaNacimiento:string='';
  trabajadorFechaCreacion:string='';
  trabajadorFechaActualizacion:string='';
  trabajadorFechaEliminacion:string='';
  trabajadorGenero:boolean=false;
  trabajadorNombreGenero:string='';
  trabajadorCorreo:string='';
  trabajadorTelefono:any='';
  trabajadorDomicilio:string='';
  trabajadorPersonaContacto:string='';
  trabajadorTelefonoContact:string='';
  trabajadorEntidad:any;
  entidadFechaAlta:string='';
  entidadSueldo:any;
  entidadAltaIMSS:string='';
  trabajadorCategoria:any;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private trabajadorService: TrabajadorService
              ) { }

  ngOnInit(): void {
    this.loadTrabajador();
  }

  loadTrabajador = () => {
    this.trabajadorService.getWorkerById(this.trabajadorId).subscribe((resT: any)=>{
      this.trabajadorId=resT.id;
      this.trabajadorNombre=resT.nombre;
      this.trabajadorApellidos=resT.apellidos;
      this.trabajadorRfc=resT.rfc;
      this.trabajadorCurp=resT.curp;
      this.trabajadorNss=resT.nss;
      this.trabajadorFechaNacimiento=resT.fecha_nacimiento;
      this.trabajadorFechaCreacion=resT.created_at;
      this.trabajadorFechaActualizacion=resT.updated_at;
      this.trabajadorFechaEliminacion=resT.deleted_at;
      if(resT.genero=='m' || resT.genero==null){
        this.trabajadorGenero=false;
        this.trabajadorNombreGenero='Masculino';
      }else if(resT.genero=='f'){
        this.trabajadorGenero=true;
        this.trabajadorNombreGenero='Femenino';
      }
      this.trabajadorCorreo=resT.correo;
      this.trabajadorTelefono=resT.telefono;
      this.trabajadorDomicilio=resT.domicilio;
      this.trabajadorPersonaContacto=resT.nombre_persona_contacto;
      this.trabajadorTelefonoContact=resT.telefono_persona_contacto;
      this.trabajadorEntidad=resT.entidades[0].nombre;
      this.entidadFechaAlta=resT.entidades[0].fecha_alta;
      this.entidadSueldo=resT.entidades[0].sueldo_total;
      this.entidadAltaIMSS=resT.entidades[0].clinica_alta_imss;
      this.trabajadorCategoria=resT.entidades[0].categorias[0].nombre;
    })
  }

}
