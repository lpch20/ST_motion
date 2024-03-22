import { Component, OnInit } from '@angular/core';
import { SmsService } from '../../services/sms.service';
import { CustomersService } from '../../services/customers.service';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  templateUrl: './sms-sender.component.html',
  styleUrls: ['./sms-sender.component.scss']
})
export class SmsSenderComponent implements OnInit {

  result: any;
  celular: string;

  constructor(private smsService: SmsService,private customerService:CustomersService) { }

  ngOnInit() {
  }

  downloadCustomers():void{
    this.customerService.getCustomerForSMS().subscribe(
      responseSMS => {
        console.log(responseSMS);
        if(responseSMS.result > 0 && responseSMS.data && responseSMS.data.length > 0){
          this.exportCSV(responseSMS.data);
        }
      }
    )
  }


  exportCSV(customers:{id:string,ci:string,names:string,lastnames:string,phone:string}[]): void {
    
    var options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true
    };        

    let data: {id:string,ci:string,names:string,phone:string}[] = 
          new Array<{id:string,ci:string,names:string,phone:string}>();
    //name, address , tel
    data.push({id:"id",ci:"ci",names:"Nombres",phone:"Telefono"});
    for (let i = 0; i < customers.length; i++) {
      let line = customers[i];
      console.log(line.phone);
      data.push({
            id: line.id,
            ci: line.ci,names: line.names + line.lastnames,
            phone:line.phone
           });
    }
    //
    new Angular5Csv(data, 'Clientes', options);
    
    
  }

  send(phone: string): void {
    this.smsService.sendSMS(phone).subscribe(
      response => {
        this.result = JSON.stringify(response);
      },
      error => {
        this.result = JSON.stringify(error);
      }
    );
  }
}


// https://190.64.151.34:8888/stsms/WSsms.php

// "token":"s1mpl3t3chSMS!","id_camp":"1","arrayCel":["096153344","099999999"]}
