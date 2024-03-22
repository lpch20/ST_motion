import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SmsSenderComponent } from './sms-sender.component';

const routes: Routes = [
  {
    path: '',
    component: SmsSenderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsSenderRoutingModule { }