import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainCallComponent } from './main-call.component';

const routes: Routes = [
  {
    path: '',
    component: MainCallComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainCallRoutingModule { }