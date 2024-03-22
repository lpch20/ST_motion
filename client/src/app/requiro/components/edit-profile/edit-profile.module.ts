import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/core/common/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollbarModule } from 'app/core/common/scrollbar/scrollbar.module';
import { EditProfileRoutingModule } from './edit-profile-routing.module';
import { EditProfileComponent } from './edit-profile.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ScrollbarModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    EditProfileRoutingModule
  ],
  declarations: [
    EditProfileComponent
  ]
})
export class EditProfileModule { }
