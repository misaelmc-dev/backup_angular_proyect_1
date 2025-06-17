import {Component, OnInit, TemplateRef} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {UsuariosService} from "../../services/usuarios.service";
import {BsModalService} from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import * as moment from "moment";
import {EntidadesService} from "../../services/entidades.service";


@Component({
  selector: 'app-control-usuarios',
  templateUrl: './control-usuarios.component.html',
  styleUrls: ['./control-usuarios.component.css']
})
export class ControlUsuariosComponent implements OnInit {

  usuarios: any[] = [];
  entidades: any[] = [];
  entidadesDisponibles: any[] = [];
  showLoadingBar = false;
  /* Variables de paginacion */
  dataSource: any[] = [];
  pageSize = 10;
  pageNumber = 1;
  totalItems: any;
  paginationId = 'paginationDaily';
  //variable modal
  modalRef: any;
  usuarioName: string = '';
  usuarioEmail: string = '';
  usuarioRole: string = 'entidad';
  usuarioEntidad: any = '';
  usuarioPass: string = '';
  usuarioPassComfirm: string = '';

  constructor(private usuariosService: UsuariosService,
              private commonService: CommonService,
              private modalService: BsModalService,
              private entidadesService: EntidadesService
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadEntidades();
    this.loadEntidadesDisponibles();
  }

  loadUsuarios= () => {
    this.showLoadingBar = true;
    this.usuariosService.getUsersList().subscribe((resUsers: any) => {
      let resumenes: any[] = [];
      for (const [value] of Object.entries(resUsers)) {
        let response = value as any;
        let data = response.data;
        resumenes = resumenes.concat(data);
      }
      this.orderBy(resUsers);
      let paginate = this.commonService.paginateItems(resumenes, this.pageNumber, this.pageSize);
      this.dataSource = paginate.data;
      this.totalItems = paginate.total;
      this.usuarios = resUsers;
    })
    this.showLoadingBar = false;
  }

  loadEntidades = () => {
    this.showLoadingBar = true;
    this.entidadesService.getEntidadesList().subscribe((resEntidad: any) => {
      this.entidades = resEntidad;
    })

    this.showLoadingBar = false;
  }

  loadEntidadesDisponibles(){
    this.entidadesService.getEntidadesList().subscribe((resEntidad: any) => {
      this.usuariosService.getUsersList().subscribe((resUsers: any) => {
        this.entidadesDisponibles = resEntidad;
        for(let entity of resEntidad){
          for(let user of resUsers){
            if(user.role=='entidad'){
              if(user.entidad_id == entity.id){
                this.entidadesDisponibles = this.entidadesDisponibles.filter(({ id }) => id != entity.id);
              }
            }
          }
        }
      });
    });
  }

  addUserModal = (template: TemplateRef<any>) => {
    this.modalRef = this.modalService.show(template);
  }

  addUser = () => {
    console.log("name",this.usuarioName,"email",this.usuarioEmail,"role",this.usuarioRole,"entidad_id",this.usuarioEntidad,"password",this.usuarioPass,"Confirmacion",this.usuarioPassComfirm);
    if(this.usuarioName){
      if(this.usuarioEmail){
        if(this.usuarioPass){
          if(this.usuarioPass.length>7){
            if(this.usuarioPassComfirm){
              if(this.usuarioPass==this.usuarioPassComfirm){
                this.usuariosService.addUser(this.usuarioName, this.usuarioEmail, this.usuarioRole, this.usuarioEntidad, this.usuarioPass, this.usuarioPassComfirm).subscribe((res: any) => {
                  console.log("Guardado", res);
                  this.ngOnInit();
                  this.loadUsuarios();
                  this.closeModal();
                });
              }else{Swal.fire({icon: 'error',title: 'No se pudo registrar',text: 'Las contraseñas no coinsiden, intentalo de nuevo'});}
            }else{Swal.fire({icon: 'error',title: 'No se pudo registrar',text: 'Debe de confirmar la contraseña'});}
          }else{Swal.fire({icon: 'error',title: 'No se pudo registrar',text: 'La contraseña debe de tener más de 8 caracteres'});}
        }else{Swal.fire({icon: 'error',title: 'No se pudo registrar',text: 'Debe ingresar una contraseña'});}
      }else{Swal.fire({icon: 'error',title: 'No se pudo registrar',text: 'Debe ingresar un correo Electronico'});}
    }else{Swal.fire({icon: 'error',title: 'No se pudo registrar',text: 'Debe ingresar un nombre de Usuario'});}
  }

  deleteUser = (user:any) => {
    Swal.fire({
      title: '¿Deseas eliminar el usuario?',
      text: user.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteUser(user.id).subscribe((resDelete: any) => {
          console.log("Eliminado",resDelete);
          this.loadUsuarios();
          this.ngOnInit();
        });
      }
    })
  }

  closeModal = () => {
    this.modalRef.hide();
    this.usuarioName = '';
    this.usuarioEmail = '';
    this.usuarioRole = 'entidad';
    this.usuarioEntidad = '';
    this.usuarioPass = '';
    this.usuarioPassComfirm = '';
  }

  changeCheck = () => {
    if(this.usuarioRole=='entidad'){
      this.usuarioRole = 'admin';
    }else{
      this.usuarioRole = 'entidad';
    }
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.id < n2.id) {return 1;}
      if (n1.id > n2.id) {return -1;}
      return 0;
    });
  }

  handlePageDiariasChange = (event: number) => {
    this.pageNumber = event;
    this.loadUsuarios();
  }

}

