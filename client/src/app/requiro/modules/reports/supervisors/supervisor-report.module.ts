import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupervisorReportRoutingModule } from './supervisor-report-routing.module';
import { SupervisorReportComponent } from './supervisor-report.component';
import { MaterialModule } from 'app/core/common/material-components.module';
import { ScrollbarModule } from 'app/core/common/scrollbar/scrollbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CallsByAgentComponent } from './calls-by-agent/calls-by-agent.component';
import { AgentStateReportComponent } from './agent-state-report/agent-state-report.component';
import { SharedReportsModule } from '../common/shared-reports.module';
import { CustomerFilterProgressReportComponent } from './customer-filter-progress/customer-filter-progress.component';
import { CampaignReportComponent } from './campaigns/campaigns.component';
import { SortablejsModule } from 'angular-sortablejs';
import { MatInputModule } from '@angular/material';
import { PageModule } from 'app/core/common/page/page.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FuryCardModule } from 'app/core/common/card/card.module';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    FormsModule,
    SharedReportsModule,
    CommonModule,    
    ScrollbarModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatInputModule,
    PageModule,
    SortablejsModule,
    BreadcrumbsModule,
    FuryCardModule,
    MatTableModule,
    MatExpansionModule,
    SupervisorReportRoutingModule
  ],
  declarations: [    
    SupervisorReportComponent,
    CallsByAgentComponent,
    CustomerFilterProgressReportComponent,
    CampaignReportComponent
  ]
})
export class SupervisorReportModule { }
