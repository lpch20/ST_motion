import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Break } from '../../../../../datatypes/Break';

import { User } from '../../../../../datatypes/user';

import { BreakService } from '../services/break.service';
import { TokenService } from '../services/token.service';
import { UsersService } from '../services/users.service';

import { UserCreateUpdateComponent } from './user-create-update/user-create-update.component';

@Component({
  selector: 'fury-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];
  rols: Map<number, { id: number, name: string }>;

  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
    private dialog: MatDialog,
    private breakService: BreakService,
    private router: Router
  ) { };

  ngOnInit() {

    this.breakService.getLastBreakByCurrentUser().subscribe(
      response => {
        if (response.result > 0) {
          let breakResult: Break;
          if (response.data && response.data.length > 0) {
            breakResult = response.data[0];
          }
          if (breakResult && breakResult.init) {
            this.router.navigate(['pausa']);
          } else {
            console.log("****");
            this.userService.getRols().subscribe(
              response => {
                this.rols = new Map<number, { id: number, name: string }>();
                console.log(response);
                if (response.result > 0) {
                  let resultRols: { id: number, name: string }[] = response.data;
                  for (let i = 0; i < resultRols.length; i++) {
                    this.rols.set(resultRols[i].id, resultRols[i]);
                  }


                  this.userService.getUsers().subscribe(
                    response => {
                      if (response.result > 0) {
                        this.users = response.data;
                      }
                    }
                  );
                }
              }
            );
          }
        } else {
          alert(response.message);
        }
      }
    );
  }

  updateUser(id: number): void {
    let rols: { id: number, name: string }[] = new Array<{ id: number, name: string }>();
    Array.from(this.rols.values()).forEach(value => rols.push(value));

    let user: User = Object.assign({}, this.users.find(c => c.id_user_master === id));

    let isCurrent = this.userService.getCurrentUserName() == user.user_name;

    this.dialog.open(UserCreateUpdateComponent, { data: { usersRols: rols, user: user } })
      .afterClosed()
      .subscribe((saved: any) => {
        if (saved) {
          this.userService.getUsers().subscribe(
            response => {
              if (response.result > 0) {
                if (isCurrent) {
                  let oriUserName = this.users.find(u => u.id === id).user_name;
                  if (user.user_name != oriUserName) {
                    this.tokenService.updateUserNameToken(user.user_name);
                  }
                }
                this.users = response.data;
              }
            }
          );
        }
      });
  }

  deleteUser(id: number): void {
    this.userService.activeDeactivateUser(id, false).subscribe(
      response => {
        this.userService.getUsers().subscribe(
          response => {
            if (response.result > 0) {
              this.users = response.data;
            }
          }
        );
      }
    );
  }

  activeUser(id: number): void {
    this.userService.activeDeactivateUser(id, true).subscribe(
      response => {
        this.userService.getUsers().subscribe(
          response => {
            if (response.result > 0) {
              this.users = response.data;
            }
          }
        );
      }
    );
  }

  toggleWithoutPhone(id: number, withoutPhone: boolean): void {
    console.log(id, withoutPhone);
    // this.userService.activeDeactivateUser(id, true).subscribe(
    //   response => {
    //     this.userService.getUsers().subscribe(
    //       response => {
    //         if (response.result > 0) {
    //           this.users = response.data;
    //         }
    //       }
    //     );
    //   }
    // );
  }

  cleanNumberOfAttempts(id: number): void {
    this.userService.cleanNumberOfAttempts(id).subscribe(
      response => {
        this.userService.getUsers().subscribe(
          response => {
            if (response.result > 0) {
              this.users = response.data;
            }
          }
        );
      }
    );
  }

  createCustomer() {
    let rols: { id: number, name: string }[] = new Array<{ id: number, name: string }>();
    Array.from(this.rols.values()).forEach(value => rols.push(value));

    this.dialog.open(UserCreateUpdateComponent, { data: { usersRols: rols } }).afterClosed().subscribe((customer: any) => {

      this.userService.getUsers().subscribe(
        response => {
          if (response.result > 0) {
            this.users = response.data;
          }
        }
      );

      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
      }
    });
  }

}
