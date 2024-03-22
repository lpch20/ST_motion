import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageQueueComponent } from './manage-queue.component';


const routes: Routes = [
  {
    path: '',
    component: ManageQueueComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageQueueRoutingModule { }
