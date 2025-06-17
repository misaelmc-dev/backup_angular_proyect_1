import {Component, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EntidadesService } from "../../services/entidades.service";
import { ProyectoService } from "../../services/proyecto.service";
import { BsModalService } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";

@Component({
  selector: 'app-proyecto-detalle',
  templateUrl: './proyecto-detalle.component.html',
  styleUrls: ['./proyecto-detalle.component.css']
})
export class ProyectoDetalleComponent implements OnInit {

  proyectoId:number = Number(this.route.snapshot.paramMap.get('id'));
  proyectoNombre = '';
  proyectoRegistro = '';
  proyectoSuperficie = '';
  proyectoPropietario = '';
  proyectoMonto = '';
  proyectoFI = '';
  proyectoFF = '';
  proyectoUbicacion = '';
  proyectoCodigo = '';
  proyectoTipoId = '';
  proyectoTipoNombre = '';

  entidades: any[] = [];
  entidadesProyecto: any[] = [];
  entidadesDisponibles: any[] = [];
  //variable modal
  modalRef: any;
  entidadId = '';

  trabajadores: any[] = [];

  constructor(private route: ActivatedRoute,
              private location: Location,
              private entidadesService: EntidadesService,
              private proyectoService: ProyectoService,
              private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getProyectoId();
    this.getEntidadesByProyecto();
    this.getTrabajadoresByProyecto();
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.id < n2.id) {return 1;}
      if (n1.id > n2.id) {return -1;}
      return 0;
    });
  }

  getProyectoId(): void {
    this.proyectoService.getProyectoById(this.proyectoId).subscribe((res: any) => {
      this.proyectoNombre = res.nombre;
      this.proyectoRegistro = res.registro_obra;
      this.proyectoSuperficie= res.superficie;
      this.proyectoPropietario = res.reg_obra_propietario_o_num_aviso_ubic_obra;
      this.proyectoMonto = res.monto;
      this.proyectoFI = res.fecha_inicio;
      this.proyectoFF = res.fecha_fin;
      this.proyectoUbicacion = res.ubicacion;
      this.proyectoCodigo = res.cod_biotime;
      this.proyectoTipoId = res.tipo.id;
      this.proyectoTipoNombre = res.tipo.tipo;
    });
  }

  getEntidadesByProyecto = () =>{
    this.entidadesService.getEntidadesList().subscribe((res: any) => {
      this.entidades = res;
      this.entidadesService.getEntidadesByProyect(this.proyectoId).subscribe((resentproy: any) => {
        this.entidadesProyecto = resentproy.data;
        this.entidadesDisponibles = this.entidades ;
        for(let entity of this.entidadesProyecto){
          this.entidadesDisponibles = this.entidadesDisponibles.filter( ({ id }) => id != entity.id );
        }
      });
    });
  }

  getTrabajadoresByProyecto = () => {
    this.proyectoService.getWorkersByProyect(this.proyectoId).subscribe((resworkers: any) => {
      this.trabajadores = resworkers;
    });
  }

  openAddModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.entidadId = '';
  }

  asignarEntidadToProyecto(entidadId:any,proyectoid:any){
    console.log("entidad",entidadId,"proyecto",proyectoid);
    this.proyectoService.addProyectoToEntity(entidadId,proyectoid).subscribe((res: any) => {
      console.log(res);
    });
    this.getEntidadesByProyecto();
    this.getTrabajadoresByProyecto();
    this.ngOnInit();
    this.modalRef.hide();
  }

  eliminarEntidadToProyecto(entidadId:number,proyectoid:any){
    this.proyectoService.deleteProyectoToEntity(entidadId,proyectoid).subscribe((res: any) => {
      console.log(res);
    });
    this.getEntidadesByProyecto();
    this.getTrabajadoresByProyecto();
    this.ngOnInit()
    this.modalRef.hide();
  }

}
