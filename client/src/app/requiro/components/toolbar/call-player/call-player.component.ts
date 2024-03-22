import { Component, OnInit } from '@angular/core';
import { MainCallDataServiceService } from '../../../services/main-call-data-service.service';

@Component({
  selector: 'call-player',
  templateUrl: './call-player.component.html',
  styleUrls: ['./call-player.component.scss']
})
export class CallPlayerComponent implements OnInit {

  playerStatus:number = 0;
  constructor(private mainCallService:MainCallDataServiceService) { }

  ngOnInit() {
  }

  toogle():void{
    this.playerStatus = (this.playerStatus + 1) % 2;
    if(this.playerStatus){
      this.mainCallService.sendPlayerEvent(true);
    }else{
      this.mainCallService.sendPlayerEvent(false);
    }
  }

}
