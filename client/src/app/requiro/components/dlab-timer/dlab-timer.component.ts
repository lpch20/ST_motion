import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';

@Component({
  selector: 'dlab-timer',
  templateUrl: './dlab-timer.component.html',
  styleUrls: ['./dlab-timer.component.scss']
})
export class DlabTimerComponent implements OnInit, OnChanges {
  @Input() time: number;
  @Input() player: boolean;
  @Output() timer: EventEmitter<boolean>;
  running: boolean = false;
  finished:boolean;
  constructor() {
    this.timer = new EventEmitter();    
  }

  ngOnInit() {    
    console.log("dlabTimer - ngOnInit");
    this.startTimerCountDown();    
  }

  ngOnChanges(changes: SimpleChanges) {
    const eventData: SimpleChange = changes.player;
    this.player = eventData.currentValue;
    if(!eventData.previousValue && eventData.currentValue){
      this.startTimerCountDown();
    }
  }

  startTimerCountDown(): void {
    console.log("dlabTimer - startTimerCountDown");    
    this.recursiveCountdown();
  }

  recursiveCountdown() {
    console.log("dlabTimer - recursiveCountdown-" + this.time);
    if(this.player){
      this.running = true;
      console.log("dlabTimer - recursiveCountdown2-" + this.time);
      setTimeout(() => {
        this.time--;
        if (this.time > 0) {
          this.recursiveCountdown();
        } else {
          this.running = false;        
          this.timer.emit(true);
        }
      }, 1000);
    }
  }
}
