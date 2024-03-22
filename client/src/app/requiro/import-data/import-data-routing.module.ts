import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportDataComponent } from './import-data.component';

const routes: Routes = [
  {
    path: '',
    component: ImportDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportDataRoutingModule { }
