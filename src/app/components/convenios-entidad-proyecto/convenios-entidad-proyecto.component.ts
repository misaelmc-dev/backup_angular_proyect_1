import {Component, OnInit, SecurityContext, TemplateRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ConvenioService} from "../../services/convenio.service";
import {ContratoService} from "../../services/contrato.service";
import {BsModalService} from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import {DomSanitizer} from "@angular/platform-browser";
import {EntidadesService} from "../../services/entidades.service";
import {ProyectoService} from "../../services/proyecto.service";

@Component({
  selector: 'app-convenios-entidad-proyecto',
  templateUrl: './convenios-entidad-proyecto.component.html',
  styleUrls: ['./convenios-entidad-proyecto.component.css']
})
export class ConveniosEntidadProyectoComponent implements OnInit {

  //variables recibidas
  entidadId:number = Number(this.route.snapshot.paramMap.get('ide'));
  proyectoId:number = Number(this.route.snapshot.paramMap.get('idp'));
  entidadNombre:string = '';
  proyectoNombre:string = '';

  convenios: any[] = [];
  observaciones: any[] = [];
  contrato: any = [];
  estatusList: any[] = [{name:'Presentado'},{name:'Sin firmas'},{name:'Faltan firmas'},{name:'Firmado'},{name:'Vencido'}];

  //variable modal
  modalRef: any;
  convenioId: any = '';
  convenioEntidad: string = this.entidadNombre;
  convenioProyecto: string = this.proyectoNombre;
  convenioDescripcion: any = '';

  contratoId: any = '';

  observacionId: any = '';
  observacionObs: any = '';

  constructor(private route: ActivatedRoute,
              private convenioService: ConvenioService,
              private contratoService: ContratoService,
              private modalService: BsModalService,
              private domSanitizer: DomSanitizer,
              private entidadService: EntidadesService,
              private proyectoService: ProyectoService
  ) { }

  ngOnInit(): void {
    this.loadContratos();
    this.loadConvenios();
    this.loadObservaciones();
    this.loadEntityAndProyects();
  }

  loadEntityAndProyects = () => {
    this.entidadService.getEntidadesByProyect(this.proyectoId).subscribe((resEntit: any) => {
      for(let i = 0; i < resEntit.data.length; i++){
        if(resEntit.data[i].id==this.entidadId){this.entidadNombre = resEntit.data[i].nombre;this.convenioEntidad = this.entidadNombre;}
      }
    });
    this.proyectoService.getProyectoById(this.proyectoId).subscribe((resProy: any) => {
    this.proyectoNombre = resProy.nombre;
    this.convenioProyecto = this.proyectoNombre;
    });
  }

  loadContratos = () => {
    this.contratoService.getContratos(this.entidadId,this.proyectoId).subscribe((resCont: any) => {
      this.orderBy(resCont);
      this.contrato = resCont[0];
      this.contratoId = resCont[0].id;
    });
  }

  loadConvenios = () => {
    this.convenioService.getConveniosList(this.entidadId,this.proyectoId).subscribe((res: any) => {
      this.orderBy(res);
      this.convenios = res;
    });
  }

  loadObservaciones = () => {
    this.contratoService.getObservacionesList(this.entidadId,this.proyectoId).subscribe((res: any) => {
      this.orderBy(res);
      this.observaciones = res;
    });
  }

  openAddModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openAddObservacion(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openUpdateModal(convenio:any , template: TemplateRef<any>) {
    this.convenioId = convenio.id;
    this.convenioDescripcion = convenio.descripcion;
    this.modalRef = this.modalService.show(template);
  }

  openUpdateContrato(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openUpdateObservacion(observacion:any , template: TemplateRef<any>) {
    this.observacionId = observacion.id;
    this.observacionObs = observacion.observacion;
    this.modalRef = this.modalService.show(template);
  }

  closeModal(){
    this.convenioId = '';
    this.convenioDescripcion = '';
    this.contratoId = '';
    this.observacionId = '';
    this.observacionObs = '';
    this.modalRef.hide();
  }

  orderBy = (res: any) => {
    let orderres: any[] = res;
    orderres.sort((n1,n2) => {
      if (n1.id < n2.id) {return 1;}
      if (n1.id > n2.id) {return -1;}
      return 0;
    });
  }

  addConvenio = (descripcion:string) => {
    this.convenioDescripcion = descripcion;
    this.convenioService.addConvenios(this.entidadId,this.proyectoId,this.convenioDescripcion).subscribe((res: any) => {
      console.log("Guardado",res);
    });
    this.loadConvenios();
    this.ngOnInit();
    this.closeModal();
  }

  addObservacion = (observacion:string) => {
    this.observacionObs = observacion;
    this.contratoService.addObservaciones(this.entidadId,this.proyectoId,this.observacionObs).subscribe((res: any) => {
      console.log("Guardado",res);
    });
    this.loadObservaciones()
    this.ngOnInit();
    this.closeModal();
  }

  updateConvenio = (id:number,descripcion:string) => {
    this.convenioId = id ;
    this.convenioDescripcion = descripcion;
    this.convenioService.updateConvenios(this.convenioId,this.convenioDescripcion).subscribe((res: any) => {
      console.log("Actualizado",res);
    });
    this.loadConvenios();
    this.ngOnInit();
    this.closeModal();
  }

  updateContrato = (contratoFI:string,contratoFF:string,contratoNum:string,contratoMonto:string,contratoFFI:string,contratoDes:string,contratoReg:string,contratoSup:string,contratoEstatus:string) => {
    this.contratoService.updateContratos(this.entidadId,this.proyectoId,contratoFI,contratoFF,contratoNum,contratoMonto,contratoFFI,contratoDes,contratoReg,contratoSup,contratoEstatus).subscribe((res: any) => {
      console.log("Actualizado",res);
    });
    this.loadContratos();
    this.ngOnInit();
    this.closeModal();
  }

  updateObservacion = (id:number,observacion:string) => {
    this.observacionId = id ;
    this.observacionObs = observacion;
    this.contratoService.updateObservaciones(this.observacionId,this.observacionObs).subscribe((res: any) => {
      console.log("Actualizado",res);
    });
    this.loadObservaciones();
    this.ngOnInit();
    this.closeModal();
  }

  deleteConvenio = (convenio:any) => {
    this.convenioId = convenio.id;
    Swal.fire({
      title: '¿Deseas eliminar el convenio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.convenioService.deleteConvenios(this.convenioId).subscribe((resDelete: any) => {
          console.log("Eliminado",resDelete);
        });
        this.loadConvenios();
        this.ngOnInit();
        this.closeModal();
      }
    });
  }

  deleteObservacion = (observacion:any) => {
    Swal.fire({
      title: '¿Deseas eliminar la observación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contratoService.deleteObservaciones(observacion.id).subscribe((resDelete: any) => {
          console.log("Eliminado",resDelete);
        });
        this.loadObservaciones();
        this.ngOnInit();
        this.closeModal();
      }
    });
  }

  uploadConvenios = async (convenio: any) => {
    this.convenioId = convenio.id;
    const { value: file } = await Swal.fire({
      title: 'Seleccionar documento',
      input: 'file',
      inputAttributes: {
        'accept': 'application/pdf,application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'aria-label': 'Upload Convenio'
      },
      confirmButtonText: 'Guardar Archivo',
      confirmButtonColor: '#198754',
      showCancelButton: true
    })

    if (file){
      this.convenioService.uploadFile(this.convenioId , file).subscribe((res:any) => {
        this.loadConvenios();
        this.ngOnInit();
        this.closeModal();
        this.messageAlert(res, 'success');
      }, (err: any) => {
        this.messageAlert(err.error, 'error');
      });
    }
  }

  uploadContrato = async () => {
    const { value: file } = await Swal.fire({
      title: 'Seleccionar documento',
      input: 'file',
      inputAttributes: {
        'accept': 'application/pdf,application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'aria-label': 'Upload Convenio'
      },
      confirmButtonText: 'Guardar Archivo',
      confirmButtonColor: '#198754',
      showCancelButton: true
    })

    if (file){
      this.contratoService.uploadContratFile(this.entidadId,this.proyectoId,file).subscribe((res:any) => {
        this.loadContratos();
        this.ngOnInit();
        this.closeModal();
        this.messageAlert(res, 'success');
      }, (err: any) => {
        this.messageAlert(err.error, 'error');
      });
    }
  }

  messageAlert = (message: string, type: string) => {
    if (type === 'success'){
      Swal.fire('', message, 'success');
    }else {
      Swal.fire('', message, 'error');
    }
  }

  viewConvenio = (convenio: any) => {
    this.convenioService.viewFile(convenio.archivo_url).subscribe((resfile: Blob) => {
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile));
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl);
      // @ts-ignore
      window.open(fileUrl.toString(), '_blank');
    });
  }

  viewContrato = () => {
    this.contratoService.viewContratFile(this.contrato.archivo_url).subscribe((resfile: Blob) => {
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore
      window.open(fileUrl.toString(), '_blank');
    });
  }

  downConvenio = (convenio: any) => {
    Swal.fire({
      title: '¿Deseas eliminar el documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.convenioService.deleteFile(convenio.archivo_url).subscribe((resfile: any) => {
          console.log("Eliminado",resfile);
        });
        this.loadConvenios();
        this.ngOnInit();
        this.closeModal();
      }
    });
  }

  downContrato = () => {
    Swal.fire({
      title: '¿Deseas eliminar el documento de contrato?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contratoService.deleteContratFile(this.contrato.archivo_url).subscribe((resfile: any) => {
          console.log("Eliminado",resfile);
        });
        this.loadContratos();
        this.ngOnInit();
        this.closeModal();
      }
    });
  }
}
