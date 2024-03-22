import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BreakService } from '../../services/break.service';
import { Break } from '../../../../../../datatypes/Break';
import { MainCallDataServiceService } from '../../services/main-call-data-service.service';
import { Router } from '@angular/router';
import { ResultCode } from '../../../../../../datatypes/result';

@Component({
  selector: 'break-selector',
  templateUrl: './break-selector.component.html',
  styleUrls: ['./break-selector.component.scss']
})
export class BreakSelectorComponent implements OnInit {

  @Output() startBreakEvent = new EventEmitter<{ startBreak: boolean, typeBreak: number }>();
  breakInfo = { startBreak: false, typeBreak: 1 };
  breakTypes: Array<{ id: number, icon: string, label: string }> = [];
  showBreakSelector: boolean = true;
  // private currentBreakType: number = 2;
  isOpen: boolean = false;

  constructor(
    private mainCallData: MainCallDataServiceService,
    private breakService: BreakService,
    private router: Router) {
  }

  ngOnInit() {
    this.breakService.getBreakTypes().subscribe(
      response => {
        if (response.result == ResultCode.OK) {
          this.breakTypes = response.data;
        } else {
          console.error(response);
        }
      },
      error => {
        // error handling
        console.error(error);
      }
    );
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  startPause(): void {
    this.breakInfo.startBreak = true;
    let breakTime: Break = new Break(0, this.breakInfo.typeBreak, 5, new Date(), true);
    this.breakService.addBreak(breakTime).subscribe(
      response => {
        if (response.result == ResultCode.OK) {
          this.isOpen = false;
          this.router.navigate(['pausa']);
        } else {
          console.error(response);
        }
      },
      error => {
        // error handling
        console.error(error);
      }
    );

    this.mainCallData.sendBreakEvent(true, this.breakInfo.typeBreak);
    this.startBreakEvent.emit(this.breakInfo);
  }

  toggle(): void {
    this.showBreakSelector = !this.showBreakSelector;
  }
}
