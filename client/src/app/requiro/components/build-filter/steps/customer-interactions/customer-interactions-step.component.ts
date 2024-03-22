import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StepComponentBase } from '../stepComponent';
import * as moment from 'moment';

@Component({
  selector: 'customer-interactions',
  templateUrl: './customer-interactions-step.component.html',
  styleUrls: ['./customer-interactions-step.component.scss'],

})
export class CustomerInteractionsStepComponent extends StepComponentBase implements OnInit {

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
    let min = event.type == 'min' ? event.min : this.formGroup.get('min').value;
    let max = event.type == 'max' ? event.max : this.formGroup.get('max').value;

    let valuesWellDefined = (!!min || min == 0) && (!!max || max == 0);
    let maxGreaterOrEqualsToMin = min <= max;

    let completed = (valuesWellDefined && maxGreaterOrEqualsToMin);
    if (completed != this.step.completed) {
      this.step.completed = completed;
    }
  }

  getValues(): any[] {
    let min = this.formGroup.get('min').value;
    let max = this.formGroup.get('max').value;

    return [min, max];
  }
}
