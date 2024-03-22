import { Component, OnInit } from '@angular/core';
import { ResultCode } from '../../../../../datatypes/result';
import { Customer } from '../../../../../datatypes/Customer';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'fury-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  name: string = "";
  lastname: string = "";
  ci: string = "";
  phone: string = "";
  customersSearch: Customer[];

  addingId: number = 0;
  addingName: string = "";
  addingLastname: string = "";
  addingCI: string = "";
  addingMessage: string = "";

  addingEvent: boolean = false;

  constructor(private customerService: CustomersService) {
    this.customersSearch = new Array<Customer>();
  }

  ngOnInit() {
  }

  find(): void {
    this.addingEvent = false;
    this.customerService.find(this.name, this.lastname, this.ci, this.phone).subscribe(
      response => {
        if (response.result == ResultCode.OK) {
          this.customersSearch = response.data;
          //this.dataSource.data = response.data;
        } else {
          // handle error
          console.error(response);
        }
      },
      err => {
        // handle error
        console.error(err);
      }
    )
  }

  addEvent(id: number, names: string, lastnames: string, ci: string) {
    this.addingId = id;
    this.addingName = names;
    this.addingLastname = lastnames;
    this.addingCI  = ci;
    this.addingEvent = true;
  }

  isSearchDisabled() {
    let allEmpty = (!this.name || this.name == '') &&
      (!this.lastname || this.lastname == '') &&
      (!this.ci || this.ci == '') &&
      (!this.phone || this.phone == '');

    let enabled = allEmpty ? false :
      (!!this.name && this.name != '' && this.name.length >= 4 ||
        !!this.lastname && this.lastname != '' && this.lastname.length >= 3 ||
        !!this.ci && this.ci != '' && this.ci.length >= 3 ||
        !!this.phone && this.phone != '' && this.phone.length >= 3);
    return !enabled;
  }

}
