import { Component, OnInit, Input, SimpleChanges, OnChanges, SimpleChange } from '@angular/core';
import { Customer } from '../../../../../../datatypes/Customer';

@Component({
  selector: 'next-customers',
  templateUrl: './next-customers.component.html',
  styleUrls: ['./next-customers.component.scss']
})
export class NextCustomersComponent implements OnInit,OnChanges {
  @Input() customers: Customer[];
  nextCustomers: Customer[];
  showData: boolean = true;
  constructor() {
  }

  ngOnInit() {    
    this.getNextCustomer();
  }


  ngOnChanges(changes: SimpleChanges) {
    const customers: SimpleChange = changes.customers;
    this.customers = customers.currentValue;
    this.getNextCustomer();    
  }

  getNextCustomer(): void {
    if(this.customers){
      this.nextCustomers = this.customers.slice(1);
    }    
  }

  toggle(): void {
    this.showData = !this.showData;
  }
}