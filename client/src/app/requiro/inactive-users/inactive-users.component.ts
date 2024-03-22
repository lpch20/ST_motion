import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomersService } from '../services/customers.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ScrollbarDirective } from 'app/core/common/scrollbar/scrollbar.directive';
import { QueueService } from '../services/queue.service';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../../../../../datatypes/Customer';

@Component({
  selector: 'inactive-users',
  templateUrl: './inactive-users.component.html',
  styleUrls: ['./inactive-users.component.scss']
})
export class InactiveUsersComponent implements OnInit {
  displayedColumns = ['assign', 'ci', 'names'];
  dataSource = new MatTableDataSource();  
  //@ViewChild('contentScroll', { read: ScrollbarDirective }) private contentScroll: ScrollbarDirective;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingEvents: boolean = false;
  queueCtrl: FormControl;
  filteredStates: Observable<any[]>;  
  customers: Customer[];  
  queues: any[];
  queueSelected: string;
  cantCustomers: number = 5;
  constructor(
    private fb: FormBuilder,
    private inactiveCustomers: CustomersService,
    private queueService: QueueService
  ) {
  }

  filterStates(name: string) {
    return this.queues.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) > -1).slice(0, 10);
  }

  ngOnInit() {
    this.queueCtrl = new FormControl('', {
      validators: Validators.required
    });

    this.loadingEvents = false;
    this.queueService.getAll().subscribe(
      responseQueue => {
        this.queues = responseQueue.data;
        this.filteredStates = this.queueCtrl.valueChanges.pipe(
          startWith(''),
          map(state => state ? this.filterStates(state) : this.queues.slice())
        );
      }
    );
    this.getInactiveUsers();
  }  

  private getInactiveUsers(): void {
    this.loadingEvents = true;
    this.inactiveCustomers.getCustomersNotAssignedQueue().subscribe(
      customers => {
        this.loadingEvents = false;
        let cantCustomers = customers.data.length;
        for (let i = 0; i < cantCustomers; i++) {
          customers.data[i].assigned = false;
        }
        this.customers = customers.data;
        this.dataSource.data = customers.data;
      }
    );
  }

  private getEntityByName(name: string, collection: any[]): any {
    let entity = null;
    let matchEntity: boolean = false;
    if (name && name !== "") {
      for (let i = 0; i < collection.length && !matchEntity; i++) {
        if (collection[i].name.toLowerCase() === name.toLowerCase()) {
          entity = collection[i];
          matchEntity = true;
        }
      }
    }
    return entity;
  }

  saveData(): void {
    let customerToAssign: Customer[] = this.customers.filter(c => c.assigned === true);
    let queue = this.getEntityByName(this.queueSelected, this.queues);

    if (customerToAssign.length === 0) {
      alert("Al menos debe escoger un cliente");
    } else {
      this.queueService.assignCustomersQueue(queue.id, customerToAssign).subscribe(
        response => {
          console.log(response);
          if (response.result > 0) {
            this.getInactiveUsers();
          }
        }
      )
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
