import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignReportComponent } from './campaigns/campaigns.component';
import { CustomerFilterProgressReportComponent } from './customer-filter-progress/customer-filter-progress.component';
import { SupervisorReportComponent } from './supervisor-report.component';

/*
  {
    path: '',
    redirectTo: 'avance-llamadas',
    pathMatch: 'full'
  },
*/

const routes: Routes = [
  {
    path: '',    
    component: SupervisorReportComponent
  },
  {
    path: 'avance-llamadas',
    component: CustomerFilterProgressReportComponent
  },
  {
    path: 'estado-campanias',
    component: CampaignReportComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisorReportRoutingModule { }