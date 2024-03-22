import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BuildFilterComponent } from './build-filter.component';
import { SortablejsModule } from 'angular-sortablejs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { DynamicModule } from 'ng-dynamic-component';
import { MaterialModule } from 'app/core/common/material-components.module';
import { PageModule } from 'app/core/common/page/page.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FuryCardModule } from 'app/core/common/card/card.module';
import { BuildFilterRoutingModule } from './build-filter-routing.module';
import { StepsSorterComponent } from './steps/steps-sorter/steps-sorter.component';
import { ClientsStepComponent } from './steps/clients/clients-step.component';
import { CampaignsStepComponent } from './steps/campaign/campaigns-step.component';
import { AgentsComponent } from './steps/agents/agents.component';
import { CustomerAgeStepComponent } from './steps/customer-age/customer-age-step.component';
import { CustomerStateStepComponent } from './steps/customer-state/customer-state-step.component';
import { CustomerDebtStepComponent } from './steps/customer-debt/customer-debt-step.component';
import { CustomerInteractionsStepComponent } from './steps/customer-interactions/customer-interactions-step.component';
import { CustomerAssignDateStepComponent } from './steps/customer-assign-date/customer-assign-date-step.component';
import { CustomerDaysArrearsStepComponent } from './steps/customer-days-arrears/customer-days-arrears-step.component';
import { StepsSummaryComponent } from './steps/steps-summary/steps-summary.component';
import { LoadingOverlayModule } from '../../../core/common/loading-overlay/loading-overlay.module';
import { DonutChartWidgetModule } from '../../../core/widgets/donut-chart-widget/donut-chart-widget.module';
import { AdvancedPieChartWidgetModule } from '../../../core/widgets/advanced-pie-chart-widget/advanced-pie-chart-widget.module';
import { RequiroConfirmDialogComponent } from '../../common/confirm-dialog/requiro-confirm-dialog.component';

@NgModule({
  imports: [
    DynamicModule.withComponents([
      ClientsStepComponent,
      CampaignsStepComponent,
      CustomerAgeStepComponent,
      CustomerStateStepComponent,
      CustomerDebtStepComponent,
      CustomerAssignDateStepComponent
    ]),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatInputModule,
    PageModule,
    SortablejsModule,
    BreadcrumbsModule,
    FuryCardModule,
    LoadingOverlayModule,
    DonutChartWidgetModule,
    AdvancedPieChartWidgetModule,
    BuildFilterRoutingModule
  ],
  declarations: [
    BuildFilterComponent,
    StepsSorterComponent,
    CampaignsStepComponent,
    ClientsStepComponent,
    CustomerAgeStepComponent,
    CustomerStateStepComponent,
    CustomerInteractionsStepComponent,
    CustomerDaysArrearsStepComponent,
    CustomerDebtStepComponent,
    CustomerAssignDateStepComponent,
    StepsSummaryComponent,
    AgentsComponent,
    RequiroConfirmDialogComponent
  ],
  exports: [

  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  entryComponents: [
    CampaignsStepComponent,
    ClientsStepComponent,
    CustomerAgeStepComponent,
    CustomerStateStepComponent,
    CustomerInteractionsStepComponent,
    CustomerDaysArrearsStepComponent,
    RequiroConfirmDialogComponent
  ],
})
export class BuildFilterModule { }




