import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainCallComponent } from './main-call.component';
import { FuryCardModule } from 'app/core/common/card/card.module';
import { PageModule } from 'app/core/common/page/page.module';
import { MaterialModule } from 'app/core/common/material-components.module';
import { MainCallRoutingModule } from './main-call-routing.module';
import { DebtDataComponent } from 'app/requiro/components/debt-data/debt-data.component';
import { CustomerDataComponent } from '../customer-data/customer-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NextCustomersComponent } from '../next-customers/next-customers.component';
import { EventCustomerComponent } from '../event-customer/event-customer.component';
import { EventsCustomerComponent } from '../events-customer/events-customer.component';
import { BreakCallComponent } from '../break-call/break-call.component';
import { DlabTimerComponent } from '../dlab-timer/dlab-timer.component';
import { CustomerPlayerComponent } from '../customer-player/customer-player.component';

@NgModule({
  imports: [
    CommonModule,
    MainCallRoutingModule,
    MaterialModule,
    PageModule,
    FuryCardModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MainCallComponent,
    CustomerPlayerComponent,
    DebtDataComponent,
    DlabTimerComponent,
    CustomerDataComponent,    
    NextCustomersComponent,
    EventsCustomerComponent,
    EventCustomerComponent
  ]
})
export class MainCallModule { }

