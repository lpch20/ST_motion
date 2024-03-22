import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AdminRoleRequiredService, AgentRoleRequiredService, AuthRequiredService, SupervisorOrAdminRoleRequiredService, SupervisorRoleRequiredService } from './requiro/common/routing-auth';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: 'app/requiro/login/login.module#LoginModule'
  },
  {
    path: 'pausa',
    loadChildren: 'app/requiro/break/break.module#BreakModule',
    canActivate: [AuthRequiredService]
  },
  {
    path: 'register',
    loadChildren: 'app/demo/custom-pages/register/register.module#RegisterModule',
    canActivate: [AuthRequiredService]
  },
  {
    path: 'forgot-password',
    loadChildren: 'app/demo/custom-pages/forgot-password/forgot-password.module#ForgotPasswordModule',
    canActivate: [AuthRequiredService]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: 'app/requiro/components/main-call/main-call.module#MainCallModule',
        canActivate: [AuthRequiredService]
      },
      {
        path: 'filtroCampanias',
        loadChildren: 'app/requiro/components/build-filter/build-filter.module#BuildFilterModule',
        canActivate: [AuthRequiredService, SupervisorOrAdminRoleRequiredService]
      },
      {
        path: 'reporteTipoEventos',
        loadChildren: 'app/requiro/modules/reports/supervisors/event-types-report/event-types-report.module#EventTypesReportModule',
        canActivate: [AuthRequiredService, SupervisorOrAdminRoleRequiredService]
      },
      {
        path: 'reportes-agentes',
        loadChildren: 'app/requiro/modules/reports/agents/agent-report.module#AgentReportModule',
        canActivate: [AuthRequiredService],
      },
      {
        path: 'reportes-supervisor',
        loadChildren: 'app/requiro/modules/reports/supervisors/supervisor-report.module#SupervisorReportModule',
        canActivate: [AuthRequiredService, SupervisorOrAdminRoleRequiredService]
      },
      {
        path: 'usuarios',
        loadChildren: 'app/requiro/users/users.module#UsersModule',
        canActivate: [AuthRequiredService, AdminRoleRequiredService]
      },
      {
        path: 'clientesInactivos',
        loadChildren: 'app/requiro/inactive-users/inactive-users.module#InactiveUsersModule',
        canActivate: [AuthRequiredService, SupervisorOrAdminRoleRequiredService]
      },
      {
        path: 'enviar-sms-masivos',
        loadChildren: 'app/requiro/components/sms-sender/sms-sender.module#SmsSenderModule',
        canActivate: [AuthRequiredService, AdminRoleRequiredService]
      },
      {
        path: 'compromisos',
        loadChildren: 'app/requiro/engagement/engagement.module#EngagementModule',
        canActivate: [AuthRequiredService]
      },
      {
        path: 'estado-usuarios',
        loadChildren: 'app/requiro/users-state/users-state.module#UsersStateModule'
      },
      {
        path: 'clientes',
        loadChildren: 'app/requiro/customers/customers.module#CustomersModule'
      },
      {
        path: 'campanias',
        loadChildren: 'app/requiro/campaign/campaign.module#CampaignModule',
        canActivate: [AuthRequiredService]
      },
      {
        path: 'gestion-colas',
        loadChildren: 'app/requiro/manage-queue/manage-queue.module#ManageQueueModule',
        canActivate: [AuthRequiredService, AdminRoleRequiredService]
      },
      {
        path: 'importar-datos',
        loadChildren: 'app/requiro/import-data/import-data.module#ImportDataModule',
        canActivate: [AuthRequiredService]
      },
      {
        path: 'profile',
        loadChildren: 'app/requiro/components/edit-profile/edit-profile.module#EditProfileModule',
        canActivate: [AuthRequiredService]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthRequiredService,
    AgentRoleRequiredService,
    SupervisorRoleRequiredService,
    SupervisorOrAdminRoleRequiredService,
    AdminRoleRequiredService
  ]
})
export class RoutingModule { }
