import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventTypesReportComponent } from './event-types-report.component';

const routes: Routes = [
  {
    path: '',
    component: EventTypesReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventTypesReportRoutingModule {
}
