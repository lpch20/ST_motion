import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgentReportRoutingModule } from './agent-report-routing.module';
import { MaterialModule } from '../../../../core/common/material-components.module';
import { ScrollbarModule } from '../../../../core/common/scrollbar/scrollbar.module';
import { AgentReportComponent } from './agent-report.component';
import { SharedReportsModule } from '../common/shared-reports.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    ScrollbarModule,
    ReactiveFormsModule,
    SharedReportsModule,
    AgentReportRoutingModule
  ],
  declarations: [
    AgentReportComponent
  ]
})
export class AgentReportModule { }