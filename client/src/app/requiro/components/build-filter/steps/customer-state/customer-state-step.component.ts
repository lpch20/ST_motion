import { Component } from '@angular/core';
import { StepComponentBase } from '../stepComponent';

@Component({
  selector: 'customer-state',
  templateUrl: './customer-state-step.component.html',
  styleUrls: ['./customer-state-step.component.scss'],
})
export class CustomerStateStepComponent extends StepComponentBase {

  selected: string;
  
  getValues(): any[] {
    return [this.selected == 'mvd' ? "Montevideo" : "Interior"];
  }

  change(event) {
    this.step.completed = true;

    this.selected = event.value;
    this.applyFilter();
  }
}
