import {Component, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EntidadesService } from "../../services/entidades.service";
import { ProyectoService } from "../../services/proyecto.service";
import { BsModalService } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";

@Component({
  selector: 'app-entidad-detalle',
  templateUrl: './entidad-detalle.component.html',
  styleUrls: ['./entidad-detalle.component.css']
})
export class EntidadDetalleComponent implements OnInit {

  entidadId:number = Number(this.route.snapshot.paramMap.get('id'));
  entidadNombre = '';
  entidadRfc = '';
  entidadPersonaFisica = '';
  entidadCorreo = '';
  entidadTelefono = '';
  entidadDomicilio = '';
  entidadPais = '';
  entidadCiudad = '';
  entidadWebpage = '';
  entidadCodBiotime = '';
  entidadCodPostal = '';
  proyectos: any[] = [];
  proyectosEntidad: any[] = [];
  proyectosDisponibles: any[] = [];
  //variable modal
  modalRef: any;
  proyectoId = '';

  trabajadores: any[] = [];

  constructor(private route: ActivatedRoute,
              private location: Location,
              private entidadesService: EntidadesService,
              private proyectoService: ProyectoService,
              private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getEntidadId();
    this.getProyectosByEntidad();
    this.getTrabajadoresByEntidad();
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.id < n2.id) {return 1;}
      if (n1.id > n2.id) {return -1;}
      return 0;
    });
  }

  getEntidadId(): void {
    this.entidadesService.getEntidadesById(this.entidadId).subscribe((res: any) => {
      console.log("entidades",res);
      this.entidadNombre = res.nombre;
      this.entidadRfc = res.rfc;
      this.entidadPersonaFisica = res.persona_fisica;
      this.entidadCorreo = res.correo;
      this.entidadTelefono = res.telefono;
      this.entidadDomicilio = res.domicilio;
      this.entidadPais = res.pais;
      this.entidadCiudad = res.ciudad;
      this.entidadWebpage = res.webpage;
      this.entidadCodBiotime = res.cod_biotime;
      this.entidadCodPostal = res.cod_postal;
    });
  }

  getProyectosByEntidad(){
    this.proyectoService.getProyectList().subscribe((res: any) => {
      this.proyectos = res;
      this.proyectoService.getProyectoByEntityId(this.entidadId).subscribe((res: any) => {
        this.proyectosEntidad = res.data;
        this.proyectosDisponibles = this.proyectos;
        for(let entity of this.proyectosEntidad){
          this.proyectosDisponibles = this.proyectosDisponibles.filter( ({ id }) => id != entity.id );
        }
      });
    });
  }

  getTrabajadoresByEntidad = () => {
    this.entidadesService.getWorkersByEntity(this.entidadId).subscribe((resworkers: any) => {
      this.trabajadores = resworkers;
      console.log("trabajadores",resworkers);
    });
  }

  openAddModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.proyectoId = '';
  }

  asignarProyectoToEntidad(entidadId:number,proyectoid:any){
    this.proyectoService.addProyectoToEntity(entidadId,proyectoid).subscribe((res: any) => {
      console.log(res);
    });
    this.getProyectosByEntidad();
    this.modalRef.hide();
  }

  eliminarProyectoToEntidad(entidadId:number,proyectoid:any){
    this.proyectoService.deleteProyectoToEntity(entidadId,proyectoid).subscribe((res: any) => {
      console.log(res);
    });
    this.getProyectosByEntidad();
    this.modalRef.hide();
  }
}
