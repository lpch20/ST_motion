import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { UsersService } from '../../../../services/users.service';
import { ResultCode } from '../../../../../../../../datatypes/result';
import { Session } from '../../../../../../../../datatypes/session';
import { UserDateReport } from '../../UserDateReport';

@Component({
  selector: 'sessions-report',
  templateUrl: './sessions-report.component.html'
})
export class SessionsReportComponent extends UserDateReport implements OnInit, AfterViewInit {

  @Input() supervisorView: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  sessions: Session[];
  sortedSessions: Session[];
  totalTimeSession: string = "";
  selectedUserId: number = 0;
  dataSource = new MatTableDataSource();
  displayedColumns: string[];

  constructor(private usersService: UsersService) {
    super(usersService);
  }

  ngOnInit() {
    this.initDisplayedColumns();
    this.searchSessions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchSessions(): void {
    this.dateFrom.setHours(0, 0, 0, 0);
    this.dateTo.setHours(23, 59, 0, 0);

    if (this.supervisorView) {
      this.isLoadingEvents = true;
      this.usersService.getSessionsByDate(this.selectedUserId, this.dateFrom, this.dateTo).subscribe(
        responseSession => {
          this.isLoadingEvents = false;
          if (responseSession.result == ResultCode.OK) {
            this.sessions = responseSession.data;
            this.dataSource.data = responseSession.data;
            this.totalTimeSession = this.totalDuration(this.sessions);
          }
        }
      );
    } else {
      this.isLoadingEvents = true;
      this.usersService.getSessionsByCurrentUserByDate(this.dateFrom, this.dateTo).subscribe(
        responseSession => {
          this.isLoadingEvents = false;
          if (responseSession.result == ResultCode.OK) {
            this.sessions = responseSession.data;
            this.dataSource.data = responseSession.data;
            this.totalTimeSession = this.totalDuration(this.sessions);
          } else {
            console.error(responseSession.message)
          }
        }
      )
    }
  }

  eventChange() {
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = this.supervisorView && this.selectedUserId == 0 ? ['userId', 'date', 'login'] : ['date', 'login'];
  }

  getUser(id: number): string {
    let user = this._users ? this._users.find(u => u.id == id) : null;
    return user ? `${user.lastname}, ${user.firstname}` : 'sin usuario';
  }
}
