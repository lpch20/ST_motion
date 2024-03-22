import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { IUser } from '../../../../../../../../datatypes/user';
import { ReportCall } from '../../../../../../../../datatypes/reports/call';
import { UserDateReport } from '../../UserDateReport';
import { ReportsService } from '../../../../services/reports.service';
import { UsersService } from '../../../../services/users.service';
import { CampaignService } from '../../../../services/campaign.service';
import { ICampaign } from '../../../../../../../../datatypes/Campaign';

@Component({
  selector: 'calls-by-agent',
  templateUrl: './calls-by-agent.component.html'
})
export class CallsByAgentComponent extends UserDateReport implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  userCalls: UserReportCall[];
  users: IUser[];
  campaigns: ICampaign[];

  selectedUserId: number;
  selectedCampaignId: number;

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  sortedData: UserReportCall[];

  constructor(
    private reportService: ReportsService,
    campaignsService: CampaignService,
    usersService: UsersService) {
    super(usersService);
    this.displayedColumns = ['idUser', 'countByCustomer', 'count', 'percentageTotal'];
    campaignsService.getAll().subscribe(res => {
      this.campaigns = res.data;
    });
  }

  ngOnInit() {
    this.searchEvents();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchEvents(): void {
    this.dateFrom.setHours(0, 0, 0, 0);
    this.dateTo.setHours(23, 59, 0, 0);

    this.reportService.callsByAgent(this.selectedCampaignId, this.dateFrom, this.dateTo).subscribe(
      response => {
        this.userCalls = response.data.map(c => {
          return {
            idUser: c.idUser,
            countByCustomer: c.countByCustomer,
            count: c.count,
            percentageTotal: c.countByCustomer / c.count * 100
          };
        });

        this.dataSource.data = this.selectedUserId ?
          this.userCalls.filter(u => u.idUser == this.selectedUserId) :
          this.userCalls;
      }
    );
  }

  getUser(idUser: number): string {
    const u = this._users ? this._users.find(us => us.id === idUser) : null;
    return u ? `${u.lastname}, ${u.firstname}` : '';
  }

  eventChange() {
    this.dataSource.data = this.selectedUserId ?
      this.userCalls.filter(u => u.idUser == this.selectedUserId) :
      this.userCalls;
  }

  eventCampaignChange() {
    this.dataSource.data = this.selectedUserId ?
      this.userCalls.filter(u => u.idUser == this.selectedUserId) :
      this.userCalls;
  }
}

interface UserReportCall extends ReportCall {
  percentageTotal: number;
}
