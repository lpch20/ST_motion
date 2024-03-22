import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { MaterialModule } from '../../core/common/material-components.module';
import { ManageQueueRoutingModule } from './manage-queue-routing.module';
import { ManageQueueComponent } from './manage-queue.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatInputModule,
    ManageQueueRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  declarations: [ManageQueueComponent]
})
export class ManageQueueModule { }
