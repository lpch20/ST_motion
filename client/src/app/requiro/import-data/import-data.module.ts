import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'app/core/common/material-components.module';
import { FileUploadComponent } from 'app/share/file-upload/file-upload.component';
import { ImportDataRoutingModule } from './import-data-routing.module';
import { ImportDataComponent } from './import-data.component';

@NgModule({
  imports: [
    CommonModule,
    ImportDataRoutingModule,
    MaterialModule
  ],
  declarations: [ImportDataComponent, FileUploadComponent]
})
export class ImportDataModule { }