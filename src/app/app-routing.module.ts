import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DgObraComponent} from "./components/dg-obra/dg-obra.component";
import {ControlAsistenciaComponent} from "./components/control-asistencia/control-asistencia.component";
import {ControlContratosComponent} from "./components/control-contratos/control-contratos.component";
import {ControlDocumentalComponent} from "./components/control-documental/control-documental.component";
import {ReporteEconomicoComponent} from "./components/reporte-economico/reporte-economico.component";
import {AdminComponent} from "./components/admin/admin.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {DgProyectosComponent} from "./components/dg-proyectos/dg-proyectos.component";
import {PerfilContratistaComponent} from "./components/perfil-contratista/perfil-contratista.component";
import {TrabajadoresComponent} from './components/trabajadores/trabajadores.component';
import {ControlAsistenciaSemanalComponent} from "./components/control-asistencia-semanal/control-asistencia-semanal.component";
import {NewEmailComponent} from "./components/new-email/new-email.component";
import {AccountLayoutComponent} from "./components/auth/account-layout/account-layout.component";
import {NonAuthGuard} from "./guards/non-auth.guard";
import {AppComponent} from "./app.component";
import {AuthGuard} from "./guards/auth.guard";
import {TemplateComponent} from "./components/layout/template/template.component";
import {NotFoundComponent} from "./components/http/not-found/not-found.component";
import {UnauthorizedComponent} from "./components/http/unauthorized/unauthorized.component";
import {ForgotPasswordEmailComponent} from "./components/auth/forgot-password-email/forgot-password-email.component";
import {
  ForgotPasswordNewPasswdComponent
} from "./components/auth/forgot-password-new-passwd/forgot-password-new-passwd.component";
import {CategoriasComponent} from "./components/categorias/categorias.component";
import {ProyectoTipoComponent} from "./components/proyecto-tipo/proyecto-tipo.component";
import {TipoDocumentoComponent} from "./components/tipo-documento/tipo-documento.component";
import {EntidadesComponent} from "./components/entidades/entidades.component";
import {ProyectoService} from "./services/proyecto.service";
import {ProyectosComponent} from "./components/proyectos/proyectos.component";
import {EntidadDetalleComponent} from "./components/entidad-detalle/entidad-detalle.component";
import {ProyectoDetalleComponent} from "./components/proyecto-detalle/proyecto-detalle.component";
import {CuotasPagablesComponent} from "./components/cuotas-pagables/cuotas-pagables.component";
import {DocumentosEntregablesComponent} from "./components/documentos-entregables/documentos-entregables.component";
import {
  ConveniosEntidadProyectoComponent
} from "./components/convenios-entidad-proyecto/convenios-entidad-proyecto.component";
import {ControlUsuariosComponent} from "./components/control-usuarios/control-usuarios.component";
import {EntidadDocumentosComponent} from "./components/entidad-documentos/entidad-documentos.component";
import {MatrizAltasBajasComponent} from "./components/matriz-altas-bajas/matriz-altas-bajas.component";
import {TrabajadorDetalleComponent} from "./components/trabajador-detalle/trabajador-detalle.component";
import {IncapacidadesComponent} from "./components/incapacidades/incapacidades.component";
import {PagosComponent} from "./components/pagos/pagos.component";
import {
  ControlAsistenciaEntidadComponent
} from "./components/perfiles/entidad/asistencia/control-asistencia-entidad/control-asistencia-entidad.component";
import {
  ControlDocumentalEntidadBaseComponent
} from "./components/perfiles/entidad/control-documental-entidad-base/control-documental-entidad-base.component";
import {
  IncapacidadesEntidadComponent
} from "./components/perfiles/entidad/incapacidades-entidad/incapacidades-entidad.component";
import {
  MatrizAltasBajasEntidadComponent
} from "./components/perfiles/entidad/matriz-altas-bajas-entidad/matriz-altas-bajas-entidad.component";
import {
  TrabajadoresCrudEntidadComponent
} from "./components/perfiles/entidad/trabajadores-crud-entidad/trabajadores-crud-entidad.component";
import {PageComponent} from "./components/layouts/page/page.component";
import {InicioComponent} from "./components/inicio/inicio.component";

const routes: Routes = [
  /*{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },*/
  {path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dg-obra',
        component: DgObraComponent
      },
      {
        path: 'dg-proyecto',
        component: DgProyectosComponent
      },
      {
        path: 'control-asistencia',
        component: ControlAsistenciaComponent
      },
      {
        path: 'control-contratos',
        component: ControlContratosComponent
      },
      {
        path: 'control-documental',
        component: ControlDocumentalComponent
      },
      {
        path: 'reporte-economico',
        component: ReporteEconomicoComponent
      },
      {
        path: 'perfil-contratista',
        component: PerfilContratistaComponent
      },
      {
        path: 'trabajadores',
        component: TrabajadoresComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: 'new-email',
        component: NewEmailComponent
      },
      {
        path: 'categorias',
        component: CategoriasComponent
      },
      {
        path: 'proyectotipo',
        component: ProyectoTipoComponent
      },
      {
        path: 'tipo-documento',
        component: TipoDocumentoComponent
      },
      {
        path: 'entidades',
        component: EntidadesComponent
      },
      {
        path: 'proyectos',
        component: ProyectosComponent
      },
      {
        path: 'proyecto-detalle/:id',
        component: ProyectoDetalleComponent
      },
      {
        path: 'entidad-detalle/:id',
        component: EntidadDetalleComponent
      },
      /*{
        path: 'cuotas-pagables',
        component: CuotasPagablesComponent
      },
      {
        path: 'pagos',
        component:  PagosComponent
      },*/
      {
        path: 'documentos-entregables',
        component: DocumentosEntregablesComponent
      },
      {
        path: 'contrato-detalle/:ide/:idp',
        component: ConveniosEntidadProyectoComponent
      },
      {
        path: 'control-usuarios',
        component: ControlUsuariosComponent
      },
      {
        path: 'entidad-documentos/:id/:nombre',
        component: EntidadDocumentosComponent
      },
      {
        path: 'matriz-altas-bajas',
        component: MatrizAltasBajasComponent
      },
      {
        path: 'incapacidades',
        component: IncapacidadesComponent
      },
      {
        path: 'trabajador-detalle/:id',
        component: TrabajadorDetalleComponent
      },
      {
        path: 'inicio',
        component: InicioComponent
      },
      {
        path: 'rolentidad/:id',
        children: [
          {
            path: 'inicio',
            component: InicioComponent
          },
          {
            path: 'asistencias',
            component: ControlAsistenciaEntidadComponent
          },
          {
            path: 'control-documental',
            component: ControlDocumentalEntidadBaseComponent
          },
          {
            path: 'incapacidades',
            component: IncapacidadesEntidadComponent
          },
          {
            path: 'matriz-altas-bajas',
            component: MatrizAltasBajasEntidadComponent
          },
          {
            path: 'trabajadores',
            component: TrabajadoresCrudEntidadComponent
          },
        ]
      },
      /*{
        path: '**',
        redirectTo: '/not-found',
        pathMatch: 'full'
      }*/
    ]
  },
  {
    path: '',
    component: AccountLayoutComponent,
    children: [
      {
        path: 'login',
        canActivate: [NonAuthGuard],
        component: LoginComponent,
      },
    ]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordEmailComponent
  },
  {
    path: 'reset-password/:token',
    component: ForgotPasswordNewPasswdComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
