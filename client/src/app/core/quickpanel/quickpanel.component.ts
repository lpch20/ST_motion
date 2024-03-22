import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../requiro/toolbar/schedule/schedule.service';
import { VSchedule } from '../../../../../datatypes/viewDataType/VSchedule';
import { MainCallDataServiceService } from '../../requiro/services/main-call-data-service.service';

@Component({
  selector: 'fury-quickpanel',
  templateUrl: './quickpanel.component.html',
  styleUrls: ['./quickpanel.component.scss']
})
export class QuickpanelComponent implements OnInit {
  schedule: VSchedule[];

  constructor(
    private mainCallData: MainCallDataServiceService,
    private scheduleService: ScheduleService) { }

  customerDatail(idUser: number): void {
    this.mainCallData.sendCustomerIdEvent(idUser);
  }

  toogleResolved($event,id):void{
    this.scheduleService.updateScheduleResolve(id,$event.checked).subscribe(
      response => {
        console.log(response);
      }
    );    
  }

  ngOnInit() {
    this.mainCallData.schedule.subscribe(
      response => {
        if(response){
          this.getSchedule();
        }
      }
    );   
    this.getSchedule(); 
  }

  private getSchedule():void{
    this.scheduleService.getScheduleDayByUser().subscribe(
      response => {
        if (response.result > 0) {
          this.schedule = response.data;
          this.schedule.sort(function(a, b){
            if(a.active > b.active){
              return 1;
            }else{
              return -1;
            }            
          });
        }
      }
    )
  }
}
