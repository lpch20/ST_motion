import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakService } from '../services/break.service';
import { Break } from '../../../../../datatypes/Break';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Util } from '../utils/util';
import { BreakCallComponent } from '../components/break-call/break-call.component';
import { ResultCode } from '../../../../../datatypes/result';

@Component({
  selector: 'fury-break',
  templateUrl: './break.component.html',
  styleUrls: ['./break.component.scss']
})
export class BreakComponent implements OnInit {

  @ViewChild(BreakCallComponent) breakCall: BreakCallComponent;

  private idBreakType: number;
  public initialTimeBreak: number = 0;
  public breakType: any;
  public breakRunning: boolean = false;
  public error: boolean = false;
  public errorMessage: string = '';
  private breakTypes: Array<{ id: number, icon: string, label: string }>;

  constructor(private breakService: BreakService,
    private router: Router,
    private usersService: UsersService) {
  }

  ngOnInit() {
    this.breakService.getBreakTypes().subscribe(
      breaksResponse => {
        if (breaksResponse.result == ResultCode.OK) {
          this.breakTypes = breaksResponse.data;
          this.breakService.getLastBreakByCurrentUser().subscribe(
            lastBreakResponse => {
              if (lastBreakResponse.result == ResultCode.OK &&
                lastBreakResponse.data && lastBreakResponse.data.length > 0) {
                let breakResult: Break = lastBreakResponse.data[0];
                this.idBreakType = breakResult.idTypeBreak;
                this.breakType = this.breakTypes.filter(f => f.id == this.idBreakType)[0];

                if (breakResult.init) {
                  this.breakRunning = true;
                  let totalSeconds: number = 0;
                  let date1 = moment(breakResult.date, 'YYYY-MM-DDTHH:mm:ss.SSS\'Z\'');
                  let date2 = moment(lastBreakResponse.serverTime, 'YYYY-MM-DDTHH:mm:ss.SSS\'Z\'');
                  totalSeconds += date2.diff(date1, 'seconds');
                  this.initialTimeBreak = totalSeconds;
                }
              } else {
                // error
                console.error(lastBreakResponse);
              }
            },
            err => {
              console.error(err);
            }
          );
        } else {
          // error
          console.error(breaksResponse);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  breakEnd($event) {
    // TODO sacar harcode
    this.usersService.validatePasswordCurrentUser(this.breakCall.password).subscribe(
      validatePassResponse => {
        if (validatePassResponse.result == ResultCode.OK) {
          if (validatePassResponse.data) {
            this.error = false;
            let idUser = 0;
            this.breakService.addBreak(new Break(0, this.idBreakType, idUser, new Date(), false)).subscribe(
              addBreakResponse => {
                if (addBreakResponse.result == ResultCode.OK) {
                  this.breakCall.stopTimer();
                  this.usersService.getRolCurrentUser().subscribe(
                    responseCurrentUser => {
                      if (responseCurrentUser.result == ResultCode.OK) {
                        let util = new Util(this.router, this.usersService);
                        util.redirectByRole(responseCurrentUser.data[0].rol_id);
                      } else {
                        // err 
                        console.error(addBreakResponse);
                      }
                    },
                    err => {
                      console.error(err);
                    }
                  );
                } else {
                  // error
                  console.error(addBreakResponse);
                }
              },
              err => {
                console.error(err);
              }
            );
          } else {
            this.error = true;
            this.errorMessage = 'Contraseña incorrecta';
          }
        } else {
          // error
          console.error(validatePassResponse);
        }
      },
      err => {
        console.error(err);
      }
    );
  }
}
