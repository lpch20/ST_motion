import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LIST_FADE_ANIMATION } from '../../../core/common/list.animation';
import { MainCallDataServiceService } from '../../services/main-call-data-service.service';
import { Customer } from '../../../../../../datatypes/Customer';
import { VSchedule } from '../../../../../../datatypes/viewDataType/VSchedule';
import { ScheduleService } from './schedule.service';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  animations: [...LIST_FADE_ANIMATION]
})
export class ScheduleComponent implements OnInit {

  subjectCtrl:FormControl;
  dateCtrl:FormControl;
  hourCtrl:FormControl;
  minuteCtrl:FormControl;
  phoneCtrl:FormControl;  
  isOpen: boolean;
  scheduleTime:{hour: number, minute: number} = {hour: 0, minute: 0};
  // model: NgbDateStruct;
  //date: {year: number, month: number};
  customer:Customer;
  currentSchedule:VSchedule; 

  constructor(private mainCallData:MainCallDataServiceService,
    private scheduleService : ScheduleService,
    private customerService : CustomersService
  ) { 
    
  }

  ngOnInit() {
    this.currentSchedule = new VSchedule();
    this.subjectCtrl = new FormControl('', {
      validators: Validators.required
    });
    this.dateCtrl = new FormControl('', {
      validators: Validators.required
    });
    this.hourCtrl = new FormControl('', {
      validators: Validators.required
    });
    this.minuteCtrl = new FormControl('', {
      validators: Validators.required
    });
    this.phoneCtrl = new FormControl('', {
      validators: Validators.required
    });

    this.currentSchedule.date = moment().toDate();

    this.mainCallData.customerIdEvent.subscribe(
      responseCustomerId => {
        this.customerService.getCustomersById(responseCustomerId).subscribe(
          responseCustomer =>{
            console.log(responseCustomer);
            if(responseCustomer.result > 0 && responseCustomer.data){
              this.customer = responseCustomer.data;
              this.currentSchedule.idCustomer = this.customer.id;   
              this.currentSchedule.phoneNumber = this.customer.phones[0];
            }
          }          
        );
        //console.log(responseCustomerId,"-----");
      }
    );

    this.mainCallData.currentCustomer.subscribe(
      customer => {
        if (customer !== null) {
          this.customer = customer;
          this.currentSchedule.idCustomer = this.customer.id;   
          this.currentSchedule.phoneNumber = this.customer.phones[0];
          //this.customerEvents = this.currentCustomer.getClientEventByType(this.eventTypeSelected);
        }
      });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    //this.isOpen = false;
  }

  changePhone(phoneNumber:number){
    console.log(phoneNumber);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  saveSchedule():void{
    //console.log(this.currentSchedule);
    this.currentSchedule.date.setHours(this.scheduleTime.hour);
    this.currentSchedule.date.setMinutes(this.scheduleTime.minute);    
    this.scheduleService.addSchedule(this.currentSchedule).subscribe(
      response => {
        if(response.result >0){          
          this.isOpen = false;       
          this.currentSchedule.subject = "";
          this.scheduleTime.hour = 0;
          this.scheduleTime.minute = 0;
          this.mainCallData.sendNewScheduleEvent(true);
        }        
      }
    );
  }
}