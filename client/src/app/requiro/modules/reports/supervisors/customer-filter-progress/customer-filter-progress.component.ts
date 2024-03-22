import { Component, OnInit } from '@angular/core';
import { FiltersService } from '../../../../services/filters.service';
import { UsersService } from '../../../../services/users.service';
import { IUser } from '../../../../../../../../datatypes/user';
import { FilterProgress } from '../../../../../../../../datatypes/filter/filter-progress';
import { CampaignService } from '../../../../services/campaign.service';
import { ICampaign } from '../../../../../../../../datatypes/Campaign';
import { FiltersProgress } from '../../../../../../../../datatypes/filter/filters';
import { ResultCode } from '../../../../../../../../datatypes/result';

@Component({
  selector: 'customer-filter-progress-report',
  templateUrl: './customer-filter-progress.component.html',
  styleUrls: ['./customer-filter-progress.component.scss'],
})
export class CustomerFilterProgressReportComponent implements OnInit {
  users: IUser[];
  campaigns: ICampaign[];
  gsFilters: UIFiltersProgress[]

  constructor(private filtersService: FiltersService,
    private usersService: UsersService,
    private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.filtersService.getFilters().subscribe(res => {
      this.gsFilters = res.data.map(f => <UIFiltersProgress>Object.assign({
        loading: false,
        error: false,
        filters: f.filters.map(ff => <FilterProgress>Object.assign({ percentage: 0 }, ff))
      }, f));
    });
    this.usersService.getAll().subscribe(res => {
      this.users = res.data;
    });
    this.campaignService.getAll().subscribe(res => {
      this.campaigns = res.data;
    });
  }

  filtersLoaded(): boolean {
    return !!this.users && !!this.campaigns;
  }

  getAgent(agentId: number): string {
    var u = this.users.find(u => u.id == agentId);
    return u ? u.firstname + ' ' + u.lastname : null;
  }

  getCampaign(campaignId: number): string {
    let c: ICampaign = this.campaigns.find(u => u.id == campaignId);
    return c ? c.name : null;
  }

  getFriendlyFilterName(name: string): string {
    let friendlyName: string;
    switch (name) {
      case 'rango-edad':
        friendlyName = 'Por rango de edad';
      case 'fecha-asignacion':
        friendlyName = 'Por fecha de asignación';
        break;
      case 'monto-deuda':
        friendlyName = 'Por monto de deuda';
        break;
      case 'por-departamento':
        friendlyName = 'Por departamento';
        break;
      case 'por-campania':
        friendlyName = 'Por campaña';
        break;
      case 'gestiones':
        friendlyName = 'Por cantidad de gestiones';
        break;
      default:
        friendlyName = 'filtro indefinido'
        break;
    }
    return friendlyName;
  }

  getFriendlyFilterValues(name: string, values: string): string {
    let friendlyValues: string;
    switch (name) {
      case 'rango-edad':
        friendlyValues = `Entre ${values.split(',')[0]} y ${values.split(',')[1]} años`;
      case 'fecha-asignacion':
        friendlyValues = `Entre el ${values.split(',')[0]} y ${values.split(',')[1]}`;
        break;
      case 'monto-deuda':
        friendlyValues = `Entre $${values.split(',')[0]} y $${values.split(',')[1]} `;
        break;
      case 'por-departamento':
        friendlyValues = `Clientes de${values.includes('Montevideo') ? ' Montevideo' : 'l interior'}`;
        break;
      case 'por-campania':
        friendlyValues = `Clientes de campañas: ${values.split(',').map(v => this.getCampaign(parseInt(v))).join(', ')}`;
        break;
      case 'gestiones':
        friendlyValues = `Entre ${values.split(',')[0]} y ${values.split(',')[1]}`;
        break;
      default:
        friendlyValues = values;//'filtro indefinido'
        break;
    }
    return friendlyValues;
  }

  getOrderedFilters(fs: FilterProgress[]): FilterProgress[] {
    return fs.sort((f1, f2) => f1.order - f2.order);
  }

  loadFilterProgress(groupItemFilters: UIFiltersProgress) {
    groupItemFilters.loaded = false;
    groupItemFilters.loading = true;
    groupItemFilters.error = false;

    this.filtersService.getFilterProgress(groupItemFilters.group).subscribe(
      res => {
        groupItemFilters.loading = false;
        if (res.result == ResultCode.Error) {
          groupItemFilters.loaded = false;
          groupItemFilters.error = true;
          console.error(res.message);
        } else {
          groupItemFilters.filters.forEach(g => { g.percentage = 0; });
          res.data.forEach(r => {
            groupItemFilters.filters.find(f => f.name === r.name).percentage = r.percentage;
          });
          groupItemFilters.loaded = true;
        }
      },
      err => {
        groupItemFilters.loading = false;
        groupItemFilters.loaded = false;
        groupItemFilters.error = true;
      }
    );
  }
}

export interface UIFiltersProgress extends FiltersProgress {
  loaded: boolean;
  loading: boolean;
  error: boolean;
}