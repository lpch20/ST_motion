import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventTypesReportComponent } from './event-types-report.component';

import { EventTypesReportRoutingModule } from './event-types-report-routing.module';
import { MaterialModule } from '../../../../../core/common/material-components.module';
import { DonutChartWidgetModule } from '../../../../../core/widgets/donut-chart-widget/donut-chart-widget.module';
import { DashboardService } from '../../../../../demo/dashboard/dashboard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    EventTypesReportRoutingModule,
    DonutChartWidgetModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DashboardService],
  declarations: [EventTypesReportComponent]
})
export class EventTypesReportModule {
}
