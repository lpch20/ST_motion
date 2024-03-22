import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { CampaignService } from '../../../../services/campaign.service';
import { ReportsService } from '../../../../services/reports.service';
import { Report } from '../../../../../../../../datatypes/report';
import { ResultCode } from '../../../../../../../../datatypes/result';
import { ICampaign } from '../../../../../../../../datatypes/Campaign';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../../../../../datatypes/user';

@Component({
  selector: 'campaigns-report',
  templateUrl: './campaigns.component.html'
})
export class CampaignReportComponent implements OnInit {

  campaigns: ICampaign[];
  campaignReports: Report<number>[];
  _users: User[];
  idUserSelect: number = 0;
  isLoading: boolean = true;

  displayedColumns = ['campaign', 'count'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private reportsService: ReportsService,
    private campaignsService: CampaignService,
    private _usersService: UsersService) {
      this.isLoading = false;
  }

  ngOnInit(): void {
    this._usersService.getAll().subscribe(
      response => {
        this._users = response.data;
        this.loadReports();
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadReports() {
    this.campaignsService.getAll().subscribe(
      res => {
        if (res.result == ResultCode.Error) {
          // handle error
        } else {
          this.campaigns = res.data;
        }
      },
      err => {
        // handle error
      }
    );
    this.getCustomerByCampaignByUser();
  }

  getCampaign(idCampaign: number): string {
    if(this.campaigns){
      return this.campaigns.find(c => c.id == idCampaign)!.name;
    }else{
      return "";
    }    
  }

  getCustomerByCampaignByUser(): void {
    this.isLoading = true;
    this.reportsService.customerByCampaign(this.idUserSelect).subscribe(
      res => {
        this.isLoading = false;
        if (res.result == ResultCode.Error) {
          // handle error
        } else {
          this.dataSource.data = res.data;
        }
      },
      err => {
        // handle error
      }
    );
  }

  private getUserById(idUser: number): User {
    if (this._users && typeof this._users.filter === 'function') {
      return this._users.filter(u => u.id === idUser)[0];
    } else {
      return null;
    }
  }

  public getNameByUserId(idUser: number): string {
    const u = this.getUserById(idUser);
    if (u && u !== null) {
      return u.firstname + ' ' + u.lastname;
    } else {
      return '';
    }
  }
}
