import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'break-call',
  templateUrl: './break-call.component.html',
  styleUrls: ['./break-call.component.scss']
})
export class BreakCallComponent implements OnInit, OnChanges {

  @Output() messageEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() breakType: any;
  @Input() timeBreak: number;
  @Input() breakRunning: boolean;
  pauseTime: string;
  password: string;
  passwordCtrl: FormControl;
  private subscription: Subscription;
  private timer: Observable<any>;
  constructor() { }

  ngOnInit() {
    this.passwordCtrl = new FormControl('', { validators: Validators.required });
    if (this.breakRunning) {
      this.init();
    } else {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }

  init(): void {
    this.timer = Observable.timer(0, 1000);
    this.subscription = this.timer.subscribe(t => {
      this.timeBreak++;
      console.log(this.timeBreak);
      const minute = Math.floor(this.timeBreak / 60);
      let minuteString: string;
      if (minute < 10) {
        minuteString = '0' + minute;
      } else {
        minuteString = minute.toString();
      }

      const second = this.timeBreak % 60;
      let secondString: string;
      if (second < 10) {
        secondString = '0' + second;
      } else {
        secondString = second.toString();
      }
      this.pauseTime = minuteString + ':' + secondString;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    const breakRunning: SimpleChange = changes.breakRunning;
    if (breakRunning) {
      this.breakRunning = breakRunning.currentValue;
      if (this.breakRunning && !this.timer && !this.subscription) {
        this.init();
      }
    }
  }

  stopTimer(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  brakeEnd(): void {
    this.messageEvent.emit(true);
  }

}