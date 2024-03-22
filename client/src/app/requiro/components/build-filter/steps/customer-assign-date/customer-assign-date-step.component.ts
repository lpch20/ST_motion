import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StepComponentBase } from '../stepComponent';

@Component({
  selector: 'customer-assign-date',
  templateUrl: './customer-assign-date-step.component.html',
  styleUrls: ['./customer-assign-date-step.component.scss'],

})
export class CustomerAssignDateStepComponent extends StepComponentBase implements OnInit {

  formGroup: FormGroup;

  dateFromCtrl: FormControl;
  dateToCtrl: FormControl;
  dateFrom: Date;
  dateTo: Date;

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
