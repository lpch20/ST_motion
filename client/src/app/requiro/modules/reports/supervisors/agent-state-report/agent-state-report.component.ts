import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { User } from '../../../../../../../../datatypes/user';
import { Break } from '../../../../../../../../datatypes/Break';
import { BreakType } from '../../../../../../../../datatypes/BreakType';
import { UsersService } from '../../../../services/users.service';
import { BreakService } from '../../../../services/break.service';
import { AuthenticateService } from '../../../../services/authenticate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'agent-state-report',
  templateUrl: './agent-state-report.component.html'
})
export class AgentStateReportComponent implements OnInit, OnDestroy {

  @Input() timerActive = true;
  timeTimer = 5000;
  users: User[];
  breaksType: BreakType[];
  usersAuth: any[];
  agentsState: Break[];
  dateReport: Date;
  cleanSessionsSubcriptions: Subscription;
  timerHandler: number;

  constructor(private usersService: UsersService,
    private breakService: BreakService,
    private authenticateService: AuthenticateService) {
  }

  ngOnInit() {
    this.dateReport = moment().toDate();
    this.searchAgentsState();
    this.cleanSessions();

    this.usersService.getAll().subscribe(
      responseUsers => {
        if (responseUsers.result > 0) {
          this.users = responseUsers.data;
        }

        this.breakService.getBreakTypes().subscribe(
          responseBreaks => {
            if (responseBreaks.result > 0) {
              this.breaksType = responseBreaks.data;
            }
            this.getLastSessionActivity();
            this.recursiveCountdown();
          }
        );
      }
    );
  }
  cleanSessions() {
    this.cleanSessionsSubcriptions = this.authenticateService.cleanSessions().subscribe(
      response => {
        console.log(response);
        this.cleanSessionsSubcriptions.unsubscribe();
      }
    );
  }

  private recursiveCountdown() {
    if (this.timerActive) {
      if (this.timerHandler) {
        clearTimeout(this.timerHandler);
      }
      this.timerHandler = <any>setTimeout(() => {
        this.getLastSessionActivity();
        this.recursiveCountdown();
        this.cleanSessions();
        this.searchAgentsState();
      }, this.timeTimer);
    }
  }

  private getLastSessionActivity(): void {
    this.usersService.getLastSessionActivity().subscribe(
      responseSessions => {
        if (responseSessions.result > 0 && responseSessions.data && responseSessions.data.length > 0) {
          // typar el login como debe ser
          this.usersAuth = responseSessions.data.filter(s => <any>s.login === 1);
        }
      }
    );
  }

  private searchAgentsState(): void {
    this.breakService.getLastBreaks().subscribe(
      response => {
        if (response.result > 0 && response.data && response.data.length > 0) {
          // typar el init como debe ser
          this.agentsState = response.data.filter(b => <any>b.init === 1);
        }
      }
    );
  }

  private timeDiff(date: Date): string {
    const date1 = moment(date, 'YYYY-MM-DDTHH:mm:ss.SSS\'Z\'');
    const date2 = moment();
    let totalSeconds = 0;
    totalSeconds += date2.diff(date1, 'seconds');
    return moment.utc(totalSeconds * 1000).format('HH:mm:ss');
  }

  public getUserById(idUser: number): User {
    return this.users.filter(u => u.id === idUser)[0];
  }

  public getBreakTypeById(idBreakType: number): BreakType {
    return this.breaksType.filter(bt => bt.id === idBreakType)[0];
  }

  ngOnDestroy(): void {
    if (this.timerHandler) {
      clearTimeout(this.timerHandler);
    }
    this.timerHandler = null;
  }
}
