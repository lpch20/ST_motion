import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngagementRoutingModule } from './engagement-routing.module';
import { EngagementComponent } from './engagement.component';
import { MaterialModule } from '../../core/common/material-components.module';
import { ScrollbarModule } from '../../core/common/scrollbar/scrollbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedReportsModule } from '../modules/reports/common/shared-reports.module';
//import { Angular2CsvModule } from 'angular2-csv';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    ScrollbarModule,
    ReactiveFormsModule,
    SharedReportsModule,
    EngagementRoutingModule
  ],
  declarations: [
    EngagementComponent
  ]
})
export class EngagementModule { }