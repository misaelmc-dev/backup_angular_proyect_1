import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { defineLocale } from 'ngx-bootstrap/chronos';
import { deLocale } from 'ngx-bootstrap/locale';
import { DatepickerModule } from 'ng2-datepicker';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ModalModule } from "ngx-bootstrap/modal";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule,BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { NgxPaginationModule } from "ngx-pagination";
import { NgxFilesizeModule } from "ngx-filesize";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
defineLocale('es', deLocale);

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TemplateComponent} from './components/layout/template/template.component';
import {DgObraComponent} from './components/dg-obra/dg-obra.component';
import {ControlAsistenciaComponent} from './components/control-asistencia/control-asistencia.component';
import {ControlDocumentalComponent} from './components/control-documental/control-documental.component';
import {ControlContratosComponent} from './components/control-contratos/control-contratos.component';
import {ReporteEconomicoComponent} from './components/reporte-economico/reporte-economico.component';
import {AdminComponent} from './components/admin/admin.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './components/auth/login/login.component';
import {GlobalsVars} from "./global/globals-vars";
import {DgProyectosComponent} from './components/dg-proyectos/dg-proyectos.component';
import {ProyectoService} from "./services/proyecto.service";
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
import {PerfilContratistaComponent} from './components/perfil-contratista/perfil-contratista.component';
import {TrabajadoresComponent} from './components/trabajadores/trabajadores.component';
import {TrabajadorService} from "./services/trabajador.service";
import {DocumentoService} from "./services/documento.service";
import {CommonService} from "./services/common.service";
import {ControlAsistenciaSemanalComponent} from './components/control-asistencia-semanal/control-asistencia-semanal.component';
import {ControlAsistenciaMensualComponent} from './components/control-asistencia-mensual/control-asistencia-mensual.component';
import {ControlAsistenciaDiariaComponent} from './components/control-asistencia-diaria/control-asistencia-diaria.component';
import {ReporteDiasLaboradosComponent} from './components/reporte-dias-laborados/reporte-dias-laborados.component';
import {ReporteCuotasImssPagadasComponent} from './components/reporte-cuotas-imss-pagadas/reporte-cuotas-imss-pagadas.component';
import {ReporteCuotasImssComponent} from './components/reporte-cuotas-imss/reporte-cuotas-imss.component';
import {ReporteResumenCopComponent} from './components/reporte-resumen-cop/reporte-resumen-cop.component';
import {NewEmailComponent} from './components/new-email/new-email.component';
import {AuthenticationInterceptor} from "./interceptors/authentication.interceptor";
import {AccountLayoutComponent} from './components/auth/account-layout/account-layout.component';
import {NotFoundComponent} from './components/http/not-found/not-found.component';
import {UnauthorizedComponent} from './components/http/unauthorized/unauthorized.component';
import {ForgotPasswordEmailComponent} from './components/auth/forgot-password-email/forgot-password-email.component';
import {ForgotPasswordNewPasswdComponent} from './components/auth/forgot-password-new-passwd/forgot-password-new-passwd.component';
import {CategoriasComponent} from './components/categorias/categorias.component';
import {CategoriaService} from "./services/categoria.service";
import {ProyectoTipoComponent} from './components/proyecto-tipo/proyecto-tipo.component';
import {ProyectoTipoService} from "./services/proyecto-tipo.service";
import {TipoDocumentoComponent} from './components/tipo-documento/tipo-documento.component';
import {TipoDocumentoService} from "./services/tipo-documento.service";
import {EntidadesComponent} from './components/entidades/entidades.component';
import {EntidadesService} from "./services/entidades.service";
import {ProyectosComponent} from './components/proyectos/proyectos.component';
import {ProyectoDetalleComponent} from './components/proyecto-detalle/proyecto-detalle.component';
import {EntidadDetalleComponent} from './components/entidad-detalle/entidad-detalle.component';
import {DocumentosEntregablesComponent} from './components/documentos-entregables/documentos-entregables.component';
import {CuotasPagablesComponent} from './components/cuotas-pagables/cuotas-pagables.component';
import {CuotasService} from "./services/cuotas.service";
import {ConveniosEntidadProyectoComponent} from './components/convenios-entidad-proyecto/convenios-entidad-proyecto.component';
import {ContratoService} from "./services/contrato.service";
import {ConvenioService} from "./services/convenio.service";
import {ControlContratosMatrizComponent} from './components/control-contratos-matriz/control-contratos-matriz.component';
import {ControlContratosCumplimientoComponent} from './components/control-contratos-cumplimiento/control-contratos-cumplimiento.component';
import {ControlUsuariosComponent} from './components/control-usuarios/control-usuarios.component';
import {UsuariosService} from "./services/usuarios.service";
import {EntidadDocumentosComponent} from './components/entidad-documentos/entidad-documentos.component';
import {MatrizAltasBajasComponent} from './components/matriz-altas-bajas/matriz-altas-bajas.component';
import {TrabajadorDetalleComponent} from './components/trabajador-detalle/trabajador-detalle.component';
import {IncapacidadesComponent} from './components/incapacidades/incapacidades.component';
import {IncapacidadService} from "./services/incapacidad.service";
import {PagosComponent} from './components/pagos/pagos.component';
import {PagosService} from "./services/pagos.service";
import {ControlAsistenciaEntidadComponent} from './components/perfiles/entidad/asistencia/control-asistencia-entidad/control-asistencia-entidad.component';
import {ControlAsistenciaDiariaEntidadComponent} from './components/perfiles/entidad/asistencia/control-asistencia-diaria-entidad/control-asistencia-diaria-entidad.component';
import {ControlAsistenciaSemanalEntidadComponent} from './components/perfiles/entidad/asistencia/control-asistencia-semanal-entidad/control-asistencia-semanal-entidad.component';
import {ControlAsistenciaMensualEntidadComponent} from './components/perfiles/entidad/asistencia/control-asistencia-mensual-entidad/control-asistencia-mensual-entidad.component';
import {ControlDocumentalEntidadBaseComponent} from './components/perfiles/entidad/control-documental-entidad-base/control-documental-entidad-base.component';
import {IncapacidadesEntidadComponent} from './components/perfiles/entidad/incapacidades-entidad/incapacidades-entidad.component';
import {MatrizAltasBajasEntidadComponent} from './components/perfiles/entidad/matriz-altas-bajas-entidad/matriz-altas-bajas-entidad.component';
import {TrabajadoresCrudEntidadComponent} from './components/perfiles/entidad/trabajadores-crud-entidad/trabajadores-crud-entidad.component';
import {TestingAuthInterceptor} from "./interceptors/testing-auth.interceptor";
import {BodyComponent} from './components/layouts/body/body.component';
import {FooterComponent} from './components/layouts/footer/footer.component';
import {HeaderComponent} from './components/layouts/header/header.component';
import {InfoBannerComponent} from './components/layouts/info-banner/info-banner.component';
import {LoadingModalComponent} from './components/layouts/loading-modal/loading-modal.component';
import {PageComponent} from './components/layouts/page/page.component';
import {SidebarComponent} from './components/layouts/sidebar/sidebar.component';
import {NavigationDirective} from './directives/navigation.directive';
import {InicioComponent } from './components/inicio/inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    DgObraComponent,
    ControlAsistenciaComponent,
    ControlDocumentalComponent,
    ControlContratosComponent,
    ReporteEconomicoComponent,
    AdminComponent,
    LoginComponent,
    DgProyectosComponent,
    PerfilContratistaComponent,
    TrabajadoresComponent,
    ControlAsistenciaSemanalComponent,
    ControlAsistenciaMensualComponent,
    ControlAsistenciaDiariaComponent,
    ReporteDiasLaboradosComponent,
    ReporteCuotasImssPagadasComponent,
    ReporteCuotasImssComponent,
    ReporteResumenCopComponent,
    NewEmailComponent,
    AccountLayoutComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    ForgotPasswordEmailComponent,
    ForgotPasswordNewPasswdComponent,
    CategoriasComponent,
    ProyectoTipoComponent,
    TipoDocumentoComponent,
    EntidadesComponent,
    ProyectosComponent,
    ProyectoDetalleComponent,
    EntidadDetalleComponent,
    DocumentosEntregablesComponent,
    CuotasPagablesComponent,
    ConveniosEntidadProyectoComponent,
    ControlContratosMatrizComponent,
    ControlContratosCumplimientoComponent,
    ControlUsuariosComponent,
    EntidadDocumentosComponent,
    MatrizAltasBajasComponent,
    TrabajadorDetalleComponent,
    IncapacidadesComponent,
    PagosComponent,
    ControlAsistenciaEntidadComponent,
    ControlAsistenciaDiariaEntidadComponent,
    ControlAsistenciaSemanalEntidadComponent,
    ControlAsistenciaMensualEntidadComponent,
    ControlDocumentalEntidadBaseComponent,
    IncapacidadesEntidadComponent,
    MatrizAltasBajasEntidadComponent,
    TrabajadoresCrudEntidadComponent,
    BodyComponent,
    FooterComponent,
    HeaderComponent,
    InfoBannerComponent,
    LoadingModalComponent,
    PageComponent,
    SidebarComponent,
    NavigationDirective,
    InicioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    DatepickerModule,
    NgxFilesizeModule,
    ReactiveFormsModule,
    PopoverModule,
    BsDropdownModule,
    PaginationModule
  ],
  providers: [
    GlobalsVars,
    ProyectoService,
    TrabajadorService,
    DocumentoService,
    CommonService,
    CategoriaService,
    ProyectoTipoService,
    TipoDocumentoService,
    EntidadesService,
    CuotasService,
    ContratoService,
    ConvenioService,
    UsuariosService,
    BsDropdownConfig,
    IncapacidadService,
    PagosService,
    { //este interceptor siempre debe ir primero para verificar la autenticación desde el backend
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },/**/
    { //todo NO OLVIDAR APAGAR ESTE INTERCEPTOR ANTES DE SUBIR A PRODUCCIÓN, es solo para pruebas en local OJOOO
      provide: HTTP_INTERCEPTORS,
      useClass: TestingAuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
