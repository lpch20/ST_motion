import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InactiveUsersComponent} from './inactive-users.component'

const routes: Routes = [
  {
    path: '',
    component: InactiveUsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InactiveUsersRoutingModule { }
