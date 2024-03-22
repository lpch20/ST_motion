import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BuildFilterComponent } from './build-filter.component';

const routes: Routes = [
  {
    path: '',
    component: BuildFilterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildFilterRoutingModule { }
