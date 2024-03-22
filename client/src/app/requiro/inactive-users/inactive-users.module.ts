import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InactiveUsersComponent } from './inactive-users.component';
import {InactiveUsersRoutingModule} from './inactive-users-routing.module'
import { MaterialModule } from 'app/core/common/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollbarModule } from 'app/core/common/scrollbar/scrollbar.module';
import { AssignCustomersComponent } from './assign-customers/assign-customers.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    InactiveUsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollbarModule
  ],
  declarations: [InactiveUsersComponent, AssignCustomersComponent]
})
export class InactiveUsersModule { }

