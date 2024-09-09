import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../../../../datatypes/Customer';
import { ResultCode } from '../../../../../datatypes/result';
import { MatPaginator, MatSort, MatTableDataSource } from '../../../../node_modules/@angular/material';
import { LIST_FADE_ANIMATION } from '../../core/common/list.animation';
import { CustomersService } from '../services/customers.service';
import { MainCallDataServiceService } from '../services/main-call-data-service.service';

@Component({
  selector: 'search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.scss'],
  animations: [...LIST_FADE_ANIMATION]
})

export class SearchCustomerComponent implements OnInit, AfterViewInit {
  isOpen: boolean;
  customersSearch: Customer[];
  @ViewChild('input', { read: ElementRef }) input: ElementRef;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  name: string;
  lastname: string;
  ci: string;
  phone: string;
  canSearch = true;

  dataSource = new MatTableDataSource();
  displayedColumns = ['names', 'lastnames', 'ci'];

  constructor(
    private mainCallData: MainCallDataServiceService,
    private customerService: CustomersService) {
    this.customersSearch = new Array<Customer>();
  }

  ngOnInit() {
    this.clearFields();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  customerDatail(idUser: number): void {
    this.clearResults();

    this.mainCallData.sendCustomerIdEvent(idUser);

    this.clearResults();
    this.clearFields();
    this.toggleDropdown();
  }

  private clearResults() {
    this.customersSearch = [];
    this.dataSource.data = [];
  }

  private clearFields() {
    this.name = '';
    this.lastname = '';
    this.ci = '';
    this.phone = '';
  }

  find(): void {
    this.canSearch = false;
    this.customerService.find(this.name, this.lastname, this.ci, this.phone).subscribe(
      response => {
        if (response.result == ResultCode.OK) {
          this.customersSearch = response.data;
          this.dataSource.data = response.data;
        } else {
          // handle error
          console.error(response);
        }
        this.canSearch = true;
      },
      err => {
        // handle error
        console.error(err);
        this.canSearch = true;
      }
    );
  }

  dismiss(notification, event) {
    event.stopPropagation();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.mainCallData.sendToggleFlagEvent(this.isOpen);

  }

  onClickOutside() {
    this.isOpen = false;
    this.mainCallData.sendToggleFlagEvent(this.isOpen);
  }

  isSearchDisabled() {
    let allEmpty = (!this.name || this.name == '') &&
      (!this.lastname || this.lastname == '') &&
      (!this.ci || this.ci == '') &&
      (!this.phone || this.phone == '');

    let enabled = allEmpty ? false :
      (!!this.name && this.name != '' && this.name.length >= 3 ||
        !!this.lastname && this.lastname != '' && this.lastname.length >= 3 ||
        !!this.ci && this.ci != '' && this.ci.length >= 3 ||
        !!this.phone && this.phone != '' && this.phone.length >= 3);

    //console.log(`${!enabled} && ${!this.canSearch}`);
    return !enabled || !this.canSearch;
  }
}
