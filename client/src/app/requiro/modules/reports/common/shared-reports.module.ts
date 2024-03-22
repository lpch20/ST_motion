import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../core/common/material-components.module';
import { ScrollbarModule } from '../../../../core/common/scrollbar/scrollbar.module';
import { CustomerEventReportComponent } from '../../../modules/reports/common/customer-event-report/customer-event-report.component';
import { ScheduledCallsReportComponent } from '../../../modules/reports/common/scheduled-calls-report/scheduled-calls-report.component';
import { BreaksReportComponent } from '../../../modules/reports/common/breaks-report/breaks-report.component';
import { SessionsReportComponent } from '../../../modules/reports/common/sessions-report/sessions-report.component';
import { TimeWorkedReportComponent } from '../../../modules/reports/common/time-worked-report/time-worked-report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    ScrollbarModule,
    ReactiveFormsModule
  ],
  declarations: [
    CustomerEventReportComponent,
    ScheduledCallsReportComponent,
    BreaksReportComponent,
    SessionsReportComponent,
    TimeWorkedReportComponent
  ],
  exports: [
    CustomerEventReportComponent,
    ScheduledCallsReportComponent,
    BreaksReportComponent,
    SessionsReportComponent,
    TimeWorkedReportComponent
  ]
})
export class SharedReportsModule { }
