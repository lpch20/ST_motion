import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule
} from '@angular/material';
import { UserCreateUpdateComponent } from './user-create-update.component';
import { MaterialModule } from 'app/core/common/material-components.module';

@NgModule({
    imports: [
        MaterialModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
        MatSelectModule
    ],
    declarations: [UserCreateUpdateComponent],
    entryComponents: [UserCreateUpdateComponent],
    exports: [UserCreateUpdateComponent]
})
export class UserCreateUpdateModule {
}
