import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { MaterialModule } from 'app/core/common/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { ScrollbarModule } from '../../core/common/scrollbar/scrollbar.module';
import { UsersStateModule } from '../users-state/users-state.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ScrollbarModule,
    ReactiveFormsModule,
    MatInputModule,
    CustomersRoutingModule,
    UsersStateModule
  ],
  declarations: [
    CustomersComponent
  ]
})
export class CustomersModule { }