import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../common/material-components.module';
import { ScrollbarModule } from '../common/scrollbar/scrollbar.module';
import { QuickpanelComponent } from './quickpanel.component';
import { ReactiveFormsModule, FormsModule } from '../../../../node_modules/@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,    
    ReactiveFormsModule,
    MaterialModule,
    ScrollbarModule
  ],
  declarations: [QuickpanelComponent],
  exports: [QuickpanelComponent]
})
export class QuickpanelModule {
}
