import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreakComponent } from './break.component';

const routes: Routes = [
  {
    path: '',
    component: BreakComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreakRoutingModule {
}
