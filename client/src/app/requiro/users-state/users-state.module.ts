import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersStateRoutingModule } from './users-state-routing.module';
import { UsersStateComponent } from './users-state.component';
import { MaterialModule } from 'app/core/common/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { AgentStateReportComponent } from '../modules/reports/supervisors/agent-state-report/agent-state-report.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    UsersStateRoutingModule
  ],
  declarations: [
    AgentStateReportComponent,
    UsersStateComponent
  ]
})
export class UsersStateModule { }
