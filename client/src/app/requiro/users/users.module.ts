import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { MaterialModule } from 'app/core/common/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { UserCreateUpdateModule } from './user-create-update/user-create-update.module';
import { ScrollbarModule } from '../../core/common/scrollbar/scrollbar.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    ScrollbarModule,
    UserCreateUpdateModule,
    UsersRoutingModule
  ],
  declarations: [
    UsersComponent
  ]
})
export class UsersModule { }
