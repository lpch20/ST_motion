import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakRoutingModule } from './break-routing.module';
import { BreakComponent } from './break.component';
import { BreakCallComponent } from '../components/break-call/break-call.component';
import { MaterialModule } from '../../core/common/material-components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    BreakRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [BreakComponent,BreakCallComponent,]
})
export class BreakModule {
}
