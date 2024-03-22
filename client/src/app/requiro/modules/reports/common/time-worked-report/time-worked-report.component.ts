import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { UserDateReport } from '../../UserDateReport';
import { IBreak } from '../../../../../../../../datatypes/Break';
import { Session } from '../../../../../../../../datatypes/session';
import { BreakService } from '../../../../services/break.service';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'time-worked-report',
  templateUrl: './time-worked-report.component.html'
})
export class TimeWorkedReportComponent extends UserDateReport implements OnInit, AfterViewInit {

  @Input() supervisorView: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  breaks: IBreak[];
  sessions: Session[];
  timeWorked: TimeWorked[];

  totalTimeWork = '';
  totalTimeSession = '';
  totalTimeBreak = '';

  selectedUserId: number = 0;
  dataSource = new MatTableDataSource();
  displayedColumns: string[];

  constructor(private usersService: UsersService,
    private breakService: BreakService) {
    super(usersService);
  }

  ngOnInit() {
    this.displayedColumns = this.supervisorView ?
      ['userId', 'breakTime', 'loginTime', 'totalWorkTime'] :
      ['breakTime', 'loginTime', 'totalWorkTime'];
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.dateFrom.setHours(0, 0, 0, 0);
    this.dateTo.setHours(23, 59, 0, 0);

    const sessionPromise = (this.supervisorView ?
      this.usersService.getSessionsByDate(this.selectedUserId, this.dateFrom, this.dateTo) :
      this.usersService.getSessionsByCurrentUserByDate(this.dateFrom, this.dateTo)
    ).toPromise();
    const breakPromise = (this.supervisorView ?
      this.breakService.getBreakByDate(this.selectedUserId, this.dateFrom, this.dateTo) :
      this.breakService.getBreakByCurrentUserByDate(this.dateFrom, this.dateTo)
    ).toPromise();
    const resultPromise = Promise.all([sessionPromise, breakPromise]);

    resultPromise.then(values => {
      this.timeWorked = UserDateReport.calculateTimes(values[0].data, values[1].data);
      this.dataSource.data = this.timeWorked;
    }).catch(reason => {
      console.log(reason);
    });
  }

  getUser(id: number): string {
    const user = this._users ? this._users.find(u => u.id === id) : null;
    return user ? `${user.lastname}, ${user.firstname}` : 'sin usuario';
  }
}

interface TimeWorked {
  userId: number;
  breakTime: any;
  loginTime: any;
  totalWorkTime: any;
}
