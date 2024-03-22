import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { ClientEvent } from '../../../../../../datatypes/clientEvent';
import { Customer } from '../../../../../../datatypes/Customer';
import { EventTypeService } from '../../services/event-type.service';
import { EventType } from '../../../../../../datatypes/eventType';
import { UsersService } from '../../services/users.service';
import { CustomerModel } from '../../models/customerModel';
import { CustomersService } from '../../services/customers.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'events-customer',
  templateUrl: './events-customer.component.html',
  styleUrls: ['./events-customer.component.scss']
})
export class EventsCustomerComponent implements OnInit {
  @Input() currentCustomer: Customer = null;
  customerEvents: ClientEvent[];
  eventTypeSelected: number = 0;
  eventTypes: EventType[];
  //TODO cambiar por users
  users: Map<number, any>;
  private customerModel: CustomerModel;
  private _customerId: number;

  get customerId(): number {
    return this._customerId;
  }

  @Input('customer-id')
  set customerId(customerId: number) {
    if (customerId && customerId != 0 && customerId != this._customerId) {
      this._customerId = customerId;
      this.customerModel.setCurrentCustomer(this._customerId, (customer) => {
        console.log(customer, "*****");
        this.customerModel.getCustomerEventByCustomerByType(customerId, this.eventTypeSelected, (events) => {
          this.customerEvents = events;
        });
      });
    }
  }


  constructor(
    private eventTypeService: EventTypeService,
    private userService: UsersService,
    private customerService: CustomersService,
    private eventService: EventsService
  ) {
    this.customerModel = new CustomerModel(customerService, eventService);
  }

  ngOnInit() {
    this.users = new Map<number, any>();
    this.userService.getAll().subscribe(
      responseUsers => {
        if (responseUsers.result > 0) {
          for (let i = 0; i < responseUsers.data.length; i++) {
            this.users.set(responseUsers.data[i].id, responseUsers.data[i]);
          }
        } else {
          console.log(responseUsers.message);
        }
      }
    );

    this.eventTypeService.getAll().subscribe(
      response => {
        this.eventTypes = response.data;
      }
    );

    if (this.currentCustomer && this.currentCustomer !== null) {
      this.customerModel.getCustomerEventByCustomerByType(this._customerId, this.eventTypeSelected,
        (events) => {
          this.customerEvents = events;
        }
      );
      //this.currentCustomer.getClientEventByType(this.eventTypeSelected);
    } else {
      console.log(this.currentCustomer, 1);
    }
  }

  /*
  ngOnChanges(changes: SimpleChanges) {
    const customer: SimpleChange = changes.currentCustomer;
    this.currentCustomer = customer.currentValue;
    if (this.currentCustomer && this.currentCustomer !== null) {
      this.customerEvents = this.customerModel.getCustomerEventByCustomerByType(this.currentCustomer.id,this.eventTypeSelected);
    }
    console.log(this.currentCustomer,2);
  }
  */

  getEventTypeIcon(id: number): string {
    let icon = "";
    if (this.eventTypes !== null && this.eventTypes !== undefined) {
      icon = this.eventTypes.filter(e => e.id === id)[0].icon;
    }
    return icon;
  }

  changeEventType(id: number): void {
    console.log(id,this._customerId);
    this.customerModel.getCustomerEventByCustomerByType(this._customerId, id,
      (events) => {
        console.log(events);
        this.customerEvents = events;
      }
    );
  }
}
