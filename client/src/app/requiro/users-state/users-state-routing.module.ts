import { NgModule } from '@angular/core';
import { UsersStateComponent } from './users-state.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: UsersStateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersStateRoutingModule { }