import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { ScheduleService } from '../../../../toolbar/schedule/schedule.service';
import { UsersService } from '../../../../services/users.service';
import { VSchedule } from '../../../../../../../../datatypes/viewDataType/VSchedule';
import { User } from '../../../../../../../../datatypes/user';
import { UserDateReport } from '../../UserDateReport';
import * as moment from 'moment';

@Component({
  selector: 'scheduled-calls-report',
  templateUrl: './scheduled-calls-report.component.html'
})
export class ScheduledCallsReportComponent extends UserDateReport implements OnInit, AfterViewInit {

  @Input() supervisorView: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource();
  displayedColumns = ['date', 'user', 'customer', 'ci' ,'phoneNumber', 'subject'];
  loadingEvents: boolean;
  schedule: VSchedule[];
  users: User[];
  selectedUserId: number = 0;

  constructor(private scheduleService: ScheduleService,
    private usersService: UsersService) {
    super(usersService);
  }

  ngOnInit() {
    if (this.supervisorView) {
      this.displayedColumns = ['date', 'user', 'customer', 'ci', 'phoneNumber', 'subject'];
    } else {
      this.displayedColumns = ['date', 'customer', 'ci' , 'phoneNumber', 'subject'];
    }

    this.initDates();
    this.loadingEvents = true;
    this.usersService.getAll().subscribe(
      response => {
        this._users = response.data;
      }
    );
    this.searchSchedule();
  }

  private initDates(): void {
    this.dateFrom = moment().toDate();
    this.dateTo = moment().add(7, 'days').toDate();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchSchedule(): void {
    this.dateFrom.setHours(0, 0, 0, 0);
    this.dateTo.setHours(23, 59, 0, 0);

    if (this.supervisorView) {
      if (this.selectedUserId !== 0) {
        this.displayedColumns = ['date', 'phoneNumber', 'customer', 'subject'];
      }
      this.scheduleService.getByDate(this.selectedUserId, this.dateFrom, this.dateTo).subscribe(
        response => {
          if (response.result > 0) {
            this.schedule = response.data;
            console.log(response.data);
            this.dataSource.data = response.data;
          }
        }
      );
    } else {
      this.scheduleService.getByCurrentUserByDate(this.dateFrom, this.dateTo).subscribe(
        response => {
          if (response.result > 0) {
            this.schedule = response.data;
            console.log(response.data);
            this.dataSource.data = response.data;
          }
        }
      );
    }
  }
}
