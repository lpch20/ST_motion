import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeEsCa from '@angular/common/locales/es-UY';
import localeEsUyExtra from '@angular/common/locales/extra/es-UY';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ServiceWorkerModule } from '@angular/service-worker';
// Needed for Touch functionality of Material Components
import 'hammerjs';
// import { environment } from '../environments/environment';
import { RoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { RequiroErrorHandler } from './requiro/error-handlers/requiro-error.handler';
import { RequiroServerErrorInterceptor } from './requiro/interceptors/requiro-server-error.interceptor';
import { SessionVerifierInterceptorModule } from './requiro/interceptors/session-verifier.interceptor';
import { TokenInterceptorModule } from './requiro/interceptors/token.interceptor';
import { ActionService } from './requiro/services/action.service';
import { AuthenticateService } from './requiro/services/authenticate.service';
import { BranchOfficeService } from './requiro/services/branch-office.service';
import { BreakService } from './requiro/services/break.service';
import { CacheService } from './requiro/services/cache-service';
import { CallService } from './requiro/services/call.service';
import { CampaignService } from './requiro/services/campaign.service';
import { CareerService } from './requiro/services/career.service';
import { CustomersService } from './requiro/services/customers.service';
import { DepartamentsService } from './requiro/services/departaments.service';
import { EngagementService } from './requiro/services/engagement.service';
import { ErrorsService } from './requiro/services/errors.service';
import { EventTypeService } from './requiro/services/event-type.service';
import { EventsService } from './requiro/services/events.service';
import { FiltersService } from './requiro/services/filters.service';
import { ImportDataService } from './requiro/services/import-data.service';
import { MainCallDataServiceService } from './requiro/services/main-call-data-service.service';
import { MenuService } from './requiro/services/menu.service';
import { QueueService } from './requiro/services/queue.service';
import { ReportsService } from './requiro/services/reports.service';
import { SettingModulesService } from './requiro/services/setting-modules.service';
import { SmsService } from './requiro/services/sms.service';
import { TokenService } from './requiro/services/token.service';
import { UsersService } from './requiro/services/users.service';
import { ScheduleService } from './requiro/toolbar/schedule/schedule.service';



registerLocaleData(localeEsCa, localeEsUyExtra);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular Core Module // Don't remove!
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    // Fury Core Modules
    CoreModule,
    SessionVerifierInterceptorModule,
    TokenInterceptorModule,
    RoutingModule

    // Register a Service Worker (optional)
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),

  ],
  providers: [
    NgForm,
    MenuService,
    EventsService,
    ActionService,
    BranchOfficeService,
    CustomersService,
    TokenService,
    UsersService,
    CareerService,
    AuthenticateService,
    ScheduleService,
    BreakService,
    EventTypeService,
    CallService,
    ReportsService,
    FiltersService,
    CampaignService,
    EngagementService,
    DepartamentsService,
    MainCallDataServiceService,
    ImportDataService,
    QueueService,
    SmsService,
    CacheService,
    ErrorsService,
    SettingModulesService,
    {
      provide: LOCALE_ID,
      useValue: 'es-UY'
    },
    {
      provide: ErrorHandler,
      useClass: RequiroErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequiroServerErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
