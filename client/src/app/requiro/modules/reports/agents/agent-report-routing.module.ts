import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentReportComponent } from './agent-report.component';

const routes: Routes = [
  {
    path: '',
    component: AgentReportComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentReportRoutingModule { }