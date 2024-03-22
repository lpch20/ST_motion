import { Component, OnInit, ViewChild } from '@angular/core';
import { Campaign } from '../../../../../../datatypes/Campaign';
import { CampaignService } from '../../services/campaign.service';
import { FormControl, Validators } from '@angular/forms';
import { QueueService } from '../../services/queue.service';
import { Customer } from '../../../../../../datatypes/Customer';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'assign-customers',
  templateUrl: './assign-customers.component.html',
  styleUrls: ['./assign-customers.component.scss']
})
export class AssignCustomersComponent implements OnInit {

  @ViewChild(MatPaginator) paginatorQueueCustomers: MatPaginator;
  displayedColumns = ['assign', 'ci', 'names'];
  filteredStates: Observable<any[]>;
  campaigns: Campaign[];
  campaignSelected: Campaign;
  ciSelected: string = '';
  queues: any[];
  loadingEvents: boolean = false;
  filtredQueueFromChange: Observable<any[]>;
  filtredQueueToChange: Observable<any[]>;
  queueSelectedFromChange: string;
  queueSelectedToChange: string;
  customersToChange: Customer[] = new Array<Customer>();
  queueFromChangeCtrl: FormControl;
  queueToChangeCtrl: FormControl;
  dataSourceQueue = new MatTableDataSource();
  constructor(private campaignService: CampaignService, private queueService: QueueService) { }

  filterStates(name: string) {
    return this.queues.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) > -1).slice(0, 10);
  }

  ngOnInit() {

    this.queueFromChangeCtrl = new FormControl('', {
      validators: Validators.required
    });

    this.queueToChangeCtrl = new FormControl('', {
      validators: Validators.required
    });

    this.campaignService.getAll().subscribe(
      responseCampaigns => {
        if (responseCampaigns.result > 0) {
          this.campaigns = responseCampaigns.data;
        }
      }
    );

    this.queueService.getAll().subscribe(
      responseQueue => {
        this.queues = responseQueue.data;

        this.filtredQueueFromChange = this.queueFromChangeCtrl.valueChanges.pipe(
          startWith(''),
          map(state => state ? this.filterStates(state) : this.queues.slice())
        );

        this.filtredQueueToChange = this.queueToChangeCtrl.valueChanges.pipe(
          startWith(''),
          map(state => state ? this.filterStates(state) : this.queues.slice())
        );
      }
    );

  }

  trackByFn(index: any, item: any) {
    return index;
  }

  public getCustomersByQueue(): void {
    const queueFrom = this.getEntityByName(this.queueSelectedFromChange, this.queues).id;
    let idCampaign: number = 0;
    if (this.campaignSelected) {
      idCampaign = this.campaignSelected.id;
    }
    let ci = '-';
    if (this.ciSelected !== '') {
      ci = this.ciSelected;
    }

    this.queueService.getCustomersByQueue(queueFrom, idCampaign, ci).subscribe(
      responseQueue => {
        const cantCustomersToChange = responseQueue.data.length;
        for (let i = 0; i < cantCustomersToChange; i++) {
          responseQueue.data[i].assigned = false;
        }

        this.customersToChange = responseQueue.data;
        this.dataSourceQueue.data = responseQueue.data;
      }
    );
  }

  saveChangeCustomerQueue(): void {
    const customerToAssign: Customer[] = this.customersToChange.filter(c => c.assigned === true);
    const queueFrom = this.getEntityByName(this.queueSelectedFromChange, this.queues).id;
    const queueTo = this.getEntityByName(this.queueSelectedToChange, this.queues).id;

    this.queueService.updateCustomersQueue(queueFrom, queueTo, customerToAssign).subscribe(
      response => {
        this.getCustomersByQueue();
      }
    );
    console.log(customerToAssign);
  }

  ngAfterViewInit() {
    this.dataSourceQueue.paginator = this.paginatorQueueCustomers;
  }

  private getEntityByName(name: string, collection: any[]): any {
    let entity = null;
    let matchEntity: boolean = false;
    if (name && name !== '') {
      for (let i = 0; i < collection.length && !matchEntity; i++) {
        if (collection[i].name.toLowerCase() === name.toLowerCase()) {
          entity = collection[i];
          matchEntity = true;
        }
      }
    }
    return entity;
  }

}
