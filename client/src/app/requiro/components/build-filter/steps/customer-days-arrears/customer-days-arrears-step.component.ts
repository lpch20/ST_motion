import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StepComponentBase } from '../stepComponent';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-days-arrears',
  templateUrl: './customer-days-arrears-step.component.html',
  styleUrls: ['./customer-days-arrears-step.component.scss'],

})
export class CustomerDaysArrearsStepComponent extends StepComponentBase implements OnInit {

  completed: boolean;
  completedChange: EventEmitter<boolean>;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      min: new FormControl(),
      max: new FormControl()
    });
  }

  valueChange(event) {
    const min = event.type === 'min' ? event.min : this.formGroup.get('min').value;
    const max = event.type === 'max' ? event.max : this.formGroup.get('max').value;

    const valuesWellDefined = (!!min || min === 0) && (!!max || max === 0);
    const maxGreaterOrEqualsToMin = min <= max;

    const completed = (valuesWellDefined && maxGreaterOrEqualsToMin);

    if (completed !== this.step.completed) {
      this.step.completed = completed;
    }
  }

  getValues(): any[] {
    const min = this.formGroup.get('min').value;
    const max = this.formGroup.get('max').value;

    return [min, max];
  }
}
