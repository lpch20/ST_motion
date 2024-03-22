import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InboxMailConfirmDialogComponent } from '../../../demo/apps/inbox/inbox-mail-confirm-dialog/inbox-mail-confirm-dialog.component';


@Component({
  selector: 'requiro-confirm-dialog',
  templateUrl: './requiro-confirm-dialog.component.html'
})
export class RequiroConfirmDialogComponent implements OnInit {

  title: string;
  content: string;

  constructor(@Inject(MAT_DIALOG_DATA) private options: any,
    private dialogRef: MatDialogRef<RequiroConfirmDialogComponent>) {
  }

  ngOnInit() {
    this.title = this.options.title ? this.options.title : 'Confirmacón';
    this.content = this.options.content ? this.options.content : "¿Está seguro?";
  }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}

