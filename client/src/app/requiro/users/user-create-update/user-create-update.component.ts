import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResultCode } from '../../../../../../datatypes/result';
import { User } from '../../../../../../datatypes/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'user-create-update',
  templateUrl: './user-create-update.component.html',
  styleUrls: ['./user-create-update.component.scss']
})
export class UserCreateUpdateComponent implements OnInit {
  user: User;
  pswGenereated: string;
  userFormGroup: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserCreateUpdateComponent>,
    private fb: FormBuilder,
    private userService: UsersService) {
  }


  generatePSW(): void {
    this.pswGenereated = Math.random().toString(36).substr(2);
  }

  ngOnInit() {
    const isNewUser: boolean = !this.data.user;

    this.mode = isNewUser ? "create" : "update";
    this.user = isNewUser ? new User() : this.data.user;

    this.userFormGroup = this.fb.group({
      username: [{ value: this.user.user_name || null, disabled: !isNewUser }, Validators.required],
      name: [this.user.firstname || null, Validators.required],
      lastname: [this.user.lastname || null, Validators.required],
      rols: [this.user.rol_id || null, Validators.required],
      ext: [this.user.ext || null, Validators.required],
      active: isNewUser ? null : [this.user.active || null, Validators.required],
      withoutPhone: isNewUser ? null : [this.user.withoutPhone || null, Validators.required],
      psw: isNewUser ? [null, Validators.required] : null
    });
  }

  save() {
    if (this.mode === "create") {
      this.userService.add(this.user).subscribe(
        response => {
          this.dialogRef.close(true);
        }
      );
    } else if (this.mode === "update") {
      this.userService.update(this.user).subscribe(
        response => {
          this.dialogRef.close(true);
          //console.log(response);
          if (response.result === ResultCode.OK) {
            alert(response.message);
          }
        }
      );
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
